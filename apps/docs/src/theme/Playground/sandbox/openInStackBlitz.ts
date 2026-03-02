import sdk from '@stackblitz/sdk';

import { ensureDefaultExport } from './ensureDefaultExport';
import { generateImports } from './generateImports';
import { INDEX_HTML, PACKAGE_JSON, TSCONFIG, VITE_CONFIG } from './templateFiles';

const MULTI_FILE_INDEX_TSX = `import '@coinbase/cds-icons/fonts/web/icon-font.css';
import '@coinbase/cds-web/defaultFontStyles';
import '@coinbase/cds-web/globalStyles';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { VStack } from '@coinbase/cds-web/layout/VStack';
import { ThemeProvider, MediaQueryProvider } from '@coinbase/cds-web/system';
import { defaultTheme } from '@coinbase/cds-web/themes/defaultTheme';
import Example from './Example';

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <MediaQueryProvider>
      <ThemeProvider theme={defaultTheme} activeColorScheme="light">
        <VStack padding={3}>
          <Example />
        </VStack>
      </ThemeProvider>
    </MediaQueryProvider>
  </React.StrictMode>,
);
`;

const SINGLE_FILE_INDEX_TSX = `import '@coinbase/cds-icons/fonts/web/icon-font.css';
import '@coinbase/cds-web/defaultFontStyles';
import '@coinbase/cds-web/globalStyles';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { VStack } from '@coinbase/cds-web/layout/VStack';
import { ThemeProvider, MediaQueryProvider } from '@coinbase/cds-web/system';
import { defaultTheme } from '@coinbase/cds-web/themes/defaultTheme';
import App from './App';

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <MediaQueryProvider>
      <ThemeProvider theme={defaultTheme} activeColorScheme="light">
        <VStack padding={3}>
          <App />
        </VStack>
      </ThemeProvider>
    </MediaQueryProvider>
  </React.StrictMode>,
);
`;

/**
 * Opens the current playground state in a StackBlitz project.
 *
 * @param sandpackFiles - Map of file paths (e.g. "/App.tsx") to code strings
 * @param visibleFiles - Array of visible file paths
 * @param isMultiFile - Whether this is a multi-file example
 */
export function openInStackBlitz(
  sandpackFiles: Record<string, string>,
  visibleFiles: string[],
  isMultiFile: boolean,
): void {
  const files: Record<string, string> = {
    'index.html': INDEX_HTML,
    'package.json': PACKAGE_JSON,
    'vite.config.ts': VITE_CONFIG,
    'tsconfig.json': TSCONFIG,
  };

  if (isMultiFile) {
    for (const filePath of visibleFiles) {
      const code = sandpackFiles[filePath] ?? '';
      const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
      files[`src/${cleanPath}`] = code;
    }
    files['src/index.tsx'] = MULTI_FILE_INDEX_TSX;
  } else {
    const activeFile =
      Object.keys(sandpackFiles).find((f) => f.includes('App')) ?? Object.keys(sandpackFiles)[0];
    const rawCode = sandpackFiles[activeFile] ?? '';
    const hasExistingImports = /^\s*import\s/m.test(rawCode);
    const imports = hasExistingImports ? '' : generateImports(rawCode);
    const wrappedCode = ensureDefaultExport(rawCode);
    files['src/App.tsx'] = `${imports ? imports + '\n\n' : ''}${wrappedCode}`;
    files['src/index.tsx'] = SINGLE_FILE_INDEX_TSX;
  }

  sdk.openProject(
    {
      title: 'CDS Example',
      template: 'node',
      files,
    },
    { openFile: isMultiFile ? 'src/Example.tsx' : 'src/App.tsx' },
  );
}
