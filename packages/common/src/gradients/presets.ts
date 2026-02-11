import type { GradientPreset, LinearGradientConfig } from '../types/Gradient';

/**
 * Resolve a gradient preset or config to a LinearGradientConfig.
 *
 * @param gradient - A gradient preset name or a LinearGradientConfig object.
 * @param themePresets - Gradient presets from theme configuration.
 * @throws Error if a preset name is used but not defined in the theme.
 */
export function resolveGradientPreset(
  gradient: GradientPreset | LinearGradientConfig,
  themePresets?: Partial<Record<GradientPreset, LinearGradientConfig>>,
): LinearGradientConfig {
  if (typeof gradient === 'string') {
    const preset = themePresets?.[gradient];
    if (!preset) {
      throw new Error(
        `Gradient preset "${gradient}" is not defined in the theme. ` +
          `Define it in your theme's lightGradient/darkGradient configuration, ` +
          `or use a gradient theme like defaultGradientTheme or coinbaseGradientTheme.`,
      );
    }
    return preset;
  }
  return gradient;
}
