/**
 * Utilities for extracting preview snippets from code using marker comments.
 *
 * Markers:
 *   // @preview-start
 *   // @preview-end
 *
 * The preview snippet is the code between these markers, shown in the collapsed
 * view. When copying, auto-generated imports are prepended.
 */

const PREVIEW_START_MARKER = /^\s*\/\/\s*@preview-start\s*$/;
const PREVIEW_END_MARKER = /^\s*\/\/\s*@preview-end\s*$/;

/**
 * Extract the preview region from code marked with @preview-start / @preview-end.
 * Returns the snippet (without markers) or null if no markers found.
 */
export const extractPreviewSnippet = (code: string): string | null => {
  const lines = code.split('\n');
  let startIndex = -1;
  let endIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (PREVIEW_START_MARKER.test(lines[i])) {
      startIndex = i;
    } else if (PREVIEW_END_MARKER.test(lines[i])) {
      endIndex = i;
      break;
    }
  }

  if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
    return null;
  }

  // Extract the lines between markers (exclusive of markers)
  const snippetLines = lines.slice(startIndex + 1, endIndex);

  // Remove common leading indentation
  const nonEmptyLines = snippetLines.filter((line) => line.trim().length > 0);
  if (nonEmptyLines.length === 0) return null;

  const minIndent = Math.min(
    ...nonEmptyLines.map((line) => {
      const match = line.match(/^(\s*)/);
      return match ? match[1].length : 0;
    }),
  );

  const dedented = snippetLines.map((line) =>
    line.length > minIndent ? line.slice(minIndent) : line.trimStart(),
  );

  return dedented.join('\n').trim();
};

/**
 * Strip preview marker comments from code so react-live can execute it cleanly.
 */
export const stripPreviewMarkers = (code: string): string => {
  return code
    .split('\n')
    .filter((line) => !PREVIEW_START_MARKER.test(line) && !PREVIEW_END_MARKER.test(line))
    .join('\n');
};

/**
 * Check if code contains preview markers.
 */
export const hasPreviewMarkers = (code: string): boolean => {
  const lines = code.split('\n');
  return (
    lines.some((line) => PREVIEW_START_MARKER.test(line)) &&
    lines.some((line) => PREVIEW_END_MARKER.test(line))
  );
};
