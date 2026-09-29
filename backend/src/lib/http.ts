import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { AppError, ValidationError } from "./errors.js";

const baseHeaders = {
  "content-type": "application/json",
};

export function ok(body: unknown, statusCode = 200): APIGatewayProxyResultV2 {
  return { statusCode, headers: baseHeaders, body: JSON.stringify(body) };
}

export function fail(error: unknown): APIGatewayProxyResultV2 {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      headers: baseHeaders,
      body: JSON.stringify({ error: error.code, message: error.message }),
    };
  }
  console.error("Unhandled error", error);
  // Surface the real message outside prod so failures aren't opaque to debug.
  const detail =
    process.env.STAGE !== "prod" && error instanceof Error
      ? error.message
      : "Unexpected error";
  return {
    statusCode: 500,
    headers: baseHeaders,
    body: JSON.stringify({ error: "INTERNAL_ERROR", message: detail }),
  };
}

/**
 * Returns the request body as a string. API Gateway (HTTP API) may
 * base64-encode it; decoding first keeps JSON.parse and signature checks
 * working on the bytes the client actually sent.
 */
export function rawBody(event: APIGatewayProxyEventV2): string {
  return event.isBase64Encoded
    ? Buffer.from(event.body ?? "", "base64").toString("utf8")
    : event.body ?? "";
}

export function parseJsonBody(event: APIGatewayProxyEventV2): unknown {
  try {
    return JSON.parse(rawBody(event) || "{}");
  } catch {
    throw new ValidationError("Request body is not valid JSON");
  }
}
