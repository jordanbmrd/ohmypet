import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import type { JobRecord, JobStatus } from "../types/job.js";

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.JOBS_TABLE!;
const TTL_DAYS = 7;

export async function putJob(job: JobRecord): Promise<void> {
  await doc.send(new PutCommand({ TableName: TABLE, Item: job }));
}

export async function getJob(jobId: string): Promise<JobRecord | null> {
  const res = await doc.send(
    new GetCommand({ TableName: TABLE, Key: { jobId } }),
  );
  return (res.Item as JobRecord | undefined) ?? null;
}

export async function updateJobStatus(
  jobId: string,
  status: JobStatus,
  fields: Partial<Pick<JobRecord, "resultImageKey" | "resultURL" | "error">> = {},
): Promise<void> {
  const sets: string[] = ["#s = :s", "updatedAt = :u"];
  const names: Record<string, string> = { "#s": "status" };
  const values: Record<string, unknown> = {
    ":s": status,
    ":u": new Date().toISOString(),
  };

  // Alias every field name via ExpressionAttributeNames — some (e.g. "error")
  // are DynamoDB reserved keywords and fail if used bare in the expression.
  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined) continue;
    sets.push(`#${k} = :${k}`);
    names[`#${k}`] = k;
    values[`:${k}`] = v;
  }

  await doc.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { jobId },
      UpdateExpression: `SET ${sets.join(", ")}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    }),
  );
}

export function newTtl(): number {
  return Math.floor(Date.now() / 1000) + TTL_DAYS * 24 * 60 * 60;
}
