import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LiveError, LivePreview } from 'react-live';
import { SandpackCodeEditor, SandpackProvider, useSandpack } from '@codesandbox/sandpack-react';
import { useTabsContext } from '@coinbase/cds-common/tabs/TabsContext';
import type { TabValue } from '@coinbase/cds-common/tabs/useTabs';
import { IconButton, type IconButtonProps } from '@coinbase/cds-web/buttons/IconButton';
import { Dropdown } from '@coinbase/cds-web/dropdown/Dropdown';
import { MenuItem } from '@coinbase/cds-web/dropdown/MenuItem';
import { Icon } from '@coinbase/cds-web/icons/Icon';
import { HStack } from '@coinbase/cds-web/layout/HStack';
import { VStack } from '@coinbase/cds-web/layout/VStack';
import { Tooltip } from '@coinbase/cds-web/overlays';
import { useToast } from '@coinbase/cds-web/overlays/useToast';
import { Pressable } from '@coinbase/cds-web/system';
import { ThemeProvider } from '@coinbase/cds-web/system/ThemeProvider';
import { Tabs, TabsActiveIndicator, type TabsActiveIndicatorProps } from '@coinbase/cds-web/tabs';
import { Text } from '@coinbase/cds-web/typography/Text';
import BrowserOnly from '@docusaurus/BrowserOnly';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import { ErrorBoundaryErrorMessageFallback } from '@docusaurus/theme-common';
import { m as motion } from 'framer-motion';
import * as estreePlugin from 'prettier/plugins/estree.js';
import * as typescriptPlugin from 'prettier/plugins/typescript.js';
import { format } from 'prettier/standalone';

import { usePlaygroundTheme } from '../Layout/Provider/UnifiedThemeContext';

import { SandpackBridge } from './SandpackBridge';
import { sandpackGithubLight, sandpackNightOwl } from './sandpackTheme';
import styles from './styles.module.css';

// --- Utilities ---

const isHeader = (element: HTMLElement): boolean =>
  ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.tagName);

