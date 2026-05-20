import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

/**
 * Uploads a file buffer to Cloudflare R2 and returns its public URL.
 * 
 * @param buffer The file content buffer
 * @param fileName The original file name
 * @param mimeType The file's MIME type
 * @param userId The user uploading the file
 * @returns The public URL to the uploaded file
 */
export async function uploadFileToR2(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  userId: string
): Promise<string> {
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

  if (!bucketName || !endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error('Cloudflare R2 environment variables are missing');
  }

  const s3 = new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  // Construct a safe, structured path
  const uniquePrefix = Date.now().toString();
  const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `brand-documents/${userId}/${uniquePrefix}-${safeFileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  });

  await s3.send(command);

  // Return the public URL
  // If CLOUDFLARE_R2_PUBLIC_URL is set, use it (e.g. https://pub-xxxx.r2.dev)
  // Otherwise, fallback to the raw bucket URL format.
  const publicUrlBase = process.env.CLOUDFLARE_R2_PUBLIC_URL || `${endpoint}/${bucketName}`;
  return `${publicUrlBase}/${key}`;
}
