import { styleVarPrefixes, type ThemeCore } from './theme';

const periodsRegex = /\./g;

/** Takes a theme object and formats its keys as CSS variables to be used in inline styles. */
export const createThemeCssVars = (theme: Partial<ThemeCore>) => {
  const themeCss: Record<string, unknown> = {};

  const themeKeys = Object.keys(theme);

  for (const key of themeKeys) {
    const themeVars = theme[key as keyof ThemeCore];
    if (!themeVars || key === 'id') continue;

    // Handle activeColorScheme separately
    if (key === 'activeColorScheme') {
      themeCss['--activeColorScheme'] = theme.activeColorScheme;
      continue;
    }

    const prefix = styleVarPrefixes[key as keyof typeof styleVarPrefixes];
    const cssVarPrefix = prefix ? `--${prefix}-` : '--';
    const varNames = Object.keys(themeVars);

    // Process each var in the themeVars
    for (const varName of varNames) {
      const value = themeVars[varName as keyof typeof themeVars];
      if (value === undefined) continue;

      // Create CSS variable name, replacing periods with underscores
      const cssVarName = `${cssVarPrefix}${varName}`.replace(periodsRegex, '_');

      // Format value (add px to numbers)
      themeCss[cssVarName] = typeof value !== 'number' ? value : value + 'px';
    }
  }

  return themeCss;
};
