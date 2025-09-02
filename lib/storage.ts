import { put, getSignedUrl as getBlobUrl } from '@vercel/blob';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl as getS3Url } from '@aws-sdk/s3-request-presigner';

/**
 * Uploads a PDF file to the configured storage backend and returns a key that
 * can later be used to generate a signed download URL.
 */
export async function uploadPdf(buffer: Buffer, filename: string): Promise<string> {
  const backend = process.env.STORAGE_BACKEND ?? 'vercel-blob';

  if (backend === 's3') {
    const client = new S3Client({});
    const Key = `receipts/${Date.now()}-${filename}`;
    await client.send(new PutObjectCommand({ Bucket: process.env.S3_BUCKET!, Key, Body: buffer, ContentType: 'application/pdf' }));
    return Key;
  }

  // default to Vercel Blob
  const blob = await put(`receipts/${Date.now()}-${filename}`, buffer, { contentType: 'application/pdf' });
  return blob.pathname;
}

/**
 * Generates a time limited URL for a previously uploaded receipt.
 */
export async function getDownloadUrl(key: string, expiresIn = 60): Promise<string> {
  const backend = process.env.STORAGE_BACKEND ?? 'vercel-blob';

  if (backend === 's3') {
    const client = new S3Client({});
    return await getS3Url(client, new PutObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: key }), { expiresIn });
  }

  return await getBlobUrl({ path: key, expiresIn: `${expiresIn}s` });
}
