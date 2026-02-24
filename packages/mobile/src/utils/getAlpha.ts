/**
 * Extracts the alpha (opacity) value from an RGBA color string.
 *
 * @param color - A color string, e.g. "rgba(255, 0, 0, 0.5)" or "#FF0000"
 * @returns The alpha value as a string (0-1), defaults to "1" if not an RGBA color
 *
 * @example
 * getAlpha("rgba(255, 0, 0, 0.5)") // returns "0.5"
 * getAlpha("#FF0000") // returns "1"
 */
export function getAlpha(color: string) {
  const match = color.includes('rgba') && color.match(/,\s?([\d.]*)\)$/);
  if (match) {
    return match[1];
  }
  return '1';
}
