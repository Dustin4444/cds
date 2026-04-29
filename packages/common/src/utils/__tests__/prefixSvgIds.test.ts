import { prefixSvgIds } from '../prefixSvgIds';

describe('prefixSvgIds', () => {
  it('prefixes id definitions', () => {
    const svg = '<svg><clipPath id="a"><path d="M0 0"/></clipPath></svg>';
    expect(prefixSvgIds(svg, 'myIllo')).toBe(
      '<svg><clipPath id="myIllo_a"><path d="M0 0"/></clipPath></svg>',
    );
  });

  it('prefixes url(#...) references', () => {
    const svg = '<svg><g clip-path="url(#a)"><path d="M0 0"/></g></svg>';
    expect(prefixSvgIds(svg, 'myIllo')).toBe(
      '<svg><g clip-path="url(#myIllo_a)"><path d="M0 0"/></g></svg>',
    );
  });

  it('prefixes href="#..." references', () => {
    const svg = '<svg><use href="#icon"/></svg>';
    expect(prefixSvgIds(svg, 'myIllo')).toBe('<svg><use href="#myIllo_icon"/></svg>');
  });

  it('handles multiple IDs and references together', () => {
    const svg =
      '<svg><defs><clipPath id="a"><path d="M0 0h48v48H0z"/></clipPath><linearGradient id="b"><stop offset="0"/></linearGradient></defs><g clip-path="url(#a)"><path fill="url(#b)"/></g></svg>';
    const result = prefixSvgIds(svg, 'earn');
    expect(result).toContain('id="earn_a"');
    expect(result).toContain('id="earn_b"');
    expect(result).toContain('url(#earn_a)');
    expect(result).toContain('url(#earn_b)');
  });

  it('does not modify SVG content outside of ID patterns', () => {
    const svg = '<svg><path fill="var(--illustration-primary)" d="M0 0h96v96H0z"/></svg>';
    expect(prefixSvgIds(svg, 'test')).toBe(svg);
  });

  it('handles SVGs with no IDs', () => {
    const svg = '<svg><rect width="10" height="10"/></svg>';
    expect(prefixSvgIds(svg, 'test')).toBe(svg);
  });
});
