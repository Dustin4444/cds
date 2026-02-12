import type { Plugin } from '@docusaurus/types';

/**
 * Docusaurus plugin that watches example files for changes during development.
 * Uses the same `getPathsToWatch()` API as @coinbase/docusaurus-plugin-docgen.
 *
 * When any .ts/.tsx file in an examples/ directory changes, Docusaurus
 * re-compiles the parent MDX, and the remark plugin picks up the new contents.
 */
const playgroundExamplesWatcherPlugin = (): Plugin => ({
  name: 'playground-examples-watcher',
  getPathsToWatch() {
    return ['docs/**/examples/**/*.{ts,tsx}'];
  },
});

export default playgroundExamplesWatcherPlugin;
