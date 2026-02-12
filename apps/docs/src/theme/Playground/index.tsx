import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SandpackCodeEditor, SandpackProvider, useSandpack } from '@codesandbox/sandpack-react';
import { LiveError, LivePreview } from 'react-live';
import { useTabsContext } from '@coinbase/cds-common/tabs/TabsContext';
import type { TabValue } from '@coinbase/cds-common/tabs/useTabs';
import { Collapsible } from '@coinbase/cds-web/collapsible/Collapsible';
import { Icon } from '@coinbase/cds-web/icons/Icon';
import { IconButton } from '@coinbase/cds-web/buttons/IconButton';
import { HStack } from '@coinbase/cds-web/layout/HStack';
import { VStack } from '@coinbase/cds-web/layout/VStack';
import { Box } from '@coinbase/cds-web/layout';
import { useToast } from '@coinbase/cds-web/overlays/useToast';
import { Pressable } from '@coinbase/cds-web/system';
import { ThemeProvider } from '@coinbase/cds-web/system/ThemeProvider';
import { Tabs, TabsActiveIndicator, type TabsActiveIndicatorProps } from '@coinbase/cds-web/tabs';
import { Text } from '@coinbase/cds-web/typography/Text';
import BrowserOnly from '@docusaurus/BrowserOnly';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import { ErrorBoundaryErrorMessageFallback } from '@docusaurus/theme-common';
import * as estreePlugin from 'prettier/plugins/estree.js';
import * as typescriptPlugin from 'prettier/plugins/typescript.js';
import { format } from 'prettier/standalone';

import { usePlaygroundTheme } from '../Layout/Provider/UnifiedThemeContext';
import { generateImports } from '../importMap';

import { CodeSandboxExportButton } from './CodeSandboxExport';
import { SandpackBridge } from './SandpackBridge';
import { extractPreviewSnippet, hasPreviewMarkers } from './previewSnippet';
import styles from './styles.module.css';

// --- Utilities ---

const isHeader = (element: HTMLElement): boolean => {
  return (
    element.tagName === 'H1' ||
    element.tagName === 'H2' ||
    element.tagName === 'H3' ||
    element.tagName === 'H4' ||
    element.tagName === 'H5' ||
    element.tagName === 'H6'
  );
};

const useGetHeadingText = () => {
  const [headingText, setHeadingText] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current?.parentElement) return;

    let currentElement = editorRef.current.parentElement;
    if (isHeader(currentElement) && currentElement.classList.contains('anchor')) {
      setHeadingText(currentElement.textContent?.toLowerCase() || '');
      return;
    }

    while (currentElement.previousElementSibling) {
      currentElement = currentElement.previousElementSibling as HTMLElement;
      if (isHeader(currentElement) && currentElement.classList.contains('anchor')) {
        setHeadingText(currentElement.textContent?.toLowerCase() || '');
        return;
      }
    }

    setHeadingText('');
  }, []);

  return { editorRef, headingText };
};

const prettierOptions = {
  parser: 'typescript',
  plugins: [estreePlugin, typescriptPlugin] as any,
  arrowParens: 'always',
  bracketSameLine: false,
  jsxSingleQuote: false,
  printWidth: 100,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
} as const;

const renderErrorFallback = (params: any) => <ErrorBoundaryErrorMessageFallback {...params} />;

const previewContent = () => (
  <>
    <ErrorBoundary fallback={renderErrorFallback}>
      <LivePreview />
    </ErrorBoundary>
    <LiveError />
  </>
);

// --- Sub-components that live inside SandpackProvider context ---

// File tab component following the pattern from HookTabsContainer
const FileTabComponent = ({ id, label }: TabValue) => {
  const { activeTab, updateActiveTab } = useTabsContext();
  const isActive = activeTab?.id === id;
  return (
    <Pressable
      color={isActive ? 'fgPrimary' : 'fgMuted'}
      font="label2"
      onClick={() => updateActiveTab(id)}
      paddingBottom={0.5}
      paddingTop={0.25}
    >
      {label}
    </Pressable>
  );
};

const FileTabsIndicator = (props: TabsActiveIndicatorProps) => {
  return <TabsActiveIndicator {...props} background="bgPrimary" bottom={0} height={2} />;
};