const useGetHeadingText = () => {
  const [headingText, setHeadingText] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current?.parentElement) return;
    let el = editorRef.current.parentElement;
    if (isHeader(el) && el.classList.contains('anchor')) {
      setHeadingText(el.textContent?.toLowerCase() || '');
      return;
    }
    while (el.previousElementSibling) {
      el = el.previousElementSibling as HTMLElement;
      if (isHeader(el) && el.classList.contains('anchor')) {
        setHeadingText(el.textContent?.toLowerCase() || '');
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

// --- Shared sub-components ---

type ToolbarIconButtonProps = IconButtonProps<'button'> & {
  tooltip?: string;
};

const ToolbarIconButton = memo(({ tooltip, ...props }: ToolbarIconButtonProps) => {
  if (tooltip) {
    return (
      <Tooltip content={tooltip}>
        <IconButton
          compact
          transparent
          height="auto"
          padding={1}
          variant="foregroundMuted"
          width="auto"
          {...props}
        />
      </Tooltip>
    );
  }
  return (
    <IconButton
      compact
      transparent
      height="auto"
      padding={1}
      variant="foregroundMuted"
      width="auto"
      {...props}
    />
  );
});

// --- File Tabs ---

const FileTabComponent = ({ id, label }: TabValue) => {
  const { activeTab, updateActiveTab } = useTabsContext();
  const isActive = activeTab?.id === id;
  return (
    <Pressable
      color={isActive ? 'fgPrimary' : 'fgMuted'}
      font="label2"
      onClick={() => updateActiveTab(id)}
      paddingY={1}
    >
      {label}
    </Pressable>
  );
};

const FileTabsIndicator = (props: TabsActiveIndicatorProps) => (
  <TabsActiveIndicator {...props} background="bgPrimary" bottom={0} height={2} />
);

const FileTabBar = memo(function FileTabBar() {
  const { sandpack } = useSandpack();

  const tabs: TabValue[] = useMemo(
    () =>
      Object.keys(sandpack.files)
        .filter((f) => sandpack.visibleFiles.includes(f))
        .map((filePath) => ({ id: filePath, label: filePath.replace(/^\//, '') })),
    [sandpack.files, sandpack.visibleFiles],
  );

  const activeTab: TabValue | null = useMemo(
    () => tabs.find((t) => t.id === sandpack.activeFile) ?? tabs[0] ?? null,
    [tabs, sandpack.activeFile],
  );

  const handleChange = useCallback(
    (tab: TabValue | null) => {
      if (tab) sandpack.setActiveFile(tab.id);
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
      gap={1}
      onChange={handleChange}
      tabs={tabs}
    />
  );
});

// --- MoreMenu ---

const MoreMenuContent = memo(function MoreMenuContent({
  onFormat,
  onResetCode,
}: {
  onFormat: () => void;
  onResetCode: () => void;
}) {
  return (
    <VStack gap={0} paddingY={0.5}>
      <MenuItem onClick={onFormat} paddingX={2} paddingY={1} value="format">
        <HStack alignItems="center" gap={1}>
          <Icon color="fgMuted" name="sparkle" size="s" />
          <Text font="body">Format code</Text>
        </HStack>
      </MenuItem>
      <MenuItem onClick={onResetCode} paddingX={2} paddingY={1} value="reset">
        <HStack alignItems="center" gap={1}>
          <Icon color="fgNegative" name="trashCan" size="s" />
          <Text color="fgNegative" font="body">
            Reset code
          </Text>
        </HStack>
      </MenuItem>
    </VStack>
  );
});

// --- PlaygroundHeader ---

type PlaygroundHeaderProps = {
  expanded: boolean;
  headingText: string;
  onToggle: () => void;
  onRerender: () => void;
  isMultiFile: boolean;
  hidePreview?: boolean;
  originalFiles?: Record<string, string>;
};

const PlaygroundHeader = memo(function PlaygroundHeader({
  expanded,
  headingText,
  onToggle,
  onRerender,
  isMultiFile,
  hidePreview,
  originalFiles,
}: PlaygroundHeaderProps) {
  const toast = useToast();
  const { sandpack } = useSandpack();

  const handleCopyToClipboard = useCallback(() => {
    const code = sandpack.files[sandpack.activeFile]?.code ?? '';
    navigator.clipboard
      .writeText(code)
      .then(() => toast.show('Copied to clipboard'))
      .catch(() => toast.show('Failed to copy to clipboard'));
  }, [sandpack, toast]);

  const handleResetCode = useCallback(() => {
    sandpack.resetAllFiles();
    toast.show('Code reset to original');
  }, [sandpack, toast]);

  const handleFormat = useCallback(() => {
    const activeFile = sandpack.activeFile;
    const code = sandpack.files[activeFile]?.code ?? '';
    format(code, prettierOptions).then((formatted) => {
      sandpack.updateFile(activeFile, formatted.trimEnd());
      toast.show('Code formatted');
    });
  }, [sandpack, toast]);

  const handleOpenInStackBlitz = useCallback(async () => {
    const { openInStackBlitz } = await import('./sandbox/openInStackBlitz');
    const filesToExport =
      originalFiles ??
      Object.fromEntries(Object.entries(sandpack.files).map(([k, v]) => [k, v.code]));
    openInStackBlitz(filesToExport, sandpack.visibleFiles, isMultiFile);
  }, [sandpack, isMultiFile, originalFiles]);

  const toggleLabel = expanded ? 'Hide code' : 'Show code';
  const toggleIcon = expanded ? 'caretUp' : 'caretDown';

  const moreMenuContent = useMemo(
    () => <MoreMenuContent onFormat={handleFormat} onResetCode={handleResetCode} />,
    [handleFormat, handleResetCode],
  );

  return (
    <VStack>
      <HStack
        alignItems="center"
        borderedBottom={expanded}
        borderedTop={!hidePreview}
        justifyContent="space-between"
        paddingX={3}
        paddingY={0.5}
      >
        <HStack alignItems="center" minWidth={0}>
          <Text alignItems="center" color="fgMuted" display="flex" font="label1" userSelect="none">
            <Icon active color="fgMuted" name="pencil" paddingEnd={0.75} size="xs" />
            {hidePreview ? 'Code' : 'Live Code'}
          </Text>
        </HStack>

        <HStack alignItems="center" gap={1} marginEnd={-1}>
          <Pressable
            noScaleOnPress
            accessibilityLabel={`${toggleLabel}${headingText ? ` for ${headingText} example` : ''}`}
            onClick={onToggle}
          >
            <HStack alignItems="center">
              <Icon color="fgMuted" name={toggleIcon} paddingEnd={0.75} size="xs" />
              <Text color="fgMuted" font="label1">
                {toggleLabel}
              </Text>
            </HStack>
          </Pressable>

          <HStack alignItems="center" gap={0.5}>
            <ToolbarIconButton name="copy" onClick={handleCopyToClipboard} tooltip="Copy code" />
            {!hidePreview && (
              <>
                <ToolbarIconButton name="refresh" onClick={onRerender} tooltip="Reset demo" />
                <ToolbarIconButton
                  name="externalLink"
                  onClick={handleOpenInStackBlitz}
                  tooltip="Open in StackBlitz"
                />
              </>
            )}
            <Dropdown
              content={moreMenuContent}
              contentPosition={{ placement: 'bottom-end' }}
              width="auto"
            >
              <ToolbarIconButton accessibilityLabel="More actions" name="more" tooltip="More" />
            </Dropdown>
          </HStack>
        </HStack>
      </HStack>

      {isMultiFile && expanded && (
        <HStack borderedBottom alignItems="center" paddingX={1.5}>
          <FileTabBar />
        </HStack>
      )}
    </VStack>
  );
});

// --- PrettierHandler ---

const PrettierHandler = memo(function PrettierHandler() {
  const { sandpack } = useSandpack();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'KeyS' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        const activeFile = sandpack.activeFile;
        const code = sandpack.files[activeFile]?.code ?? '';
        format(code, prettierOptions).then((formatted) => {
          sandpack.updateFile(activeFile, formatted.trimEnd());
        });
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sandpack]);

  return null;
});

const PreviewPane = memo(function PreviewPane({
  hidePreview,
  rerenderKey,
  isMultiFile,
  noInline,
  scope,
}: {
  hidePreview: boolean;
  rerenderKey: number;
  isMultiFile: boolean;
  noInline?: boolean;
  scope?: Record<string, unknown>;
}) {
  if (hidePreview) return null;

  return (
    <SandpackBridge key={rerenderKey} isMultiFile={isMultiFile} noInline={noInline} scope={scope}>
      <VStack padding={3}>
        <BrowserOnly fallback={<div>Loading...</div>}>{previewContent}</BrowserOnly>
      </VStack>
    </SandpackBridge>
  );
});

type PlaygroundEditorSectionProps = {
  editorStartsExpanded?: boolean;
  headingText: string;
  hideControls?: boolean;
  hidePreview: boolean;
  isMultiFile: boolean;
  onRerender: () => void;
  originalFiles?: Record<string, string>;
};

const PlaygroundEditorSection = memo((props: PlaygroundEditorSectionProps) => {
  const {
    editorStartsExpanded,
    headingText,
    hideControls,
    hidePreview,
    isMultiFile,
    onRerender,
    originalFiles,
  } = props;

  const [expanded, setExpanded] = useState(editorStartsExpanded ?? false);
  const handleToggle = useCallback(() => setExpanded((prev) => !prev), []);

  return (
    <>
      {!hideControls && (
        <PlaygroundHeader
          expanded={expanded}
          headingText={headingText}
          hidePreview={hidePreview}
          isMultiFile={isMultiFile}
          onRerender={onRerender}
          onToggle={handleToggle}
          originalFiles={originalFiles}
        />
      )}

      <motion.div
        animate={{ height: expanded ? 'auto' : 0 }}
        initial={false}
        style={{ overflow: 'hidden' }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        <SandpackCodeEditor showLineNumbers={false} showTabs={false} wrapContent={false} />
      </motion.div>
    </>
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
  files?: Record<string, string>;
  filesJson?: string;
  activeFile?: string;
  scope?: Record<string, unknown>;
  noInline?: boolean;
  [key: string]: any;
};

const Playground = memo(function Playground({
  children,
  code: codeProp,
  hideControls,
  hidePreview: hidePreviewProp,
  editorStartsExpanded,
  metastring,
  files: filesProp,
  filesJson,
  activeFile: activeFileProp,
  scope,
  noInline: noInlineProp,
  ...props
}: PlaygroundProps): JSX.Element {
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
  const { colorScheme, theme } = usePlaygroundTheme();
  const { editorRef, headingText } = useGetHeadingText();

  const [rerenderKey, setRerenderKey] = useState(0);
  const handleRerender = useCallback(() => setRerenderKey((k) => k + 1), []);

  const hidePreview = Boolean(hidePreviewProp || metastring?.includes('noPreview'));
  const noInline = Boolean(noInlineProp || metastring?.includes('noInline'));

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

  const originalFilesMap = useMemo(
    () => Object.fromEntries(Object.entries(sandpackFiles).map(([k, v]) => [k, v])),
    [sandpackFiles],
  );
  const sandpackOptions = useMemo(
    () => ({
      activeFile,
      visibleFiles: isMultiFile ? Object.keys(sandpackFiles) : [activeFile],
    }),
    [activeFile, isMultiFile, sandpackFiles],
  );

  return (
    <VStack ref={editorRef} paddingBottom={3} position="relative" zIndex={0}>
      <ThemeProvider activeColorScheme={colorScheme} theme={theme}>
        <SandpackProvider
          files={sandpackFiles}
          options={sandpackOptions}
          // theme={colorScheme === 'dark' ? sandpackNightOwl : sandpackGithubLight}
        >
          <PrettierHandler />

          <VStack
            background="bg"
            borderRadius={400}
            color="fg"
            font="body"
            maxWidth="100%"
            overflow="hidden"
          >
            {/* Preview (keyed for rerender/remount) */}
            <PreviewPane
              hidePreview={hidePreview}
              isMultiFile={isMultiFile}
              noInline={noInline}
              rerenderKey={rerenderKey}
              scope={scope}
            />

            <PlaygroundEditorSection
              editorStartsExpanded={editorStartsExpanded}
              headingText={headingText}
              hideControls={hideControls}
              hidePreview={hidePreview}
              isMultiFile={isMultiFile}
              onRerender={handleRerender}
              originalFiles={originalFilesMap}
            />
          </VStack>
        </SandpackProvider>
      </ThemeProvider>
    </VStack>
  );
});

export default Playground;
