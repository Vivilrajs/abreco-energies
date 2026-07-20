import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const REGION = process.env.AWS_REGION;
const BUCKET = process.env.AWS_S3_BUCKET;
const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const PUBLIC_BASE_URL = process.env.AWS_S3_PUBLIC_BASE_URL;

export function isS3Configured(): boolean {
  return Boolean(REGION && BUCKET && ACCESS_KEY_ID && SECRET_ACCESS_KEY);
}

let cached: S3Client | null = null;
function client(): S3Client {
  if (!cached) {
    cached = new S3Client({
      region: REGION,
      credentials: {
        accessKeyId: ACCESS_KEY_ID as string,
        secretAccessKey: SECRET_ACCESS_KEY as string,
      },
    });
  }
  return cached;
}

/**
 * Uploads a buffer to S3 and returns its public URL.
 * `key` is the object key, e.g. "media/uploads/hero-123.mp4".
 */
export async function uploadToS3(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  await client().send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  const base =
    PUBLIC_BASE_URL?.replace(/\/+$/, "") ||
    `https://${BUCKET}.s3.${REGION}.amazonaws.com`;
  return `${base}/${key}`;
}
