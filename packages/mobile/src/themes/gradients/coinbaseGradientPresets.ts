import type { GradientPreset, LinearGradientConfig } from '@coinbase/cds-common/types/Gradient';

import type { ThemeConfig } from '../../core/theme';
import { coinbaseTheme } from '../coinbaseTheme';

export const coinbaseGradientThemeId = 'cds-coinbase-gradient';

const { lightColor, darkColor } = coinbaseTheme;

/**
 * Coinbase gradient presets for light mode.
 * Uses color tokens from the Coinbase theme.
 */
export const coinbaseLightGradient: Record<GradientPreset, LinearGradientConfig> = {
  primary: {
    direction: 'to-b',
    colors: [lightColor.bgPrimary, { color: lightColor.bgPrimary, opacity: 0.8 }],
  },
  positive: {
    direction: 'to-b',
    colors: [lightColor.bgPositive, { color: lightColor.bgPositive, opacity: 0.8 }],
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
 * Coinbase gradient presets for dark mode.
 * Uses color tokens from the Coinbase theme.
 */
export const coinbaseDarkGradient: Record<GradientPreset, LinearGradientConfig> = {
  primary: {
    direction: 'to-b',
    colors: [darkColor.bgPrimary, { color: darkColor.bgPrimary, opacity: 0.8 }],
  },
  positive: {
    direction: 'to-b',
    colors: [darkColor.bgPositive, { color: darkColor.bgPositive, opacity: 0.8 }],
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
 * Coinbase theme with gradient presets enabled.
 * A complete theme configuration ready to use with ThemeProvider.
 *
 * @example
 * ```tsx
 * import { coinbaseGradientTheme } from '@coinbase/cds-mobile/themes/gradients';
 *
 * <ThemeProvider theme={coinbaseGradientTheme} activeColorScheme="light">
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const coinbaseGradientTheme = {
  ...coinbaseTheme,
  id: coinbaseGradientThemeId,
  lightGradient: coinbaseLightGradient,
  darkGradient: coinbaseDarkGradient,
} as const satisfies ThemeConfig;
