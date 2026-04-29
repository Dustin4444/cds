import { illustrationThemeKeyToCssVarName } from '@coinbase/cds-common/utils/illustrationCssVarUtils';

import { styleVarPrefixes, type Theme } from './theme';

const periodsRegex = /\./g;

/** Takes a theme object and formats its keys as CSS variables to be used in inline styles. */
export const createThemeCssVars = (theme: Partial<Theme>) => {
  const themeCss: Record<string, unknown> = {};

  const themeKeys = Object.keys(theme);

  for (const key of themeKeys) {
    const themeVars = theme[key as keyof Theme];
    if (!themeVars || key === 'id') continue;

    // Handle activeColorScheme separately
    if (key === 'activeColorScheme') {
      themeCss['--activeColorScheme'] = theme.activeColorScheme;
      continue;
    }

    const prefix = styleVarPrefixes[key as keyof typeof styleVarPrefixes];
    const cssVarPrefix = prefix ? `--${prefix}-` : '--';
    const isIllustrationColor = key === 'illustrationColor';
    const varNames = Object.keys(themeVars);

    // Process each var in the themeVars
    for (const varName of varNames) {
      const value = themeVars[varName as keyof typeof themeVars];
      if (value === undefined) continue;

      // Illustration color keys need hyphenation to match generated SVG CSS vars
      const cssVarName = isIllustrationColor
        ? illustrationThemeKeyToCssVarName(varName)
        : `${cssVarPrefix}${varName}`.replace(periodsRegex, '_');

      // Format value (add px to numbers)
      themeCss[cssVarName] = typeof value !== 'number' ? value : value + 'px';
    }
  }

  return themeCss;
};
