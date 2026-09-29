import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { ok, fail } from "../../lib/http.js";
import { NotFoundError, ValidationError } from "../../lib/errors.js";
import type { OrderResponse } from "../../types/api.js";
import { getOrder } from "../../services/orderService.js";
import { presignedGetUrl } from "../../services/s3Service.js";

/**
 * GET /orders/{orderId}
 * Order summary for the confirmation page. The id is an unguessable UUID only
 * known to the buyer; the full postal address is deliberately not returned.
 */
export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  try {
    const orderId = event.pathParameters?.orderId;
    if (!orderId) {
      throw new ValidationError("Missing orderId");
    }

    const order = await getOrder(orderId);
    if (!order) {
      throw new NotFoundError(`Order ${orderId} not found`);
    }

    const body: OrderResponse = {
      orderId: order.orderId,
      status: order.status,
      items: await Promise.all(
        order.items.map(async (i) => ({
          productName: i.productName,
          description: i.description,
          theme: i.theme,
          quantity: i.quantity,
          unitPriceCents: i.unitPriceCents,
          imageURL: await presignedGetUrl(i.imageKey),
        })),
      ),
      subtotalCents: order.subtotalCents,
      shippingCents: order.shippingCents,
      totalCents: order.totalCents,
      email: order.email,
      shippingName: order.shippingAddress?.name,
      shippingCity: order.shippingAddress?.city,
      createdAt: order.createdAt,
      paidAt: order.paidAt,
    };
    return ok(body);
  } catch (err) {
    return fail(err);
  }
};
