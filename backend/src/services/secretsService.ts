import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { AppError, GenerationError } from "../lib/errors.js";

const client = new SecretsManagerClient({});

/**
 * Resolved once per warm container — Secrets Manager lookups are slow (~100ms)
 * and secrets never change within a container's lifetime.
 */
const cache = new Map<string, string>();

async function readSecret(
  envVar: string,
  label: string,
  toError: (message: string) => AppError,
): Promise<string> {
  const secretId = process.env[envVar];
  if (!secretId) {
    throw toError(`${envVar} is not configured`);
  }
  const cached = cache.get(secretId);
  if (cached) return cached;

  let value: string | undefined;
  try {
    const res = await client.send(
      new GetSecretValueCommand({ SecretId: secretId }),
    );
    value = res.SecretString;
  } catch (err) {
    throw toError(`Failed to read ${label} secret: ${(err as Error).message}`);
  }

  if (!value?.trim()) {
    throw toError(`${label} secret is empty`);
  }
  cache.set(secretId, value.trim());
  return value.trim();
}

/**
 * Reads the OpenAI API key from Secrets Manager (ARN in OPENAI_SECRET_ARN).
 * The secret stores the raw key string as its SecretString.
 */
export function getOpenAIApiKey(): Promise<string> {
  return readSecret("OPENAI_SECRET_ARN", "OpenAI", (m) => new GenerationError(m));
}

export interface StripeSecrets {
  secretKey: string;
  webhookSecret: string;
}

/**
 * Reads the Stripe keys from Secrets Manager (ARN in STRIPE_SECRET_ARN).
 * The secret stores JSON: {"secretKey":"sk_...","webhookSecret":"whsec_..."}.
 */
export async function getStripeSecrets(): Promise<StripeSecrets> {
  const toError = (m: string) => new AppError(503, "PAYMENTS_UNAVAILABLE", m);
  const raw = await readSecret("STRIPE_SECRET_ARN", "Stripe", toError);

  let parsed: Partial<StripeSecrets>;
  try {
    parsed = JSON.parse(raw) as Partial<StripeSecrets>;
  } catch {
    throw toError("Stripe secret is not valid JSON");
  }
  if (!parsed.secretKey || !parsed.webhookSecret) {
    throw toError("Stripe secret must contain secretKey and webhookSecret");
  }
  return { secretKey: parsed.secretKey, webhookSecret: parsed.webhookSecret };
}
