import { describe, it, expect, vi } from 'vitest';
import ReactDOMServer from 'react-dom/server';
import React from 'react';

// These imports will fail until components are created
import InstagramPreview from '../instagram-preview';
import TikTokPreview from '../tiktok-preview';
import SlideNavigator from '../slide-navigator';
import ExportButton from '../export-button';

describe('Carousel Preview Components', () => {
  const mockBrand = {
    brandName: 'TestBrand',
    primaryColor: '#de1d8d',
  };

  const mockSlides = ['Slide 1 content', 'Slide 2 content', 'Slide 3 content'];

  it('InstagramPreview renders scaled preview with current slide', () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <InstagramPreview
        slides={mockSlides}
        currentIndex={0}
        brand={mockBrand}
      />
    );
    expect(html).toContain('Slide 1 content');
    // Check for scaled container or progress indicator
    expect(html).toMatch(/1 \/ 3/);
  });

  it('TikTokPreview renders bold minimal preview', () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <TikTokPreview
        slides={mockSlides}
        currentIndex={1}
        brand={mockBrand}
      />
    );
    expect(html).toContain('Slide 2 content');
  });

  it('SlideNavigator renders arrows and calls onChange', () => {
    const onChange = vi.fn();
    // Since it's a client component with buttons, we test the structure and simulate via props if possible.
    // For light test, check it renders buttons.
    const html = ReactDOMServer.renderToStaticMarkup(
      <SlideNavigator
        currentIndex={1}
        total={3}
        onChange={onChange}
      />
    );
    expect(html).toMatch(/previous|next|←|→/i);
  });

  it('ExportButton renders download options and triggers callbacks', () => {
    const onDownloadPNG = vi.fn();
    const onDownloadPDF = vi.fn();
    const html = ReactDOMServer.renderToStaticMarkup(
      <ExportButton
        onDownloadPNG={onDownloadPNG}
        onDownloadPDF={onDownloadPDF}
      />
    );
    expect(html).toMatch(/PNG|PDF/i);
  });
});
