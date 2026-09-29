import { randomUUID } from "node:crypto";
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { ok, fail, parseJsonBody } from "../../lib/http.js";
import { ValidationError } from "../../lib/errors.js";
import { decodeAndValidateImage } from "../../lib/imageProcessor.js";
import { isTheme } from "../../lib/promptBuilder.js";
import { GenerateRequestSchema, type GenerateResponse } from "../../types/api.js";
import type { JobRecord } from "../../types/job.js";
import { putJob, newTtl } from "../../services/dynamoService.js";
import { invokeWorker } from "../../services/lambdaService.js";
import { uploadImage, keys } from "../../services/s3Service.js";

/**
 * POST /generate
 * Asynchronous: decode + validate the image, persist the job as "processing",
 * store the input in S3, then fire the worker Lambda and return immediately.
 * OpenAI gpt-image-1 takes 30-90s — too long for the API Gateway 30s timeout —
 * so the actual generation runs in the worker and the app polls GET /status.
 */
export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  try {
    const json = parseJsonBody(event);

    const parsed = GenerateRequestSchema.safeParse(json);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues[0]?.message ?? "Invalid request");
    }
    const { imageBase64, theme, petSpecies } = parsed.data;

    if (!isTheme(theme)) {
      throw new ValidationError(`Unknown theme: ${theme}`);
    }

    const { buffer, format } = decodeAndValidateImage(imageBase64);

    const jobId = randomUUID();
    const now = new Date().toISOString();
    const inputKey = keys.input(jobId, format === "jpeg" ? "jpg" : "png");

    const job: JobRecord = {
      jobId,
      status: "processing",
      theme,
      petSpecies,
      inputImageKey: inputKey,
      createdAt: now,
      updatedAt: now,
      ttl: newTtl(),
    };
    await putJob(job);
    await uploadImage(inputKey, buffer, `image/${format}`);
    await invokeWorker(jobId);

    const body: GenerateResponse = {
      jobId,
      status: "processing",
      estimatedSeconds: 60,
    };
    return ok(body, 202);
  } catch (err) {
    return fail(err);
  }
};
