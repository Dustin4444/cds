import {
  illustrationCssVarToThemeKey,
  illustrationThemeKeyToCssVarName,
} from '../illustrationCssVarUtils';

describe('illustrationThemeKeyToCssVarName', () => {
  it('maps simple keys without digits', () => {
    expect(illustrationThemeKeyToCssVarName('primary')).toBe('--illustration-primary');
    expect(illustrationThemeKeyToCssVarName('black')).toBe('--illustration-black');
    expect(illustrationThemeKeyToCssVarName('white')).toBe('--illustration-white');
    expect(illustrationThemeKeyToCssVarName('gray')).toBe('--illustration-gray');
    expect(illustrationThemeKeyToCssVarName('positive')).toBe('--illustration-positive');
    expect(illustrationThemeKeyToCssVarName('negative')).toBe('--illustration-negative');
    expect(illustrationThemeKeyToCssVarName('invert')).toBe('--illustration-invert');
  });

  it('inserts hyphen before trailing digits', () => {
    expect(illustrationThemeKeyToCssVarName('gray2')).toBe('--illustration-gray-2');
    expect(illustrationThemeKeyToCssVarName('gray3')).toBe('--illustration-gray-3');
    expect(illustrationThemeKeyToCssVarName('accent1')).toBe('--illustration-accent-1');
    expect(illustrationThemeKeyToCssVarName('accent2')).toBe('--illustration-accent-2');
    expect(illustrationThemeKeyToCssVarName('accent3')).toBe('--illustration-accent-3');
    expect(illustrationThemeKeyToCssVarName('accent4')).toBe('--illustration-accent-4');
    expect(illustrationThemeKeyToCssVarName('invert2')).toBe('--illustration-invert-2');
  });
});

describe('illustrationCssVarToThemeKey', () => {
  it('strips var() wrapper and prefix for simple keys', () => {
    expect(illustrationCssVarToThemeKey('var(--illustration-primary)')).toBe('primary');
    expect(illustrationCssVarToThemeKey('var(--illustration-black)')).toBe('black');
    expect(illustrationCssVarToThemeKey('var(--illustration-positive)')).toBe('positive');
  });

  it('handles bare CSS variable names without var() wrapper', () => {
    expect(illustrationCssVarToThemeKey('--illustration-primary')).toBe('primary');
    expect(illustrationCssVarToThemeKey('--illustration-gray')).toBe('gray');
  });

  it('removes hyphen before digits to restore theme key', () => {
    expect(illustrationCssVarToThemeKey('var(--illustration-accent-1)')).toBe('accent1');
    expect(illustrationCssVarToThemeKey('var(--illustration-accent-4)')).toBe('accent4');
    expect(illustrationCssVarToThemeKey('var(--illustration-gray-2)')).toBe('gray2');
    expect(illustrationCssVarToThemeKey('var(--illustration-gray-3)')).toBe('gray3');
    expect(illustrationCssVarToThemeKey('var(--illustration-invert-2)')).toBe('invert2');
  });

  it('roundtrips with illustrationThemeKeyToCssVarName', () => {
    const keys = [
      'primary',
      'black',
      'white',
      'gray',
      'gray2',
      'gray3',
      'positive',
      'negative',
      'accent1',
      'accent2',
      'accent3',
      'accent4',
      'invert',
      'invert2',
    ];
    for (const key of keys) {
      const cssVar = illustrationThemeKeyToCssVarName(key);
      expect(illustrationCssVarToThemeKey(cssVar)).toBe(key);
    }
  });
});
