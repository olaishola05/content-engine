import * as pdfParseModule from 'pdf-parse';

/**
 * Extracts raw text from a PDF buffer.
 */
export async function extractPdfText(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parse = (pdfParseModule as any).default || pdfParseModule;
  const data = await parse(buffer);
  return data.text;
}
