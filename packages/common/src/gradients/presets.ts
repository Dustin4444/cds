import type { GradientPreset, LinearGradientConfig } from '../types/Gradient';

/**
 * Default gradient presets.
 * These can be extended or overridden by theme configuration.
 */
export const defaultGradientPresets: Record<GradientPreset, LinearGradientConfig> = {
  primary: {
    direction: 'to-b',
    colors: ['bgPrimary', { color: 'bgPrimary', opacity: 0.8 }],
  },
  positive: {
    direction: 'to-b',
    colors: ['bgPositive', { color: 'bgPositive', opacity: 0.8 }],
  },
  negative: {
    direction: 'to-b',
    colors: ['bgNegative', { color: 'bgNegative', opacity: 0.8 }],
  },
  brand: {
    direction: 'to-r',
    colors: ['accentBoldBlue', 'accentBoldPurple'],
  },
  premium: {
    direction: 135,
    colors: [
      { color: 'accentBoldPurple', offset: 0 },
      { color: 'accentBoldBlue', offset: 0.5 },
      { color: 'accentBoldGreen', offset: 1 },
    ],
  },
};

/**
 * Resolve a gradient preset or config to a LinearGradientConfig.
 *
 * @param gradient - A gradient preset name or a LinearGradientConfig object.
 * @param themePresets - Optional custom gradient presets from theme. Falls back to default presets if not provided.
 */
export function resolveGradientPreset(
  gradient: GradientPreset | LinearGradientConfig,
  themePresets?: Partial<Record<GradientPreset, LinearGradientConfig>>,
): LinearGradientConfig {
  if (typeof gradient === 'string') {
    // Use theme presets if available, otherwise fall back to defaults
    const presets = themePresets
      ? { ...defaultGradientPresets, ...themePresets }
      : defaultGradientPresets;
    return presets[gradient];
  }
  return gradient;
}
