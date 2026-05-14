/**
 * Extracts raw text from a Markdown buffer.
 */
export async function extractMarkdownText(buffer: Buffer): Promise<string> {
  return buffer.toString('utf-8');
}
