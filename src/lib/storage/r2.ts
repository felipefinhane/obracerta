import { S3Client } from "@aws-sdk/client-s3";

/**
 * Client S3-compatível pro Cloudflare R2 (ADR 0003). Usado só no server
 * (Route Handlers) — nunca importar isso de um Client Component.
 */
export function createR2Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

export const R2_BUCKET = process.env.R2_BUCKET_NAME!;
