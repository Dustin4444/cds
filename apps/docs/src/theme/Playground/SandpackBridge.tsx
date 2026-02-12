import React, { memo, useMemo } from 'react';
import { LiveProvider } from 'react-live';
import { useSandpack } from '@codesandbox/sandpack-react';

import ReactLiveScope from '../ReactLiveScope';

/**
 * Strips import/export statements and type declarations from code so it can
 * be executed by react-live (which provides all identifiers via scope).
 */
const stripImportsAndExports = (code: string): string => {
  const lines = code.split('\n');
  const outputLines: string[] = [];
  let inTypeBlock = false;
  let braceDepth = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip import statements (including import type)
    if (/^import\s/.test(trimmed)) continue;

    // Track multi-line type declarations
    if (inTypeBlock) {
      // Count braces to find the end of the type block
      for (const ch of trimmed) {
        if (ch === '{') braceDepth++;
        if (ch === '}') braceDepth--;
      }
      if (braceDepth <= 0) {
        inTypeBlock = false;
        braceDepth = 0;
      }
      continue;
    }

    // Start of a type declaration
    if (/^(export\s+)?type\s+\w+/.test(trimmed)) {
      // Single-line type (e.g. `type Foo = string;`)
      if (trimmed.endsWith(';') && !trimmed.includes('{')) continue;
      // Multi-line type block
      braceDepth = 0;
      for (const ch of trimmed) {
        if (ch === '{') braceDepth++;
        if (ch === '}') braceDepth--;
      }
      if (braceDepth > 0) {
        inTypeBlock = true;
      }
      continue;
    }

    // Strip "export default " but keep the declaration
    let outputLine = line.replace(/^export\s+default\s+/, '');
    // Strip "export " but keep the declaration
    outputLine = outputLine.replace(/^export\s+/, '');

    outputLines.push(outputLine);
  }

  return outputLines.join('\n').trim();
};

type SandpackBridgeProps = {
  children: React.ReactNode;
  noInline?: boolean;
  scope?: Record<string, unknown>;
  /** When true, strips imports/exports and concatenates files for react-live. */
  isMultiFile?: boolean;
  /**
   * Override code for execution. When provided, this code is used for react-live
   * instead of reading from Sandpack files. This allows the editor to show a
   * snippet while react-live executes the full code.
   */
  executionCode?: string;
};

/**
 * Bridge component that reads code from Sandpack's context and passes it
 * to react-live's LiveProvider for inline execution/preview.
 *
 * For single-file examples: uses executionCode if provided, otherwise reads from active file.
 * For multi-file examples: strips imports/exports, concatenates visible files
 * (supporting files first, Example.tsx last), and appends render(<Example />).
 *
 * Children are rendered inside LiveProvider and can use LivePreview/LiveError.
 */
export const SandpackBridge = memo(function SandpackBridge({
  children,
  noInline,
  scope = ReactLiveScope,
  isMultiFile = false,
  executionCode,
}: SandpackBridgeProps) {
  const { sandpack } = useSandpack();

  const code = useMemo(() => {
    // If override code is provided, use it for execution
    if (executionCode != null) {
      return executionCode;
    }

    const files = sandpack.files;

    if (!isMultiFile) {
      // Single file: read from the active file
      return files[sandpack.activeFile]?.code ?? '';
    }

    // Multi-file: only process our visible files (not Sandpack template files)
    const visibleFiles = sandpack.visibleFiles;

    // Sort so supporting files come first, Example.tsx last
    const sorted = [...visibleFiles].sort((a, b) => {
      const isAExample = a.includes('Example');
      const isBExample = b.includes('Example');
      if (isAExample && !isBExample) return 1;
      if (!isAExample && isBExample) return -1;
      return a.localeCompare(b);
    });

    const processedFiles = sorted.map((fileName) => {
      const fileCode = files[fileName]?.code ?? '';
      return stripImportsAndExports(fileCode);
    });

    return processedFiles.filter(Boolean).join('\n\n') + '\n\nrender(<Example />);';
  }, [sandpack.files, sandpack.activeFile, sandpack.visibleFiles, isMultiFile]);

  return (
    <LiveProvider code={code} noInline={isMultiFile || noInline} scope={scope}>
      {children}
    </LiveProvider>
  );
});
