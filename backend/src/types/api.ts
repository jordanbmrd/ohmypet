import { z } from "zod";

export const PetSpeciesSchema = z.enum(["dog", "cat"]);

export const GenerateRequestSchema = z.object({
  imageBase64: z.string().min(100, "imageBase64 is required"),
  theme: z.string().min(1),
  petSpecies: PetSpeciesSchema,
});

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;

export interface GenerateResponse {
  jobId: string;
  status: "completed" | "processing" | "failed";
  resultURL?: string;
  estimatedSeconds?: number;
  error?: string;
}

export interface StatusResponse {
  jobId: string;
  status: "pending" | "processing" | "completed" | "failed";
  resultURL?: string;
  error?: string;
}

export const CheckoutItemSchema = z.object({
  jobId: z.string().uuid("Invalid jobId"),
  productId: z.string().min(1),
  options: z.record(z.string()),
  quantity: z.number().int().min(1),
});

export const CheckoutRequestSchema = z.object({
  items: z.array(CheckoutItemSchema).min(1, "Cart is empty").max(20, "Too many items"),
});

export type CheckoutRequest = z.infer<typeof CheckoutRequestSchema>;

export interface CheckoutResponse {
  orderId: string;
  checkoutUrl: string;
}

export interface OrderResponse {
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
}
