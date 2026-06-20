import type { Handler } from "aws-lambda";
import { detectImageFormat } from "../../lib/imageProcessor.js";
import { isTheme } from "../../lib/promptBuilder.js";
import { getJob, updateJobStatus } from "../../services/dynamoService.js";
import { generatePoster } from "../../services/openaiService.js";
import {
  downloadImage,
  uploadImage,
  presignedGetUrl,
  keys,
} from "../../services/s3Service.js";

interface WorkerEvent {
  jobId: string;
}

/**
 * Async worker invoked by /generate. Runs the slow OpenAI generation off the
 * request path: reads the input image from S3, generates the poster, stores it,
 * and flips the job to completed/failed. The iOS app polls GET /status meanwhile.
 */
export const handler: Handler<WorkerEvent> = async (event) => {
  const { jobId } = event;
  if (!jobId) {
    console.error("Worker invoked without jobId");
    return;
  }

  const job = await getJob(jobId);
  if (!job) {
    console.error(`Worker: job ${jobId} not found`);
    return;
  }

  try {
    if (!isTheme(job.theme)) {
      throw new Error(`Unknown theme: ${job.theme}`);
    }
    if (!job.inputImageKey) {
      throw new Error("Job has no input image");
    }

    const input = await downloadImage(job.inputImageKey);
    const format = detectImageFormat(input);
    if (!format) {
      throw new Error("Stored input is not a valid JPEG/PNG");
    }

    const posterBytes = await generatePoster({
      inputImage: input,
      inputFormat: format,
      theme: job.theme,
      petSpecies: job.petSpecies,
    });

    const resultKey = keys.result(jobId);
    await uploadImage(resultKey, posterBytes, "image/png");
    const resultURL = await presignedGetUrl(resultKey);

    await updateJobStatus(jobId, "completed", {
      resultImageKey: resultKey,
      resultURL,
    });
  } catch (err) {
    const message = (err as Error).message;
    console.error(`Worker: generation failed for ${jobId}: ${message}`);
    await updateJobStatus(jobId, "failed", { error: message });
  }
};
