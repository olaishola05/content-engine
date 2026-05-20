import mammoth from 'mammoth';

/**
 * Extracts raw text from a DOCX buffer.
 */
export async function extractDocxText(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}
