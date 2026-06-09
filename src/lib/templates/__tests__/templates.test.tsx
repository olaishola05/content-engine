import { describe, it, expect } from 'vitest';
import ReactDOMServer from 'react-dom/server';

// These will fail until templates are implemented
import InstagramCarouselLayout from '../instagram-carousel/layout';
import InstagramCarouselSlide from '../instagram-carousel/slide';
import TikTokCarouselLayout from '../tiktok-carousel/layout';
import TikTokCarouselSlide from '../tiktok-carousel/slide';
import ImpactCardLayout from '../impact-card/layout';

describe('RSC HTML Templates (Phase 5)', () => {
  const mockBrand = {
    brandName: 'TestBrand',
    primaryColor: '#de1d8d',
    platformHandles: { instagram: '@testbrand' },
  };

  describe('Instagram Carousel Templates', () => {
    it('InstagramCarouselSlide renders with progress bar and swipe arrow cues', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        <InstagramCarouselSlide
          content="Test slide content"
          index={0}
          total={7}
          brand={mockBrand}
        />
      );
      expect(html).toContain('Test slide content');
      expect(html.toLowerCase()).toContain('progress');
      expect(html).toContain('→'); // swipe arrow cue
    });

    it('InstagramCarouselLayout wraps slides and includes arc structure', () => {
      const slides = ['slide1', 'slide2'];
      const html = ReactDOMServer.renderToStaticMarkup(
        <InstagramCarouselLayout brand={mockBrand}>
          {slides.map((s, i) => (
            <InstagramCarouselSlide
              key={i}
              content={s}
              index={i}
              total={2}
              brand={mockBrand}
            />
          ))}
        </InstagramCarouselLayout>
      );
      expect(html).toContain('slide1');
      expect(html).toContain('slide2');
      expect(html.toLowerCase()).toContain('carousel');
    });
  });

  describe('TikTok Carousel Templates', () => {
    it('TikTokCarouselSlide renders bold minimal text', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        <TikTokCarouselSlide
          content="Bold hook"
          index={0}
          total={3}
          brand={mockBrand}
        />
      );
      expect(html).toContain('Bold hook');
      // Check for high contrast / bold styles in class or structure
      expect(html.toLowerCase()).toMatch(/font-bold|text-2xl|text-3xl/);
    });

    it('TikTokCarouselLayout uses 9:16 vertical structure', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        <TikTokCarouselLayout brand={mockBrand}>
          <TikTokCarouselSlide content="Hook" index={0} total={3} brand={mockBrand} />
        </TikTokCarouselLayout>
      );
      expect(html.toLowerCase()).toContain('9:16');
      expect(html).toContain('Hook');
    });
  });

  describe('Impact Card Template', () => {
    it('ImpactCardLayout supports white background style', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        <ImpactCardLayout
          statement="Powerful quote"
          style="white"
          brand={mockBrand}
        />
      );
      expect(html).toContain('Powerful quote');
      expect(html.toLowerCase()).toContain('white');
      expect(html).toContain(mockBrand.brandName);
    });

    it('ImpactCardLayout supports black background style', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        <ImpactCardLayout
          statement="Another quote"
          style="black"
          brand={mockBrand}
        />
      );
      expect(html).toContain('Another quote');
      expect(html.toLowerCase()).toContain('black');
    });

    it('ImpactCardLayout supports brand gradient style using primaryColor', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        <ImpactCardLayout
          statement="Gradient quote"
          style="gradient"
          brand={mockBrand}
        />
      );
      expect(html).toContain('Gradient quote');
      expect(html.toLowerCase()).toContain('gradient');
      expect(html).toContain(mockBrand.primaryColor);
    });
  });
});