/** Renders CDS Tabs for switching between files in a multi-file example. */
const FileTabBar = memo(function FileTabBar() {
  const { sandpack } = useSandpack();

  const tabs: TabValue[] = useMemo(() => {
    return Object.keys(sandpack.files)
      .filter((f) => sandpack.visibleFiles.includes(f))
      .map((filePath) => ({
        id: filePath,
        label: filePath.replace(/^\//, ''),
      }));
  }, [sandpack.files, sandpack.visibleFiles]);

  const activeTab: TabValue | null = useMemo(
    () => tabs.find((t) => t.id === sandpack.activeFile) ?? tabs[0] ?? null,
    [tabs, sandpack.activeFile],
  );

  const handleChange = useCallback(
    (tab: TabValue | null) => {
      if (tab) {
        sandpack.setActiveFile(tab.id);
      }
    },
    [sandpack],
  );

  if (tabs.length <= 1) return null;

  return (
    <Tabs
      TabComponent={FileTabComponent}
      TabsActiveIndicatorComponent={FileTabsIndicator}
      activeBackground="bgPrimary"
      activeTab={activeTab}
      gap={2}
      onChange={handleChange}
      tabs={tabs}
    />
  );
});

type PlaygroundControlsProps = {
  collapsed: boolean;
  headingText: string;
  onToggleCollapsed: () => void;
  isMultiFile: boolean;
};

/** Controls bar: file tabs (left), show/hide toggle (center), icon buttons (right). */
const PlaygroundControls = memo(function PlaygroundControls({
  collapsed,
  headingText,
  onToggleCollapsed,
  isMultiFile,
}: PlaygroundControlsProps) {
  const toast = useToast();
  const { sandpack } = useSandpack();

  const handleCopyToClipboard = useCallback(() => {
    const activeFile = sandpack.activeFile;
    const code = sandpack.files[activeFile]?.code ?? '';

    // When collapsed and code has preview markers, copy the preview snippet with imports
    if (collapsed && hasPreviewMarkers(code)) {
      const snippet = extractPreviewSnippet(code);
      if (snippet) {
        const imports = generateImports(snippet);
        const copyText = imports ? `${imports}\n\n${snippet}` : snippet;
        navigator.clipboard
          .writeText(copyText)
          .then(() => toast.show('Copied to clipboard'))
          .catch(() => toast.show('Failed to copy to clipboard'));
        return;
      }
    }

    // Otherwise copy the full code
    navigator.clipboard
      .writeText(code)
      .then(() => toast.show('Copied to clipboard'))
      .catch(() => toast.show('Failed to copy to clipboard'));
  }, [sandpack, toast, collapsed]);

  const handleReset = useCallback(() => {
    sandpack.resetAllFiles();
    toast.show('Code reset');
  }, [sandpack, toast]);

  return (
    <VStack gap={0.5} paddingTop={0.5}>
      {/* File tabs (multi-file only) */}
      {isMultiFile && <FileTabBar />}

      <HStack alignItems="center" justifyContent="space-between">
        {/* Show/Hide code toggle */}
        <Pressable
          noScaleOnPress
          accessibilityLabel={`${collapsed ? 'Show' : 'Hide'} code${
            headingText ? ` for ${headingText} example` : ''
          }`}
          onClick={onToggleCollapsed}
        >
          <HStack alignItems="center">
            <Icon name={collapsed ? 'caretDown' : 'caretUp'} paddingEnd={0.5} size="xs" />
            <Text color="fgPrimary" font="label1">
              {collapsed ? 'Show code' : 'Hide code'}
            </Text>
          </HStack>
        </Pressable>

        {/* Icon buttons */}
        <HStack alignItems="center" gap={0.5}>
          <IconButton
            compact
            transparent
            accessibilityLabel={`Copy code${headingText ? ` for ${headingText} example` : ''}`}
            name="copy"
            variant="foregroundMuted"
            onClick={handleCopyToClipboard}
          />
          <IconButton
            compact
            transparent
            accessibilityLabel={`Reset code${headingText ? ` for ${headingText} example` : ''}`}
            name="refresh"
            variant="foregroundMuted"
            onClick={handleReset}
          />
          <CodeSandboxExportButton headingText={headingText} isMultiFile={isMultiFile} />
        </HStack>
      </HStack>
    </VStack>
  );
});

/** Handles Cmd/Ctrl+S to format code with Prettier. */
const PrettierHandler = memo(function PrettierHandler() {
  const { sandpack } = useSandpack();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'KeyS' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        const activeFile = sandpack.activeFile;
        const code = sandpack.files[activeFile]?.code ?? '';
        format(code, prettierOptions).then((formatted) => {
          sandpack.updateFile(activeFile, formatted);
        });
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sandpack]);

  return null;
});

const PlaygroundEditorHeader = memo(function PlaygroundEditorHeader() {
  return (
    <Box borderedBottom paddingBottom={0.5} paddingTop={0.75} paddingX={1} width="100%">
      <Text alignItems="center" color="fgMuted" display="flex" font="label1" userSelect="none">
        <Icon active color="fgMuted" name="pencil" paddingEnd={0.5} size="xs" /> Live Code
      </Text>
    </Box>
  );
});

