import type { GradientPreset, LinearGradientConfig } from '@coinbase/cds-common/types/Gradient';

import type { ThemeConfig } from '../../core/theme';
import { defaultTheme } from '../defaultTheme';

const { lightColor, darkColor } = defaultTheme;

/**
 * Default gradient presets for light mode.
 * Uses color tokens from the default theme.
 */
export const defaultLightGradient: Record<GradientPreset, LinearGradientConfig> = {
  primary: {
    direction: 'to-b',
    colors: [lightColor.bgPrimary, { color: lightColor.bgPrimary, opacity: 0.8 }],
  },
  positive: {
    direction: 'to-b',
    colors: [lightColor.bgPositive, lightColor.transparent],
  },
  negative: {
    direction: 'to-b',
    colors: [lightColor.bgNegative, { color: lightColor.bgNegative, opacity: 0.8 }],
  },
  brand: {
    direction: 'to-r',
    colors: [lightColor.accentBoldBlue, lightColor.accentBoldPurple],
  },
  premium: {
    direction: 135,
    colors: [
      { color: lightColor.accentBoldPurple, offset: 0 },
      { color: lightColor.accentBoldBlue, offset: 0.5 },
      { color: lightColor.accentBoldGreen, offset: 1 },
    ],
  },
};

/**
 * Default gradient presets for dark mode.
 * Uses color tokens from the default theme.
 */
export const defaultDarkGradient: Record<GradientPreset, LinearGradientConfig> = {
  primary: {
    direction: 'to-b',
    colors: [darkColor.bgPrimary, { color: darkColor.bgPrimary, opacity: 0.8 }],
  },
  positive: {
    direction: 'to-b',
    colors: [darkColor.bgPositive, darkColor.transparent],
  },
  negative: {
    direction: 'to-b',
    colors: [darkColor.bgNegative, { color: darkColor.bgNegative, opacity: 0.8 }],
  },
  brand: {
    direction: 'to-r',
    colors: [darkColor.accentBoldBlue, darkColor.accentBoldPurple],
  },
  premium: {
    direction: 135,
    colors: [
      { color: darkColor.accentBoldPurple, offset: 0 },
      { color: darkColor.accentBoldBlue, offset: 0.5 },
      { color: darkColor.accentBoldGreen, offset: 1 },
    ],
  },
};

/**
 * Default theme with gradient presets enabled.
 * A complete theme configuration ready to use with ThemeProvider.
 *
 * @example
 * ```tsx
 * import { defaultGradientTheme } from '@coinbase/cds-web/themes/gradients';
 *
 * <ThemeProvider theme={defaultGradientTheme} activeColorScheme="light">
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const defaultGradientTheme: ThemeConfig = {
  ...defaultTheme,
  lightGradient: defaultLightGradient,
  darkGradient: defaultDarkGradient,
};
