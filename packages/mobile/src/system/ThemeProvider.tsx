import React, { createContext, useContext, useMemo } from 'react';
import type { ColorScheme } from '@coinbase/cds-common/core/theme';

import type { ComponentsConfig, Theme, ThemeConfig } from '../core/theme';

export type ThemeContextValue = Theme;

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// export type ThemeProviderProps = SystemProviderProps &
//   ThemeManagerProps &
//   FramerMotionProviderProps;

export type ThemeProviderProps = {
  theme: ThemeConfig;
  activeColorScheme: ColorScheme;
  children?: React.ReactNode;
  // Keep the components config seperately from the theme config for the following reasons:
  // 1. Not polluting the theme and keeping the theme purely for lower level design tokens.
  // 2. The theme configs are also used to create ThemeVars, which end up composing the style props.
  // 3. `theme` are currently not inherited from parent ThemeProvider, but `components` are.
  components?: ComponentsConfig;
};

export const ThemeProvider = ({
  theme,
  activeColorScheme,
  children,
  components,
}: ThemeProviderProps) => {
  const parentTheme = useContext(ThemeContext);
  const resolvedComponents = components ?? parentTheme?.components;

  const themeApi = useMemo(() => {
    const activeSpectrumKey = activeColorScheme === 'dark' ? 'darkSpectrum' : 'lightSpectrum';
    const activeColorKey = activeColorScheme === 'dark' ? 'darkColor' : 'lightColor';
    const inverseSpectrumKey = activeColorScheme === 'dark' ? 'lightSpectrum' : 'darkSpectrum';
    const inverseColorKey = activeColorScheme === 'dark' ? 'lightColor' : 'darkColor';

    if (!theme[activeColorKey])
      throw Error(
        `ThemeProvider activeColorScheme is ${activeColorScheme} but no ${activeColorScheme} colors are defined for the theme. See the docs at https://cds.coinbase.com/getting-started/theming/#creating-a-theme`,
      );

    if (!theme[activeSpectrumKey])
      throw Error(
        `ThemeProvider activeColorScheme is ${activeColorScheme} but no ${activeSpectrumKey} values are defined for the theme. See the docs at https://cds.coinbase.com/getting-started/theming/#creating-a-theme`,
      );

    if (theme[inverseSpectrumKey] && !theme[inverseColorKey])
      throw Error(
        `ThemeProvider theme has ${inverseSpectrumKey} values defined but no ${inverseColorKey} colors are defined for the theme. See the docs at https://cds.coinbase.com/getting-started/theming/#creating-a-theme`,
      );

    if (theme[inverseColorKey] && !theme[inverseSpectrumKey])
      throw Error(
        `ThemeProvider theme has ${inverseColorKey} colors defined but no ${inverseSpectrumKey} values are defined for the theme. See the docs at https://cds.coinbase.com/getting-started/theming/#creating-a-theme`,
      );

    return {
      ...theme,
      activeColorScheme: activeColorScheme,
      spectrum: theme[activeSpectrumKey],
      color: theme[activeColorKey],
    };
  }, [theme, activeColorScheme]);

  const themeContextValue = useMemo(
    () => ({
      ...themeApi,
      components: resolvedComponents,
    }),
    [themeApi, resolvedComponents],
  );

  return <ThemeContext.Provider value={themeContextValue}>{children}</ThemeContext.Provider>;
};

export type InvertedThemeProviderProps = {
  children?: React.ReactNode;
};

/** Falls back to the currently active colorScheme if the inverse colors are not defined in the theme.  */
export const InvertedThemeProvider = ({ children }: InvertedThemeProviderProps) => {
  const context = useContext(ThemeContext);
  if (!context) throw Error('InvertedThemeProvider must be used within a ThemeProvider');
  // TODO: this feels a bit counter-intuitive that we need to extract components and theme vars from the context for the new theme.
  const { components, ...theme } = context;
  const inverseColorScheme = context.activeColorScheme === 'dark' ? 'light' : 'dark';
  const inverseColorKey = context.activeColorScheme === 'dark' ? 'lightColor' : 'darkColor';
  const newColorScheme = context[inverseColorKey] ? inverseColorScheme : context.activeColorScheme;

  return (
    <ThemeProvider activeColorScheme={newColorScheme} components={components} theme={theme}>
      {children}
    </ThemeProvider>
  );
};
