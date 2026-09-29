import { createHmac } from "node:crypto";
import { describe, it, expect } from "vitest";
import { priceLine, shippingFor, SHIPPING_CENTS } from "../src/lib/catalog.js";
import { extractCustomer, toStripeForm, verifyWebhook } from "../src/services/stripeService.js";

describe("catalog pricing", () => {
  it("adds option deltas to the base price", () => {
    const line = priceLine("print", { size: "30x40", frame: "oak" });
    expect(line.unitPriceCents).toBe(6900);
    expect(line.description).toBe("Format : 30 × 40 cm · Cadre : Chêne");
  });

  it("rejects missing, unknown and extra options", () => {
    expect(() => priceLine("print", { size: "30x40" })).toThrow();
    expect(() => priceLine("mug", { color: "pink" })).toThrow();
    expect(() => priceLine("mug", { color: "white", size: "xl" })).toThrow(/Unknown option/);
  });

  it("waives shipping from the threshold", () => {
    expect(shippingFor(4900)).toBe(SHIPPING_CENTS);
    expect(shippingFor(6000)).toBe(0);
  });
});

describe("toStripeForm", () => {
  it("encodes nested objects and arrays with bracket keys", () => {
    const form = toStripeForm({
      mode: "payment",
      line_items: [{ quantity: 2, price_data: { unit_amount: 4900 } }],
    });
    expect(form.get("mode")).toBe("payment");
    expect(form.get("line_items[0][quantity]")).toBe("2");
    expect(form.get("line_items[0][price_data][unit_amount]")).toBe("4900");
  });
});

describe("verifyWebhook", () => {
  const secret = "whsec_test";
  const body = JSON.stringify({ id: "evt_1", type: "checkout.session.completed", data: { object: {} } });
  const now = 1_700_000_000;
  const sign = (t: number, payload = body) =>
    createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");

  it("accepts a valid signature", () => {
    const event = verifyWebhook(body, `t=${now},v1=${sign(now)}`, secret, now);
    expect(event.id).toBe("evt_1");
  });

  it("rejects a tampered body", () => {
    expect(() =>
      verifyWebhook(body.replace("evt_1", "evt_2"), `t=${now},v1=${sign(now)}`, secret, now),
    ).toThrow(/mismatch/);
  });

  it("rejects a stale timestamp", () => {
    const old = now - 3600;
    expect(() => verifyWebhook(body, `t=${old},v1=${sign(old)}`, secret, now)).toThrow(/tolerance/);
  });

  it("rejects a missing header", () => {
    expect(() => verifyWebhook(body, undefined, secret, now)).toThrow(/Missing/);
  });
});

describe("extractCustomer", () => {
  it("reads shipping from collected_information (new API versions)", () => {
    const res = extractCustomer({
      payment_status: "paid",
      customer_details: { email: "a@b.fr", name: "Camille", phone: "+33600000000" },
      collected_information: {
        shipping_details: {
          name: "Camille R.",
          address: { line1: "1 rue X", postal_code: "75001", city: "Paris", country: "FR" },
        },
      },
    });
    expect(res.paid).toBe(true);
    expect(res.email).toBe("a@b.fr");
    expect(res.shippingAddress?.city).toBe("Paris");
    expect(res.shippingAddress?.name).toBe("Camille R.");
  });

  it("treats an unpaid session as not paid", () => {
    expect(extractCustomer({ payment_status: "unpaid" }).paid).toBe(false);
  });
});
