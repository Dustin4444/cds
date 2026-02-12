/**
 * Determines how code should be displayed in the playground based on its content.
 *
 * Two modes:
 * - `snippet`: Has an extractable JSX return that's <= MAX_VISIBLE_LINES lines.
 *   Shows a clipped view of the editor by default. "Expand code" / "Collapse code" toggles full view.
 * - `full`: Either no extractable JSX return, or the JSX is too long.
 *   Code hidden by default. "Show code" / "Hide code" toggles visibility.
 */

const MAX_VISIBLE_LINES = 15;

/** Approximate line height in pixels for the Sandpack editor */
const EDITOR_LINE_HEIGHT_PX = 21;
/** Vertical padding in the editor */
const EDITOR_PADDING_PX = 16;

export type CodeDisplayMode = 'snippet' | 'full';

export type CodeDisplayInfo = {
  mode: CodeDisplayMode;
  /**
   * For 'snippet' mode: the max-height in px to clip the editor to, showing
   * only the relevant lines. Null when no clipping is needed.
   */
  collapsedHeightPx: number | null;
  /**
   * For 'snippet' mode: the scroll offset in px to position the JSX return
   * at the top of the clipped view. Null when no clipping is needed.
   */
  scrollOffsetPx: number | null;
};

/**
 * Find the line range of the last `return (...)` statement in the code.
 * Returns [startLine, endLine] (0-indexed, inclusive) or null.
 */
const findJsxReturnRange = (code: string): [number, number] | null => {
  const lines = code.split('\n');

  let returnLineIndex = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (/^\s*return\s*\(\s*$/.test(lines[i]) || /^\s*return\s*\(/.test(lines[i])) {
      returnLineIndex = i;
      break;
    }
  }

  if (returnLineIndex === -1) return null;

  let depth = 0;
  let endLine = -1;

  for (let i = returnLineIndex; i < lines.length; i++) {
    for (const ch of lines[i]) {
      if (ch === '(') depth++;
      if (ch === ')') depth--;
    }
    if (depth === 0) {
      endLine = i;
      break;
    }
  }

  if (endLine === -1) return null;

  // Include the return( line and closing ) line in the visible range
  return [returnLineIndex, endLine];
};

/**
 * Extract the JSX return content as a standalone snippet string.
 * Returns the content between `return (` and `)`, dedented. Null if not found.
 */
export const extractSnippetFromCode = (code: string): string | null => {
  const range = findJsxReturnRange(code);
  if (!range) return null;

  const lines = code.split('\n');
  const [start, end] = range;
  const contentLines = lines.slice(start + 1, end); // exclude `return (` and `)`

  if (contentLines.length === 0) {
    const match = lines[start].match(/return\s*\(\s*(.*)\s*\)\s*;?\s*$/);
    if (match) return match[1].trim();
    return null;
  }

  const nonEmptyLines = contentLines.filter((l) => l.trim().length > 0);
  if (nonEmptyLines.length === 0) return null;

  const minIndent = Math.min(
    ...nonEmptyLines.map((l) => {
      const m = l.match(/^(\s*)/);
      return m ? m[1].length : 0;
    }),
  );

  return contentLines
    .map((l) => (l.length > minIndent ? l.slice(minIndent) : l.trimStart()))
    .join('\n')
    .trim();
};

/**
 * Splice an edited snippet back into the full code, replacing the return body.
 * Returns the updated full code, or the original if splicing fails.
 */
export const spliceSnippetIntoCode = (fullCode: string, editedSnippet: string): string => {
  const range = findJsxReturnRange(fullCode);
  if (!range) return fullCode;

  const lines = fullCode.split('\n');
  const [start, end] = range;

  // Get the indentation of the original return body
  const originalContentLines = lines.slice(start + 1, end);
  const nonEmpty = originalContentLines.filter((l) => l.trim().length > 0);
  const indent = nonEmpty.length > 0
    ? (nonEmpty[0].match(/^(\s*)/)?.[1] ?? '    ')
    : '    ';

  // Re-indent the edited snippet to match the original
  const snippetLines = editedSnippet.split('\n');
  const reindented = snippetLines.map((l) => (l.trim().length > 0 ? indent + l : l));

  // Reconstruct: lines before return( + return( + reindented snippet + ) + lines after )
  const before = lines.slice(0, start + 1); // includes `return (`
  const after = lines.slice(end); // includes `)` and beyond

  return [...before, ...reindented, ...after].join('\n');
};

/**
 * Analyze code and determine the display mode.
 *
 * If the code is short (<= MAX_VISIBLE_LINES), show it all (snippet mode with full height).
 * If we can find a short JSX return, clip the editor to show just those lines.
 * Otherwise, hide the code entirely until "Show code".
 */
export const getCodeDisplayInfo = (code: string): CodeDisplayInfo => {
  const lines = code.split('\n');
  const lineCount = lines.length;

  // Short code: show all of it
  if (lineCount <= MAX_VISIBLE_LINES) {
    return {
      mode: 'snippet',
      collapsedHeightPx: null,
      scrollOffsetPx: null,
    };
  }

  // Try to find a JSX return range
  const range = findJsxReturnRange(code);
  if (range) {
    const [start, end] = range;
    const rangeLines = end - start + 1;
    if (rangeLines <= MAX_VISIBLE_LINES) {
      const heightPx = rangeLines * EDITOR_LINE_HEIGHT_PX + EDITOR_PADDING_PX;
      // Offset to scroll the return line to the top of the clipped view
      const scrollOffsetPx = start * EDITOR_LINE_HEIGHT_PX;
      return {
        mode: 'snippet',
        collapsedHeightPx: heightPx,
        scrollOffsetPx,
      };
    }
  }

  // Complex code: show/hide entirely
  return { mode: 'full', collapsedHeightPx: null, scrollOffsetPx: null };
};
