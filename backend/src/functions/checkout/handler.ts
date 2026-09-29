import { randomUUID } from "node:crypto";
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { ok, fail, parseJsonBody } from "../../lib/http.js";
import { ValidationError } from "../../lib/errors.js";
import {
  isProductId,
  priceLine,
  shippingFor,
  MAX_QUANTITY_PER_LINE,
} from "../../lib/catalog.js";
import { CheckoutRequestSchema, type CheckoutResponse } from "../../types/api.js";
import type { OrderItem, OrderRecord } from "../../types/order.js";
import { getJob } from "../../services/dynamoService.js";
import { putOrder, setStripeSession } from "../../services/orderService.js";
import { createCheckoutSession } from "../../services/stripeService.js";

/**
 * POST /checkout
 * Prices the cart server-side from the catalogue (client prices are never
 * trusted), checks every portrait was really generated, stores a
 * "pending_payment" order and returns a Stripe Checkout URL to redirect to.
 * The order flips to "paid" when Stripe calls POST /stripe/webhook.
 */
export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  try {
    const parsed = CheckoutRequestSchema.safeParse(parseJsonBody(event));
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues[0]?.message ?? "Invalid request");
    }

    const jobIds = [...new Set(parsed.data.items.map((i) => i.jobId))];
    const jobs = new Map(
      await Promise.all(jobIds.map(async (id) => [id, await getJob(id)] as const)),
    );

    const items: OrderItem[] = parsed.data.items.map((line) => {
      if (!isProductId(line.productId)) {
        throw new ValidationError(`Unknown product: ${line.productId}`);
      }
      if (line.quantity > MAX_QUANTITY_PER_LINE) {
        throw new ValidationError(`Quantity is limited to ${MAX_QUANTITY_PER_LINE} per item`);
      }
      const job = jobs.get(line.jobId);
      if (!job || job.status !== "completed" || !job.resultImageKey) {
        throw new ValidationError(
          "Un portrait de votre panier n'est plus disponible. Veuillez le recréer.",
        );
      }

      let priced;
      try {
        priced = priceLine(line.productId, line.options);
      } catch (err) {
        throw new ValidationError((err as Error).message);
      }

      return {
        jobId: line.jobId,
        theme: job.theme,
        productId: priced.productId,
        productName: priced.productName,
        description: priced.description,
        options: priced.options,
        unitPriceCents: priced.unitPriceCents,
        quantity: line.quantity,
        imageKey: job.resultImageKey,
      };
    });

    const subtotal = items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);
    const shipping = shippingFor(subtotal);
    const now = new Date().toISOString();
    const order: OrderRecord = {
      orderId: randomUUID(),
      status: "pending_payment",
      items,
      subtotalCents: subtotal,
      shippingCents: shipping,
      totalCents: subtotal + shipping,
      currency: "eur",
      createdAt: now,
      updatedAt: now,
    };
    await putOrder(order);

    const session = await createCheckoutSession(order, process.env.SITE_URL!);
    await setStripeSession(order.orderId, session.id);

    const body: CheckoutResponse = { orderId: order.orderId, checkoutUrl: session.url };
    return ok(body, 201);
  } catch (err) {
    return fail(err);
  }
};
