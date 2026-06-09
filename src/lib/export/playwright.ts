import { chromium, Browser, Page } from 'playwright';

/**
 * Takes a screenshot of the given HTML content or URL at the specified dimensions.
 * Uses Playwright headless browser. Intended for server-side rendering of
 * visual export templates (React Server Components rendered to HTML string or local preview URL).
 *
 * @param htmlOrUrl HTML string content or http(s) URL to screenshot
 * @param options Target viewport dimensions (e.g. { width: 1080, height: 1350 } for Instagram)
 * @returns PNG buffer of the screenshot at exact requested size
 */
export async function takeScreenshot(
  htmlOrUrl: string,
  options: { width: number; height: number }
): Promise<Buffer> {
  const { width, height } = options;

  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // helpful for containers/CI
    });

    page = await browser.newPage();
    await page.setViewportSize({ width, height });

    if (htmlOrUrl.startsWith('http')) {
      // URL mode (e.g. local preview server or hosted)
      await page.goto(htmlOrUrl, { waitUntil: 'networkidle', timeout: 30000 });
    } else {
      // HTML string mode (preferred for RSC rendered templates)
      await page.setContent(htmlOrUrl, { waitUntil: 'networkidle', timeout: 30000 });
    }

    // Full page screenshot at exact viewport size (no extra scroll)
    const buffer = await page.screenshot({
      type: 'png',
      fullPage: false, // respect exact viewport
    });

    return buffer;
  } finally {
    if (page) await page.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
  }
}
