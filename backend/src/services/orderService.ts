import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import type { OrderRecord } from "../types/order.js";

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});
const TABLE = process.env.ORDERS_TABLE!;

export async function putOrder(order: OrderRecord): Promise<void> {
  await doc.send(new PutCommand({ TableName: TABLE, Item: order }));
}

export async function getOrder(orderId: string): Promise<OrderRecord | null> {
  const res = await doc.send(
    new GetCommand({ TableName: TABLE, Key: { orderId } }),
  );
  return (res.Item as OrderRecord | undefined) ?? null;
}

/** Links the Stripe Checkout Session to a freshly created order. */
export async function setStripeSession(orderId: string, sessionId: string): Promise<void> {
  await doc.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { orderId },
      UpdateExpression: "SET stripeSessionId = :sid, updatedAt = :u",
      ExpressionAttributeValues: { ":sid": sessionId, ":u": new Date().toISOString() },
    }),
  );
}

/**
 * Marks an order paid. Idempotent — Stripe may deliver the same event more
 * than once, and a paid order must never be flipped back.
 */
export async function markOrderPaid(
  orderId: string,
  fields: Pick<OrderRecord, "email" | "shippingAddress">,
): Promise<void> {
  const now = new Date().toISOString();
  try {
    await doc.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { orderId },
        UpdateExpression:
          "SET #s = :paid, paidAt = if_not_exists(paidAt, :now), updatedAt = :now, email = :email, shippingAddress = :addr",
        ExpressionAttributeNames: { "#s": "status" },
        ExpressionAttributeValues: {
          ":paid": "paid",
          ":now": now,
          ":email": fields.email ?? null,
          ":addr": fields.shippingAddress ?? null,
        },
        ConditionExpression: "attribute_exists(orderId)",
      }),
    );
  } catch (err) {
    // Unknown order (e.g. a session created from another stage): log it but
    // let the webhook acknowledge, otherwise Stripe retries for days.
    if ((err as Error).name !== "ConditionalCheckFailedException") throw err;
    console.warn(`markOrderPaid: order ${orderId} not found`);
  }
}

/** Marks an abandoned order expired, unless it was paid in the meantime. */
export async function markOrderExpired(orderId: string): Promise<void> {
  try {
    await doc.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { orderId },
        UpdateExpression: "SET #s = :expired, updatedAt = :u",
        ConditionExpression: "#s = :pending",
        ExpressionAttributeNames: { "#s": "status" },
        ExpressionAttributeValues: {
          ":expired": "expired",
          ":pending": "pending_payment",
          ":u": new Date().toISOString(),
        },
      }),
    );
  } catch (err) {
    if ((err as Error).name !== "ConditionalCheckFailedException") throw err;
  }
}
