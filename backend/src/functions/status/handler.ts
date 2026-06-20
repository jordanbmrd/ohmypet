import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { ok, fail } from "../../lib/http.js";
import { NotFoundError, ValidationError } from "../../lib/errors.js";
import type { StatusResponse } from "../../types/api.js";
import { getJob } from "../../services/dynamoService.js";

/**
 * GET /status/{jobId}
 * The iOS app polls this after /generate returns "processing" until the worker
 * flips the job to "completed" (with resultURL) or "failed".
 */
export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  try {
    const jobId = event.pathParameters?.jobId;
    if (!jobId) {
      throw new ValidationError("Missing jobId");
    }

    const job = await getJob(jobId);
    if (!job) {
      throw new NotFoundError(`Job ${jobId} not found`);
    }

    const body: StatusResponse = {
      jobId: job.jobId,
      status: job.status,
      resultURL: job.resultURL,
      error: job.error,
    };
    return ok(body);
  } catch (err) {
    return fail(err);
  }
};
