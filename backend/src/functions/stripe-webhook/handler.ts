import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { ok, fail, rawBody } from "../../lib/http.js";
import { getStripeSecrets } from "../../services/secretsService.js";
import { extractCustomer, verifyWebhook } from "../../services/stripeService.js";
import { markOrderExpired, markOrderPaid } from "../../services/orderService.js";

/**
 * POST /stripe/webhook
 * Called by Stripe (never by the browser). Verifies the signature, then moves
 * the order to "paid" (with the buyer's email + shipping address) or "expired".
 * Any non-2xx makes Stripe retry, so only signature errors return 4xx.
 */
export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  try {
    const { webhookSecret } = await getStripeSecrets();
    const stripeEvent = verifyWebhook(
      rawBody(event),
      event.headers["stripe-signature"],
      webhookSecret,
    );

    const session = stripeEvent.data.object;
    const metadata = session.metadata as Record<string, string> | undefined;
    const orderId = metadata?.orderId ?? (session.client_reference_id as string | undefined);
    if (!orderId) {
      console.warn(`Stripe event ${stripeEvent.id} (${stripeEvent.type}) has no orderId`);
      return ok({ received: true });
    }

    switch (stripeEvent.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const { paid, email, shippingAddress } = extractCustomer(session);
        // Delayed methods (e.g. SEPA) complete the session before funds clear;
        // async_payment_succeeded follows once they do.
        if (paid) {
          await markOrderPaid(orderId, { email, shippingAddress });
          console.log(`Order ${orderId} paid`);
        }
        break;
      }
      case "checkout.session.expired":
        await markOrderExpired(orderId);
        break;
      default:
        break;
    }

    return ok({ received: true });
  } catch (err) {
    return fail(err);
  }
};
