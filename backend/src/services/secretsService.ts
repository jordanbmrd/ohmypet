import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { GenerationError } from "../lib/errors.js";

const client = new SecretsManagerClient({});

/**
 * Resolved once per warm container — Secrets Manager lookups are slow (~100ms)
 * and the OpenAI key never changes within a container's lifetime.
 */
let cachedKey: string | undefined;

/**
 * Reads the OpenAI API key from Secrets Manager (ARN in OPENAI_SECRET_ARN).
 * The secret stores the raw key string as its SecretString.
 */
export async function getOpenAIApiKey(): Promise<string> {
  if (cachedKey) return cachedKey;

  const secretId = process.env.OPENAI_SECRET_ARN;
  if (!secretId) {
    throw new GenerationError("OPENAI_SECRET_ARN is not configured");
  }

  let value: string | undefined;
  try {
    const res = await client.send(
      new GetSecretValueCommand({ SecretId: secretId }),
    );
    value = res.SecretString;
  } catch (err) {
    throw new GenerationError(
      `Failed to read OpenAI secret: ${(err as Error).message}`,
    );
  }

  if (!value) {
    throw new GenerationError("OpenAI secret is empty");
  }
  cachedKey = value.trim();
  return cachedKey;
}