// --- Main Playground ---

type PlaygroundProps = {
  children?: string;
  code?: string;
  hideControls?: boolean;
  hidePreview?: boolean;
  editorStartsExpanded?: boolean;
  metastring?: string;
  /** Multi-file support: object of { filename: code } */
  files?: Record<string, string>;
  /** Multi-file support via remark plugin: JSON-serialized files object */
  filesJson?: string;
  /** For multi-file: which file tab is active by default */
  activeFile?: string;
  scope?: Record<string, unknown>;
  noInline?: boolean;
  [key: string]: any;
};

const Playground = memo(function Playground({
  children,
  code: codeProp,
  hideControls,
  hidePreview,
  editorStartsExpanded,
  metastring,
  files: filesProp,
  filesJson,
  activeFile: activeFileProp,
  scope,
  noInline: noInlineProp,
  ...props
}: PlaygroundProps): JSX.Element {
  // Resolve files: direct prop, JSON string from remark plugin, or single-file code
  const resolvedFiles: Record<string, string> | undefined = useMemo(() => {
    if (filesProp) return filesProp;
    if (filesJson) {
      try {
        return JSON.parse(filesJson) as Record<string, string>;
      } catch {
        return undefined;
      }
    }
    return undefined;
  }, [filesProp, filesJson]);

  const initialCode = useMemo(
    () => (codeProp ?? children ?? '').replace(/\n$/, ''),
    [codeProp, children],
  );
  const [collapsed, setIsCollapsed] = useState(!editorStartsExpanded);
  const toggleCollapsed = useCallback(() => setIsCollapsed((c) => !c), []);
  const { colorScheme, theme } = usePlaygroundTheme();
  const { editorRef, headingText } = useGetHeadingText();

  const noInline = noInlineProp || metastring?.includes('noInline');

  // Build Sandpack files object
  const sandpackFiles = useMemo(() => {
    if (resolvedFiles) {
      const result: Record<string, string> = {};
      for (const [name, code] of Object.entries(resolvedFiles)) {
        const key = name.startsWith('/') ? name : `/${name}`;
        result[key] = code;
      }
      return result;
    }
    return { '/App.tsx': initialCode };
  }, [resolvedFiles, initialCode]);

  const isMultiFile = resolvedFiles != null && Object.keys(resolvedFiles).length > 1;
  const activeFile = activeFileProp
    ? activeFileProp.startsWith('/')
      ? activeFileProp
      : `/${activeFileProp}`
    : isMultiFile
      ? '/Example.tsx'
      : '/App.tsx';

  return (
    <VStack ref={editorRef} paddingBottom={3} position="relative" zIndex={0}>
      <ThemeProvider activeColorScheme={colorScheme} theme={theme}>
        <SandpackProvider
          files={sandpackFiles}
          options={{
            activeFile,
            visibleFiles: isMultiFile ? Object.keys(sandpackFiles) : [activeFile],
          }}
          theme={colorScheme === 'dark' ? 'dark' : 'light'}
        >
          <PrettierHandler />

          {/* Bridge: reads Sandpack code, provides LiveProvider context */}
          <SandpackBridge isMultiFile={isMultiFile} noInline={noInline} scope={scope}>
            {/* Preview (inside LiveProvider via bridge) */}
            {!hidePreview && (
              <VStack
                background="bg"
                borderRadius={400}
                color="fg"
                font="body"
                maxWidth="100%"
                overflow="hidden"
                padding={3}
                position="relative"
                zIndex={0}
              >
                <BrowserOnly fallback={<div>Loading...</div>}>{previewContent}</BrowserOnly>
              </VStack>
            )}
          </SandpackBridge>

          {/* Editor (collapsible) */}
          <Collapsible collapsed={collapsed} paddingBottom={0.5} paddingTop={1}>
            <VStack background="bg" borderRadius={400} overflow="hidden" width="100%">
              <PlaygroundEditorHeader />
              <SandpackCodeEditor
                className={styles.sandpackEditor}
                showLineNumbers={false}
                showTabs={false}
                wrapContent={false}
              />
            </VStack>
          </Collapsible>

          {/* Controls */}
          {!hideControls && (
            <PlaygroundControls
              collapsed={collapsed}
              headingText={headingText}
              isMultiFile={isMultiFile}
              onToggleCollapsed={toggleCollapsed}
            />
          )}
        </SandpackProvider>
      </ThemeProvider>
    </VStack>
  );
});

export default Playground;
