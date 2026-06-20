import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

const client = new LambdaClient({});
const WORKER = process.env.WORKER_FUNCTION_NAME!;

/**
 * Fire-and-forget async invoke ("Event") of the worker that runs the slow
 * OpenAI generation. Returns as soon as Lambda accepts the request (~tens of
 * ms), so /generate stays well under the API Gateway 30s timeout.
 */
export async function invokeWorker(jobId: string): Promise<void> {
  await client.send(
    new InvokeCommand({
      FunctionName: WORKER,
      InvocationType: "Event",
      Payload: Buffer.from(JSON.stringify({ jobId })),
    }),
  );
}
