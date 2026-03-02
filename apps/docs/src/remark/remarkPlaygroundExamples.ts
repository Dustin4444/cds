/**
 * Remark plugin that resolves `<Playground example="./path/to/dir" />` elements
 * in MDX files by reading all .ts/.tsx files from the referenced directory and
 * injecting them as a `filesJson` string prop at MDX compile time.
 *
 * The Playground component parses this JSON string back into an object at runtime.
 */
import type { Root } from 'mdast';
import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

const SUPPORTED_EXTENSIONS = ['.ts', '.tsx'];

const readExampleFiles = (dirPath: string): Record<string, string> => {
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    throw new Error(`Playground example directory not found: ${dirPath}`);
  }

  const files: Record<string, string> = {};
  const entries = fs.readdirSync(dirPath);

  for (const entry of entries) {
    const ext = path.extname(entry);
    if (!SUPPORTED_EXTENSIONS.includes(ext)) continue;

    const filePath = path.join(dirPath, entry);
    if (!fs.statSync(filePath).isFile()) continue;

    files[entry] = fs.readFileSync(filePath, 'utf-8');
  }

  return files;
};

const remarkPlaygroundExamples: Plugin<[], Root> = () => {
  return (tree, file) => {
    const mdxFilePath = file.path;
    if (!mdxFilePath) return;

    const mdxDir = path.dirname(mdxFilePath);

    visit(tree, 'mdxJsxFlowElement', (node: any) => {
      if (node.name !== 'Playground') return;

      const exampleAttr = node.attributes?.find(
        (a: any) => a.type === 'mdxJsxAttribute' && a.name === 'example',
      );
      if (!exampleAttr || typeof exampleAttr.value !== 'string') return;

      const examplePath = exampleAttr.value;
      const resolvedDir = path.resolve(mdxDir, examplePath);
      const files = readExampleFiles(resolvedDir);

      if (Object.keys(files).length === 0) {
        throw new Error(`No .ts/.tsx files found in playground example directory: ${resolvedDir}`);
      }

      const activeFile =
        Object.keys(files).find((f) => f.includes('Example')) ?? Object.keys(files)[0];

      node.attributes = node.attributes.filter(
        (a: any) => !(a.type === 'mdxJsxAttribute' && a.name === 'example'),
      );

      node.attributes.push({
        type: 'mdxJsxAttribute',
        name: 'filesJson',
        value: JSON.stringify(files),
      });

      node.attributes.push({
        type: 'mdxJsxAttribute',
        name: 'activeFile',
        value: activeFile,
      });
    });
  };
};

export default remarkPlaygroundExamples;
