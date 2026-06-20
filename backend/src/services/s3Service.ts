import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({});
const BUCKET = process.env.IMAGES_BUCKET!;
const PRESIGN_EXPIRY = Number(process.env.PRESIGN_EXPIRY_SECONDS ?? 2592000);

export async function uploadImage(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<void> {
  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
}

export async function downloadImage(key: string): Promise<Buffer> {
  const res = await client.send(
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
  );
  const bytes = await res.Body!.transformToByteArray();
  return Buffer.from(bytes);
}

export async function presignedGetUrl(key: string): Promise<string> {
  return getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
    { expiresIn: PRESIGN_EXPIRY },
  );
}

export const keys = {
  input: (jobId: string, ext: string) => `input/${jobId}/source.${ext}`,
  result: (jobId: string) => `generated/${jobId}/poster.png`,
};
