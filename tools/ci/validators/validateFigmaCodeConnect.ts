import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const PACKAGES = ['packages/web', 'packages/mobile'];

const EXCLUDED_DIRS = new Set([
  '__tests__',
  '__stories__',
  '__figma__',
  '__mocks__',
  'hooks',
  'types',
  'core',
  'system',
  'motion',
  'animation',
]);

/**
 * Matches PascalCase .tsx filenames that are likely React components.
 * Excludes index files, type-only files, and common internal patterns.
 */
const COMPONENT_FILE_REGEX = /^[A-Z][a-zA-Z0-9]*\.tsx$/;

const EXCLUDED_FILE_PATTERNS = [
  /Props\.tsx$/, // Type definition files
  /Context\.tsx$/, // React context files
  /Provider\.tsx$/, // Provider wrappers
  /Styles?\.tsx$/, // Style files
  /Constants?\.tsx$/, // Constants
  /Utils?\.tsx$/, // Utility files
  /Helpers?\.tsx$/, // Helper files
  /Types?\.tsx$/, // Type files
];

function getAddedFiles(): string[] {
  const base = process.env.NX_BASE || 'master';
  const head = process.env.NX_HEAD || 'HEAD';

  const output = execSync(`git diff --name-only --diff-filter=A ${base} ${head}`, {
    encoding: 'utf-8',
  });

  return output.trim().split('\n').filter(Boolean);
}

function isComponentFile(filePath: string): boolean {
  const fileName = path.basename(filePath);
  const dirParts = filePath.split('/');

  const isInPackage = PACKAGES.some((pkg) => filePath.startsWith(`${pkg}/src/`));
  if (!isInPackage) return false;

  if (!COMPONENT_FILE_REGEX.test(fileName)) return false;

  if (dirParts.some((part) => EXCLUDED_DIRS.has(part))) return false;

  if (EXCLUDED_FILE_PATTERNS.some((pattern) => pattern.test(fileName))) return false;

  return true;
}

function getExpectedFigmaPath(componentPath: string): string {
  const dir = path.dirname(componentPath);
  const fileName = path.basename(componentPath, '.tsx');
  return path.join(dir, '__figma__', `${fileName}.figma.tsx`);
}

function validateFigmaCodeConnect() {
  console.log('Validating new components have Figma Code Connect files');

  const addedFiles = getAddedFiles();
  const addedFileSet = new Set(addedFiles);
  const newComponents = addedFiles.filter(isComponentFile);

  if (newComponents.length === 0) {
    console.log('No new component files detected');
    return;
  }

  console.log(`Found ${newComponents.length} new component file(s) to check`);

  const missing: Array<{ component: string; expected: string }> = [];

  for (const componentPath of newComponents) {
    const expectedFigmaPath = getExpectedFigmaPath(componentPath);
    const figmaFileExists = existsSync(expectedFigmaPath) || addedFileSet.has(expectedFigmaPath);

    if (!figmaFileExists) {
      missing.push({ component: componentPath, expected: expectedFigmaPath });
      console.log(`Missing Code Connect: ${componentPath} → expected ${expectedFigmaPath}`);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `${missing.length} new component(s) are missing Figma Code Connect files. Please create a .figma.tsx file for each component in its __figma__/ directory.`,
    );
  }

  console.log(`All ${newComponents.length} new component(s) have Figma Code Connect files`);
}

validateFigmaCodeConnect();
