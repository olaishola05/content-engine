import { describe, it, expect, vi } from 'vitest';
import { extractPdfText } from '../extractors/pdf';
import { extractDocxText } from '../extractors/docx';
import { extractMarkdownText } from '../extractors/markdown';

// Mock pdf-parse
vi.mock('pdf-parse', () => {
  return {
    default: vi.fn().mockResolvedValue({ text: 'Extracted PDF text' }),
  };
});

// Mock mammoth
vi.mock('mammoth', () => {
  return {
    default: {
      extractRawText: vi.fn().mockResolvedValue({ value: 'Extracted DOCX text' }),
    }
  };
});

describe('Document Extractors', () => {
  describe('extractPdfText', () => {
    it('extracts text from a PDF buffer', async () => {
      const buffer = Buffer.from('dummy pdf');
      const text = await extractPdfText(buffer);
      expect(text).toBe('Extracted PDF text');
    });
  });

  describe('extractDocxText', () => {
    it('extracts text from a DOCX buffer', async () => {
      const buffer = Buffer.from('dummy docx');
      const text = await extractDocxText(buffer);
      expect(text).toBe('Extracted DOCX text');
    });
  });

  describe('extractMarkdownText', () => {
    it('extracts text from a Markdown buffer', async () => {
      const buffer = Buffer.from('# Heading\nMarkdown text');
      const text = await extractMarkdownText(buffer);
      expect(text).toBe('# Heading\nMarkdown text');
    });
  });
});
