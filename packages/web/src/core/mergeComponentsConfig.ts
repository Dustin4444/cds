// TODO: Review the merge strategy for components config. This helper function may not be needed.
import { mergeComponentProps } from './mergeComponentProps';
import type { ComponentsConfig } from './theme';

/**
 * Merges two component configurations, handling nested ThemeProvider component configs.
 * Used to merge parent and child ThemeProvider component configs.
 *
 * @param target - Base components config (e.g., from parent ThemeProvider)
 * @param source - Overriding components config (e.g., from child ThemeProvider)
 * @returns Merged components config with special fields combined
 *
 * @example
 * ```tsx
 * const merged = mergeComponentsConfig(
 *   { Button: { className: 'base', size: 'md' } },
 *   { Button: { className: 'themed', variant: 'primary' } }
 * );
 * // Result: { Button: { className: 'base themed', size: 'md', variant: 'primary' } }
 * ```
 */
export function mergeComponentsConfig<T extends ComponentsConfig>(
  target: T | undefined,
  source: T | undefined,
): T | undefined {
  if (!target) return source;
  if (!source) return target;

  const result: Partial<T> = {};
  const mergeClassNameAndStyle = source?.mergeClassNameAndStyle ?? false;
  const allKeys = new Set([...Object.keys(target), ...Object.keys(source)]);

  allKeys.forEach((componentKey) => {
    const targetConfig = target[componentKey as keyof T];
    const sourceConfig = source[componentKey as keyof T];

    if (!targetConfig) {
      result[componentKey as keyof T] = sourceConfig;
    } else if (!sourceConfig) {
      result[componentKey as keyof T] = targetConfig;
    } else {
      // Merge component configs
      result[componentKey as keyof T] = mergeComponentProps(
        targetConfig,
        sourceConfig,
        mergeClassNameAndStyle,
      );
    }
  });

  return result as T;
}
