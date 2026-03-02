import React, { memo, useMemo } from 'react';
import { LiveProvider } from 'react-live';
import { useSandpack } from '@codesandbox/sandpack-react';

import ReactLiveScope from '../ReactLiveScope';

const stripImportsAndExports = (code: string): string => {
  const lines = code.split('\n');
  const outputLines: string[] = [];
  let inImportBlock = false;
  let inTypeBlock = false;
  let braceDepth = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    if (inImportBlock) {
      if (trimmed.endsWith(';')) {
        inImportBlock = false;
      }
      continue;
    }

    if (/^import(\s|{|\*)/.test(trimmed)) {
      if (!trimmed.endsWith(';')) {
        inImportBlock = true;
      }
      continue;
    }

    if (inTypeBlock) {
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

    if (/^(export\s+)?type\s+\w+/.test(trimmed)) {
      if (trimmed.endsWith(';') && !trimmed.includes('{')) continue;
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

    let outputLine = line.replace(/^export\s+default\s+/, '');
    outputLine = outputLine.replace(/^export\s+/, '');

    outputLines.push(outputLine);
  }

  return outputLines.join('\n').trim();
};

type SandpackBridgeProps = {
  children: React.ReactNode;
  noInline?: boolean;
  scope?: Record<string, unknown>;
  isMultiFile?: boolean;
  executionCode?: string;
};

export const SandpackBridge = memo(function SandpackBridge({
  children,
  noInline,
  scope = ReactLiveScope,
  isMultiFile = false,
  executionCode,
}: SandpackBridgeProps) {
  const { sandpack } = useSandpack();

  const code = useMemo(() => {
    if (executionCode != null) {
      return executionCode;
    }

    const files = sandpack.files;

    if (!isMultiFile) {
      const raw = files[sandpack.activeFile]?.code ?? '';
      return stripImportsAndExports(raw);
    }

    const visibleFiles = sandpack.visibleFiles;

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
  }, [sandpack.files, sandpack.activeFile, sandpack.visibleFiles, isMultiFile, executionCode]);

  return (
    <LiveProvider code={code} noInline={isMultiFile || noInline} scope={scope}>
      {children}
    </LiveProvider>
  );
});
