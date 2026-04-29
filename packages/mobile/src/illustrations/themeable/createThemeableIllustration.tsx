import React, { memo, useMemo } from 'react';
import { SvgXml } from 'react-native-svg';
import type { IllustrationVariant } from '@coinbase/cds-common/types/IllustrationNames';
import type { SharedProps } from '@coinbase/cds-common/types/SharedProps';
import { convertDimensionToSize } from '@coinbase/cds-common/utils/convertDimensionToSize';
import { convertSizeWithMultiplier } from '@coinbase/cds-common/utils/convertSizeWithMultiplier';
import { getDefaultSizeObjectForIllustration } from '@coinbase/cds-common/utils/getDefaultSizeObjectForIllustration';
import { illustrationCssVarToThemeKey } from '@coinbase/cds-common/utils/illustrationCssVarUtils';
import { isDevelopment } from '@coinbase/cds-utils';

import { useTheme } from '../../hooks/useTheme';
import type {
  IllustrationA11yProps,
  IllustrationDimensionsMap,
  IllustrationNamesMap,
} from '../createIllustration';

export type ThemeableIllustrationBaseProps<T extends keyof IllustrationNamesMap> = SharedProps & {
  /** Name of illustration as defined in Figma */
  name: IllustrationNamesMap[T];
  /**
   * HeroSquare Default:  240x240
   * SpotSquare Default: 96x96
   * Pictogram Default: 48x48
   * SpotRectangle Default: 240x120
   */
  dimension?: IllustrationDimensionsMap[T];
  /** Multiply the width & height while maintaining aspect ratio */
  scaleMultiplier?: number;
  /**
   * Fallback element to render if unable to find an illustration with the matching name
   * @default null
   */
  fallback?: null | React.ReactElement;
};

export type ThemeableIllustrationBasePropsWithA11y<Type extends IllustrationVariant> =
  ThemeableIllustrationBaseProps<Type> & IllustrationA11yProps;

export type { IllustrationA11yProps, IllustrationDimensionsMap, IllustrationNamesMap };

export type ThemeableIllustrationConfigShape = Record<
  string,
  { light: () => string; dark: () => string; themeable?: () => string }
>;

const CSS_VAR_REGEX = /var\(--illustration-[a-z0-9-]+\)/g;

const substitutionCache = new WeakMap<object, Map<string, string>>();

function substituteVars(
  xml: string,
  illustrationColor: Record<string, string>,
  cacheKey: string,
): string {
  let themeCache = substitutionCache.get(illustrationColor);
  if (!themeCache) {
    themeCache = new Map();
    substitutionCache.set(illustrationColor, themeCache);
  }

  const cached = themeCache.get(cacheKey);
  if (cached) return cached;

  const result = xml.replace(CSS_VAR_REGEX, (match) => {
    const themeKey = illustrationCssVarToThemeKey(match);
    const resolved = illustrationColor[themeKey];
    if (resolved) return resolved;

    if (isDevelopment()) {
      console.warn(`Unresolvable illustration CSS variable "${match}" (theme key: "${themeKey}")`);
    }
    return match;
  });

  themeCache.set(cacheKey, result);
  return result;
}

export function createThemeableIllustration<
  Variant extends IllustrationVariant,
  Config extends ThemeableIllustrationConfigShape,
>(variant: Variant, config: Config) {
  const defaultSize = getDefaultSizeObjectForIllustration(variant);

  type Props = ThemeableIllustrationBasePropsWithA11y<Variant>;

  const ThemeableIllustration = memo(function ThemeableIllustration({
    fallback = null,
    name,
    dimension,
    scaleMultiplier,
    testID,
    accessibilityHint,
    accessibilityLabel,
  }: Props) {
    const theme = useTheme();
    const { activeColorScheme, illustrationColor } = theme;
    const entry = config[name];

    const xml = useMemo(() => {
      if (!entry) return null;

      if (illustrationColor && entry.themeable) {
        const rawXml = entry.themeable();
        return substituteVars(rawXml, illustrationColor, `${variant}/${name}`);
      }

      return entry[activeColorScheme]();
    }, [entry, illustrationColor, activeColorScheme, name]);

    const style = useMemo(() => {
      let size = defaultSize;
      if (dimension) {
        size = convertDimensionToSize(dimension);
      }
      if (scaleMultiplier) {
        size = convertSizeWithMultiplier(size, scaleMultiplier);
      }
      return size;
    }, [dimension, scaleMultiplier]);

    if (!xml) {
      if (isDevelopment()) {
        console.error(`Unable to find illustration with name: ${name}`);
      }
      return fallback;
    }

    return (
      <SvgXml
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="image"
        accessible={!!accessibilityLabel}
        style={style}
        testID={testID}
        xml={xml}
      />
    );
  });

  ThemeableIllustration.displayName = 'ThemeableIllustration';
  return ThemeableIllustration;
}
