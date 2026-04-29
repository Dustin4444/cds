const SVG_ID_DEF_REGEX = /\bid="([^"]+)"/g;
const SVG_URL_REF_REGEX = /url\(#([^)]+)\)/g;
const SVG_HREF_REF_REGEX = /href="#([^"]+)"/g;

/**
 * Prefixes all SVG element IDs and their corresponding references with a
 * unique string to prevent ID collisions when multiple inline SVGs share the
 * same document. Handles `id`, `url(#...)`, and `href="#..."` patterns.
 */
export function prefixSvgIds(svg: string, prefix: string): string {
  return svg
    .replace(SVG_ID_DEF_REGEX, `id="${prefix}_$1"`)
    .replace(SVG_URL_REF_REGEX, `url(#${prefix}_$1)`)
    .replace(SVG_HREF_REF_REGEX, `href="#${prefix}_$1"`);
}
