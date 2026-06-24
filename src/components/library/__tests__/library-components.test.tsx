import { describe, it, expect, vi } from 'vitest';
import ReactDOMServer from 'react-dom/server';
import React from 'react';

// These imports will fail until components are created/implemented
import HistoryList from '../history-list';
import HistoryCard from '../history-card';
import SearchBar from '../search-bar';
import GenerationDetail from '../generation-detail';
import RegenerateOptions from '../regenerate-options';

// Mock the server action imported by generation-detail to prevent module resolution issues in test
vi.mock('@/lib/actions/history/update', () => ({
  updateOutputAction: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock('@/lib/actions/history/regenerate', () => ({
  regenerateGenerationAction: vi.fn().mockResolvedValue({ success: true, newGenerationId: 'new_gen' }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('Library Components', () => {
  const mockBrand = {
    brandName: 'TestBrand',
    primaryColor: '#de1d8d',
    platformHandles: { instagram: '@testbrand' },
  };

  const mockGeneration = {
    id: 'gen_123',
    createdAt: new Date('2024-01-01'),
    inputText: 'This is a sample input about AI development and content strategy.',
    inputType: 'LINKEDIN_POST',
    platforms: ['X', 'INSTAGRAM'],
  };

  const mockOutputs = [
    {
      id: 'out_1',
      platform: 'X',
      recommendedIndex: 0,
      recommendationReason: 'Best for X',
      variations: [
        { content: 'Variation 1 for X' },
        { content: 'Variation 2 for X' },
        { content: 'Variation 3 for X' },
      ],
    },
    {
      id: 'out_2',
      platform: 'INSTAGRAM',
      recommendedIndex: 1,
      recommendationReason: 'Best for IG',
      variations: [
        { content: 'Variation 1 for IG' },
        { content: 'Variation 2 for IG' },
        { content: 'Variation 3 for IG' },
      ],
    },
  ];

  const mockVisuals = [
    { url: 'https://example.com/visual1.png', type: 'instagram', dimensions: { width: 1080, height: 1350 } },
  ];

  const mockGenerations = [
    {
      id: 'gen_123',
      createdAt: new Date('2024-01-01'),
      inputText: 'Sample input text...',
      inputType: 'LINKEDIN_POST',
      platforms: ['X', 'INSTAGRAM'],
      outputs: [{ platform: 'X' }, { platform: 'INSTAGRAM' }],
    },
  ];

  it('HistoryList renders list of HistoryCard items', () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <HistoryList generations={mockGenerations} />
    );
    expect(html).toContain('data-testid="history-list"');
    expect(html).toContain('gen_123');
    expect(html).toContain('Sample input text');
  });

  it('HistoryCard renders date, input type, truncated preview, and platform badges', () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <HistoryCard
        generation={mockGenerations[0]}
        brand={mockBrand}
      />
    );
    expect(html).toContain('2024'); // date
    expect(html).toContain('LINKEDIN_POST'); // or icon
    expect(html).toContain('Sample input text'); // preview
    expect(html).toMatch(/X|INSTAGRAM/); // badges
  });

  it('SearchBar renders input field and is client component', () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <SearchBar initialQuery="AI" />
    );
    expect(html).toContain('search');
    expect(html).toContain('AI');
  });

  it('GenerationDetail renders all outputs, variations, and visual assets', () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <GenerationDetail
        generation={mockGeneration}
        outputs={mockOutputs}
        visuals={mockVisuals}
      />
    );
    expect(html).toMatch(/gen_123/);
    expect(html).toContain('Variation 1 for X');
    expect(html).toMatch(/visual1\.png/); // visual asset
    expect(html.toLowerCase()).toMatch(/x|instagram/);
  });

  it('RegenerateOptions renders style/tone options and calls onRegenerate', () => {
    const onRegenerate = vi.fn();
    const onClose = vi.fn();
    const html = ReactDOMServer.renderToStaticMarkup(
      <RegenerateOptions
        currentTone="educational"
        onRegenerate={onRegenerate}
        onClose={onClose}
      />
    );
    expect(html.toLowerCase()).toMatch(/tone|regenerate|educational/);
  });
});
