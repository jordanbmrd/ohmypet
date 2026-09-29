import { createHmac, timingSafeEqual } from "node:crypto";
import { AppError } from "../lib/errors.js";
import type { OrderRecord, ShippingAddress } from "../types/order.js";
import { getStripeSecrets } from "./secretsService.js";

/**
 * Minimal Stripe client over fetch (same approach as openaiService): hosted
 * Checkout Sessions for payment + webhook signature verification. Stripe's
 * hosted page handles cards, Apple Pay / Google Pay, 3-D Secure, the shipping
 * address and the customer email, so no card data ever touches our servers.
 */

const API = "https://api.stripe.com/v1";
/** Countries Checkout accepts a shipping address for. */
const SHIPPING_COUNTRIES = ["FR", "BE", "CH", "LU", "MC"];
/** Maximum age of a webhook signature before it is rejected as a replay. */
const WEBHOOK_TOLERANCE_SECONDS = 300;

type FormValue = string | number | boolean | FormValue[] | { [k: string]: FormValue };

/** Encodes nested params the way Stripe expects: a[b][0][c]=v. */
export function toStripeForm(params: Record<string, FormValue>): URLSearchParams {
  const out = new URLSearchParams();
  const walk = (prefix: string, value: FormValue) => {
    if (Array.isArray(value)) {
      value.forEach((v, i) => walk(`${prefix}[${i}]`, v));
    } else if (typeof value === "object") {
      for (const [k, v] of Object.entries(value)) walk(`${prefix}[${k}]`, v);
    } else {
      out.append(prefix, String(value));
    }
  };
  for (const [k, v] of Object.entries(params)) walk(k, v);
  return out;
}

async function stripeRequest<T>(path: string, body: URLSearchParams): Promise<T> {
  const { secretKey } = await getStripeSecrets();
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new AppError(502, "PAYMENT_PROVIDER_ERROR", `Stripe ${path} ${res.status}: ${detail.slice(0, 500)}`);
  }
  return (await res.json()) as T;
}

export async function createCheckoutSession(
  order: OrderRecord,
  siteUrl: string,
): Promise<{ id: string; url: string }> {
  const base = siteUrl.replace(/\/$/, "");
  const params: Record<string, FormValue> = {
    mode: "payment",
    locale: "fr",
    client_reference_id: order.orderId,
    metadata: { orderId: order.orderId },
    payment_intent_data: { metadata: { orderId: order.orderId } },
    success_url: `${base}/commande/confirmation?order=${order.orderId}`,
    cancel_url: `${base}/panier?paiement=annule`,
    shipping_address_collection: { allowed_countries: SHIPPING_COUNTRIES },
    phone_number_collection: { enabled: true },
    line_items: order.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: order.currency,
        unit_amount: item.unitPriceCents,
        product_data: {
          name: item.productName,
          description: item.description,
          metadata: { jobId: item.jobId, theme: item.theme },
        },
      },
    })),
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: order.shippingCents === 0 ? "Livraison offerte" : "Livraison suivie",
          fixed_amount: { amount: order.shippingCents, currency: order.currency },
          delivery_estimate: {
            minimum: { unit: "business_day", value: 4 },
            maximum: { unit: "business_day", value: 8 },
          },
        },
      },
    ],
  };

  const session = await stripeRequest<{ id: string; url: string }>(
    "/checkout/sessions",
    toStripeForm(params),
  );
  return { id: session.id, url: session.url };
}

export interface StripeEvent {
  id: string;
  type: string;
  data: { object: Record<string, unknown> };
}

/**
 * Verifies the `Stripe-Signature` header (HMAC-SHA256 of "<t>.<raw body>")
 * and returns the parsed event. Throws on a bad or stale signature.
 */
export function verifyWebhook(
  rawBody: string,
  signatureHeader: string | undefined,
  webhookSecret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
): StripeEvent {
  const invalid = (m: string) => new AppError(400, "INVALID_SIGNATURE", m);
  if (!signatureHeader) throw invalid("Missing Stripe-Signature header");

  let timestamp: number | undefined;
  const signatures: string[] = [];
  for (const part of signatureHeader.split(",")) {
    const [key, value] = part.split("=", 2);
    if (key === "t") timestamp = Number(value);
    if (key === "v1" && value) signatures.push(value);
  }
  if (!timestamp || signatures.length === 0) {
    throw invalid("Malformed Stripe-Signature header");
  }
  if (Math.abs(nowSeconds - timestamp) > WEBHOOK_TOLERANCE_SECONDS) {
    throw invalid("Stripe signature timestamp outside tolerance");
  }

  const expected = createHmac("sha256", webhookSecret)
    .update(`${timestamp}.${rawBody}`, "utf8")
    .digest();
  const matches = signatures.some((sig) => {
    const given = Buffer.from(sig, "hex");
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
  if (!matches) throw invalid("Stripe signature mismatch");

  return JSON.parse(rawBody) as StripeEvent;
}

interface StripeAddress {
  line1?: string | null;
  line2?: string | null;
  postal_code?: string | null;
  city?: string | null;
  country?: string | null;
}

interface StripeCheckoutSession {
  payment_status?: string;
  customer_details?: { email?: string | null; name?: string | null; phone?: string | null } | null;
  // API versions ≥ 2025-03 moved shipping under collected_information.
  collected_information?: { shipping_details?: { name?: string | null; address?: StripeAddress | null } | null } | null;
  shipping_details?: { name?: string | null; address?: StripeAddress | null } | null;
}

/** Extracts the buyer's email and shipping address from a Checkout Session. */
export function extractCustomer(session: Record<string, unknown>): {
  paid: boolean;
  email?: string;
  shippingAddress?: ShippingAddress;
} {
  const s = session as StripeCheckoutSession;
  const shipping = s.collected_information?.shipping_details ?? s.shipping_details;
  const addr = shipping?.address;
  const clean = <T>(v: T | null | undefined) => v ?? undefined;

  return {
    paid: s.payment_status === "paid" || s.payment_status === "no_payment_required",
    email: clean(s.customer_details?.email),
    shippingAddress: shipping
      ? {
          name: clean(shipping.name) ?? clean(s.customer_details?.name),
          line1: clean(addr?.line1),
          line2: clean(addr?.line2),
          postalCode: clean(addr?.postal_code),
          city: clean(addr?.city),
          country: clean(addr?.country),
          phone: clean(s.customer_details?.phone),
        }
      : undefined,
  };
}
