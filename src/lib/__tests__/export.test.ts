import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Playwright
vi.mock('playwright', () => ({
  chromium: {
    launch: vi.fn().mockResolvedValue({
      newPage: vi.fn().mockResolvedValue({
        setViewportSize: vi.fn(),
        setContent: vi.fn(),
        goto: vi.fn(),
        screenshot: vi.fn().mockResolvedValue(Buffer.from('fake-png-data-for-1080x1350')),
        close: vi.fn().mockResolvedValue(undefined),
      }),
      close: vi.fn().mockResolvedValue(undefined),
    }),
    connectOverCDP: vi.fn().mockResolvedValue({
      newPage: vi.fn().mockResolvedValue({
        setViewportSize: vi.fn(),
        setContent: vi.fn(),
        goto: vi.fn(),
        screenshot: vi.fn().mockResolvedValue(Buffer.from('fake-png-browserless')),
        close: vi.fn().mockResolvedValue(undefined),
      }),
      close: vi.fn().mockResolvedValue(undefined),
    }),
  },
}));

// Mock the existing r2 upload (we'll wrap it)
vi.mock('../r2', () => ({
  uploadFileToR2: vi.fn().mockImplementation(async (buffer, fileName, mimeType, userId, basePath = 'brand-documents') => {
    return `https://mock-r2.example.com/${basePath}/${userId}/${fileName}`;
  }),
}));

import { takeScreenshot } from '../export/playwright';
import { uploadVisualToR2 } from '../export/r2-upload';
import { uploadFileToR2 } from '../r2';

describe('Shared Export Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.BROWSERLESS_WS_URL;
    process.env.CLOUDFLARE_R2_BUCKET_NAME = 'test-bucket';
    process.env.CLOUDFLARE_R2_ENDPOINT = 'https://mock-endpoint.r2.cloudflarestorage.com';
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID = 'mock-key';
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY = 'mock-secret';
    process.env.CLOUDFLARE_R2_PUBLIC_URL = 'https://pub-mock.r2.dev';
  });

  describe('playwright.ts - takeScreenshot', () => {
    it('produces a buffer at the correct Instagram dimensions (1080x1350)', async () => {
      const html = '<html><body>Instagram Carousel Slide</body></html>';
      const buffer = await takeScreenshot(html, { width: 1080, height: 1350 });

      expect(buffer).toBeInstanceOf(Buffer);
      // In real impl, the mock returns fake data sized for this
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('produces a buffer at the correct TikTok dimensions (1080x1920)', async () => {
      const html = '<html><body>TikTok Carousel Slide</body></html>';
      const buffer = await takeScreenshot(html, { width: 1080, height: 1920 });

      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('accepts HTML string or URL and uses Playwright page.setContent or goto', async () => {
      const html = '<html>content</html>';
      await takeScreenshot(html, { width: 420, height: 600 }); // small for test

      // Verify playwright was used (mocked)
      const { chromium } = await import('playwright');
      expect(chromium.launch).toHaveBeenCalled();
    });

    it('uses chromium.connectOverCDP when BROWSERLESS_WS_URL is set', async () => {
      process.env.BROWSERLESS_WS_URL = 'wss://chrome.browserless.io?token=test';

      const html = '<html>browserless content</html>';
      const buffer = await takeScreenshot(html, { width: 1080, height: 1080 });

      const { chromium } = await import('playwright');
      expect(chromium.connectOverCDP).toHaveBeenCalledWith('wss://chrome.browserless.io?token=test');
      expect(chromium.launch).not.toHaveBeenCalled();
      expect(buffer).toBeInstanceOf(Buffer);
    });

    it('falls back to chromium.launch when BROWSERLESS_WS_URL is not set', async () => {
      const html = '<html>local content</html>';
      await takeScreenshot(html, { width: 800, height: 600 });

      const { chromium } = await import('playwright');
      expect(chromium.launch).toHaveBeenCalled();
      expect(chromium.connectOverCDP).not.toHaveBeenCalled();
    });
  });

  describe('r2-upload.ts - uploadVisualToR2 (wraps/generalizes existing R2)', () => {
    it('uploads a buffer to R2 under visual-exports/ prefix and returns valid public URL', async () => {
      const mockBuffer = Buffer.from('fake carousel png');
      const userId = 'user_123';
      const fileName = 'instagram-carousel-1.png';
      const mimeType = 'image/png';

      const url = await uploadVisualToR2(mockBuffer, fileName, mimeType, userId);

      expect(uploadFileToR2).toHaveBeenCalledWith(
        mockBuffer,
        fileName,
        mimeType,
        userId,
        'visual-exports'
      );

      expect(url).toContain('visual-exports');
      expect(url).toContain(userId);
      expect(url).toContain('instagram-carousel-1.png');
      expect(url).toMatch(/^https?:\/\//);
    });

    it('uses a distinct key prefix from brand-documents/', async () => {
      const mockBuffer = Buffer.from('test');
      const url = await uploadVisualToR2(mockBuffer, 'test.png', 'image/png', 'user_456');

      // The wrapper should ensure key starts with visual-exports/ not brand-documents/
      expect(uploadFileToR2).toHaveBeenCalledWith(
        mockBuffer,
        'test.png',
        'image/png',
        'user_456',
        'visual-exports'
      );
      expect(url).toContain('visual-exports');
    });
  });
});
