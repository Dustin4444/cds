const ILLUSTRATION_CSS_VAR_PREFIX = '--illustration-';
const TRAILING_DIGIT_REGEX = /([a-zA-Z])(\d)/g;
const CSS_VAR_WRAPPER_REGEX = /^var\((.*)\)$/;
const HYPHEN_BEFORE_DIGIT_REGEX = /-(\d)/g;

/**
 * Maps an illustration theme key to its corresponding CSS custom property name.
 * Keys with trailing digits get a hyphen inserted before the digit.
 * @example illustrationThemeKeyToCssVarName('accent1')  // '--illustration-accent-1'
 * @example illustrationThemeKeyToCssVarName('primary')  // '--illustration-primary'
 */
export function illustrationThemeKeyToCssVarName(key: string): string {
  const hyphenated = key.replace(TRAILING_DIGIT_REGEX, '$1-$2');
  return `${ILLUSTRATION_CSS_VAR_PREFIX}${hyphenated}`;
}

/**
 * Maps a CSS custom property name (with or without `var()` wrapper) back to its
 * illustration theme key.
 * @example illustrationCssVarToThemeKey('var(--illustration-accent-1)')  // 'accent1'
 * @example illustrationCssVarToThemeKey('--illustration-gray-2')         // 'gray2'
 */
export function illustrationCssVarToThemeKey(cssVar: string): string {
  const unwrapped = cssVar.replace(CSS_VAR_WRAPPER_REGEX, '$1');
  const name = unwrapped.replace(ILLUSTRATION_CSS_VAR_PREFIX, '');
  return name.replace(HYPHEN_BEFORE_DIGIT_REGEX, '$1');
}
