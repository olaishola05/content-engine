import { uploadFileToR2 } from '../r2';

/**
 * Uploads a visual export buffer (PNG, PDF, etc.) to Cloudflare R2 under the
 * 'visual-exports/' prefix. This generalizes/wraps the core uploadFileToR2
 * for Phase 5 assets (distinct from brand-documents/).
 *
 * @param buffer The file content buffer (screenshot or compiled PDF)
 * @param fileName Suggested filename (e.g. 'instagram-abc123.png')
 * @param mimeType e.g. 'image/png' or 'application/pdf'
 * @param userId Owner for path segmentation and rate limiting
 * @returns Public URL to the uploaded asset
 */
export async function uploadVisualToR2(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  userId: string
): Promise<string> {
  // Delegate to the generalized core function with visual-exports base path.
  // The core function now accepts an optional basePath (defaults to brand-documents for compat).
  return uploadFileToR2(buffer, fileName, mimeType, userId, 'visual-exports');
}
