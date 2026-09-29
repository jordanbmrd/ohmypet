import type { ProductId } from "../lib/catalog.js";

export type OrderStatus = "pending_payment" | "paid" | "expired";

export interface OrderItem {
  jobId: string;
  theme: string;
  productId: ProductId;
  productName: string;
  description: string;
  options: Record<string, string>;
  unitPriceCents: number;
  quantity: number;
  /** S3 key of the generated portrait to print — outlives the job row's TTL. */
  imageKey: string;
}

export interface ShippingAddress {
  name?: string;
  line1?: string;
  line2?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  phone?: string;
}

export interface OrderRecord {
  orderId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  currency: "eur";
  stripeSessionId?: string;
  email?: string;
  shippingAddress?: ShippingAddress;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
}
