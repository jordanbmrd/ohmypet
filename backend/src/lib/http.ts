import type { APIGatewayProxyResultV2 } from "aws-lambda";
import { AppError } from "./errors.js";

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
