export const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CDS Example</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body style="font-family: 'Inter', sans-serif">
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>`;

export const PACKAGE_JSON = JSON.stringify(
  {
    name: 'cds-example',
    private: true,
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
    },
    dependencies: {
      react: '^18.0.0',
      'react-dom': '^18.0.0',
      '@coinbase/cds-web': 'latest',
      '@coinbase/cds-common': 'latest',
      '@coinbase/cds-icons': 'latest',
      '@coinbase/cds-illustrations': 'latest',
      '@coinbase/cds-web-visualization': 'beta',
      'framer-motion': '^10.18.0',
    },
    devDependencies: {
      typescript: '^5.0.0',
      vite: '^5.0.0',
      '@vitejs/plugin-react': '^4.0.0',
      '@types/react': '^18.0.0',
      '@types/react-dom': '^18.0.0',
    },
  },
  null,
  2,
);

export const VITE_CONFIG = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`;

export const TSCONFIG = JSON.stringify(
  {
    compilerOptions: {
      target: 'ES2020',
      useDefineForClassFields: true,
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      skipLibCheck: true,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: 'react-jsx',
      strict: true,
      noUnusedLocals: false,
      noUnusedParameters: false,
    },
    include: ['src'],
  },
  null,
  2,
);
