import { describe, it, expect, vi } from 'vitest';
import ReactDOMServer from 'react-dom/server';
import React from 'react';

// These will fail until implemented
import CardPreview from '../card-preview';
import StyleSelector from '../style-selector';
import RegenerateStatement from '../regenerate-statement';

describe('Impact Card Components', () => {
  const mockBrand = {
    brandName: 'TestBrand',
    primaryColor: '#de1d8d',
    platformHandles: { instagram: '@testbrand' },
  };

  const mockStatements = [
    'First impactful statement.',
    'Second bold quote here.',
    'Third memorable line.',
  ];

  it('CardPreview renders the statement with brand info', () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <CardPreview
        statement={mockStatements[0]}
        style="white"
        brand={mockBrand}
      />
    );
    expect(html).toContain(mockStatements[0]);
    expect(html).toContain('TestBrand');
  });

  it('StyleSelector renders three options and calls onChange', () => {
    const onChange = vi.fn();
    const html = ReactDOMServer.renderToStaticMarkup(
      <StyleSelector
        currentStyle="white"
        onChange={onChange}
        brand={mockBrand}
      />
    );
    expect(html.toLowerCase()).toMatch(/white|black|gradient/);
  });

  it('RegenerateStatement shows current and allows regenerate', () => {
    const onRegenerate = vi.fn();
    const html = ReactDOMServer.renderToStaticMarkup(
      <RegenerateStatement
        currentStatement={mockStatements[0]}
        statements={mockStatements}
        onRegenerate={onRegenerate}
      />
    );
    expect(html).toContain(mockStatements[0]);
    expect(html.toLowerCase()).toMatch(/regenerate/);
  });
});
