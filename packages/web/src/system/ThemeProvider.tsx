/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { createContext, useContext, useMemo } from 'react';
import type { ColorScheme } from '@coinbase/cds-common/core/theme';

import { createThemeCssVars } from '../core/createThemeCssVars';
// import { mergeComponentsConfig } from '../core/mergeComponentsConfig';
import type { ComponentsConfig, Theme, ThemeConfig, ThemeCore, ThemeCSSVars } from '../core/theme';
import { cx } from '../cx';

import { FramerMotionProvider, type FramerMotionProviderProps } from './FramerMotionProvider';

/* Augments csstype's Properties by adding all our theme CSS variable names. Effectively adds all theme CSS variable names as valid keys to React.CSSProperties. */
declare module 'csstype' {
  // eslint-disable-next-line no-restricted-syntax
  interface Properties extends Partial<ThemeCSSVars> {}
}

export type ThemeContextValue = Theme;

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type ThemeManagerProps = {
  display?: React.CSSProperties['display'];
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  theme: ThemeCore;
};

export const useThemeProviderStyles = (theme: ThemeCore) => {
  const style = useMemo(() => createThemeCssVars(theme), [theme]);
  return style;
};

const ThemeManager = ({ display, className, style, children, theme }: ThemeManagerProps) => {
  const themeStyles = useThemeProviderStyles(theme);
  const styles = useMemo(
    () => ({ ...themeStyles, display, ...style }),
    [themeStyles, display, style],
  );
  return (
    <div className={cx(theme.id, theme.activeColorScheme, className)} style={styles}>
      {children}
    </div>
  );
};

export type ThemeProviderProps = Pick<ThemeManagerProps, 'display' | 'className' | 'style'> &
  Pick<FramerMotionProviderProps, 'motionFeatures'> & {
    theme: ThemeConfig;
    activeColorScheme: ColorScheme;
    children?: React.ReactNode;
    // Keep the components config seperately from the theme config for the following reasons:
    // 1. Not polluting the theme and keeping the theme purely for lower level design tokens.
    // 2. The theme configs are also used to create ThemeVars, which end up composing the style props.
    // 3. `theme` are currently not inherited from parent ThemeProvider, but `components` are.
    // 4. `components` is passed to theme context instead of a new context, because it makes sense to have components and theme in the same context.
    components?: ComponentsConfig;
  };

export const ThemeProvider = ({
  theme,
  activeColorScheme,
  children,
  className,
  display,
  style,
  motionFeatures,
  components,
}: ThemeProviderProps) => {
  const parentTheme = useContext(ThemeContext);
  // TODO: Review the merge strategy for components config. Currently it is a shallow merge as it's more predictable.
  const resolvedComponents = useMemo(
    () => ({ ...parentTheme?.components, ...components }),
    [parentTheme?.components, components],
  );
  // const resolvedComponents = mergeComponentsConfig(parentTheme?.components, components);

  const themeApi = useMemo(() => {
    const activeSpectrumKey = activeColorScheme === 'dark' ? 'darkSpectrum' : 'lightSpectrum';
    const activeColorKey = activeColorScheme === 'dark' ? 'darkColor' : 'lightColor';
    const inverseSpectrumKey = activeColorScheme === 'dark' ? 'lightSpectrum' : 'darkSpectrum';
    const inverseColorKey = activeColorScheme === 'dark' ? 'lightColor' : 'darkColor';

    // TODO: Link to color / theme docs in these error messages
    if (!theme[activeColorKey])
      throw Error(
        `ThemeProvider activeColorScheme is ${activeColorScheme} but no ${activeColorScheme} colors are defined for the theme`,
      );

    if (!theme[activeSpectrumKey])
      throw Error(
        `ThemeProvider activeColorScheme is ${activeColorScheme} but no ${activeSpectrumKey} values are defined for the theme`,
      );

    if (theme[inverseSpectrumKey] && !theme[inverseColorKey])
      throw Error(
        `ThemeProvider theme has ${inverseSpectrumKey} values defined but no ${inverseColorKey} colors are defined for the theme`,
      );

    if (theme[inverseColorKey] && !theme[inverseSpectrumKey])
      throw Error(
        `ThemeProvider theme has ${inverseColorKey} colors defined but no ${inverseSpectrumKey} values are defined for the theme`,
      );

    return {
      ...theme,
      activeColorScheme: activeColorScheme,
      spectrum: theme[activeSpectrumKey],
      color: theme[activeColorKey],
    };
  }, [theme, activeColorScheme]);

  // TODO: Review the structure of the theme context value. Keep components config in theme context for the following reasons:
  // Semantic Coherence: Components config IS part of the theming system. It defines how components look within a theme.
  // Simple Access: It's easier to access the components config from the theme context. e.g. const { components, color, space } = useTheme();
  // Industry Standard: Most of the component libs keep components config within the theme context. Mantine theme context structure (https://github.com/mantinedev/mantine/blob/master/packages/%40mantine/core/src/core/MantineProvider/theme.types.ts#L129).
  const themeContextValue = useMemo(
    () => ({
      ...themeApi,
      components: resolvedComponents,
    }),
    [themeApi, resolvedComponents],
  );

  return (
    <FramerMotionProvider motionFeatures={motionFeatures}>
      <ThemeContext.Provider value={themeContextValue}>
        <ThemeManager className={className} display={display} style={style} theme={themeApi}>
          {children}
        </ThemeManager>
      </ThemeContext.Provider>
    </FramerMotionProvider>
  );
};

export type InvertedThemeProviderProps = Pick<
  ThemeManagerProps,
  'display' | 'className' | 'style'
> & {
  children?: React.ReactNode;
};

/** Falls back to the currently active colorScheme if the inverse colors are not defined in the theme.  */
export const InvertedThemeProvider = ({
  children,
  display,
  className,
  style,
}: InvertedThemeProviderProps) => {
  const context = useContext(ThemeContext);
  if (!context) throw Error('InvertedThemeProvider must be used within a ThemeProvider');
  const { components, ...theme } = context;
  const inverseColorScheme = context.activeColorScheme === 'dark' ? 'light' : 'dark';
  const inverseColorKey = context.activeColorScheme === 'dark' ? 'lightColor' : 'darkColor';
  const newColorScheme = context[inverseColorKey] ? inverseColorScheme : context.activeColorScheme;

  return (
    <ThemeProvider
      activeColorScheme={newColorScheme}
      className={className}
      components={components}
      display={display}
      style={style}
      theme={theme}
    >
      {children}
    </ThemeProvider>
  );
};
