/**
 * Client for the OhMyPet backend (backend/template.yaml). Set VITE_API_BASE_URL
 * at build time; without it the site runs in demo mode: generation returns the
 * theme's example artwork and checkout is disabled.
 */

import { themes } from "./content";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "");

export const isDemoMode = !BASE_URL;

export class ApiError extends Error {}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: init?.body ? { "content-type": "application/json" } : undefined,
    });
  } catch {
    throw new ApiError("Connexion impossible. Vérifiez votre réseau et réessayez.");
  }
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    throw new ApiError(
      typeof json.message === "string" ? json.message : "Une erreur est survenue. Réessayez.",
    );
  }
  return json as T;
}

export type Species = "dog" | "cat";

type JobResponse = {
  jobId: string;
  status: "pending" | "processing" | "completed" | "failed";
  resultURL?: string;
  error?: string;
};

export type GeneratedPortrait = { jobId: string; imageURL: string };

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });

/** POST /generate then poll GET /status until the portrait is ready. */
export async function generatePortrait(
  params: { imageBase64: string; theme: string; petSpecies: Species },
  signal?: AbortSignal,
): Promise<GeneratedPortrait> {
  if (isDemoMode) {
    await sleep(6000, signal);
    const theme = themes.find((t) => t.key === params.theme) ?? themes[0];
    return { jobId: `demo-${crypto.randomUUID()}`, imageURL: theme.image };
  }

  let job = await request<JobResponse>("/generate", {
    method: "POST",
    body: JSON.stringify(params),
    signal,
  });

  const deadline = Date.now() + 180_000;
  while (job.status !== "completed" || !job.resultURL) {
    if (job.status === "failed") {
      throw new ApiError("La création a échoué. Essayez une autre photo ou relancez.");
    }
    if (Date.now() > deadline) {
      throw new ApiError("La création prend plus de temps que prévu. Réessayez.");
    }
    await sleep(3000, signal);
    job = await request<JobResponse>(`/status/${job.jobId}`, { signal });
  }
  return { jobId: job.jobId, imageURL: job.resultURL };
}

export type CheckoutLine = {
  jobId: string;
  productId: string;
  options: Record<string, string>;
  quantity: number;
};

/** POST /checkout — returns the Stripe Checkout URL to redirect to. */
export async function startCheckout(items: CheckoutLine[]): Promise<string> {
  if (isDemoMode) {
    throw new ApiError(
      "Le paiement n'est pas activé sur cette version de démonstration du site.",
    );
  }
  const res = await request<{ orderId: string; checkoutUrl: string }>("/checkout", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
  return res.checkoutUrl;
}

export type Order = {
  orderId: string;
  status: "pending_payment" | "paid" | "expired";
  items: {
    productName: string;
    description: string;
    theme: string;
    quantity: number;
    unitPriceCents: number;
    imageURL?: string;
  }[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  email?: string;
  shippingName?: string;
  shippingCity?: string;
  createdAt: string;
  paidAt?: string;
};

export function getOrder(orderId: string): Promise<Order> {
  return request<Order>(`/orders/${encodeURIComponent(orderId)}`);
}
