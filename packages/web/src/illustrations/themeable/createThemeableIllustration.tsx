import React, { memo, useEffect, useMemo, useState } from 'react';
import type { IllustrationVariant } from '@coinbase/cds-common/types/IllustrationNames';
import type { SharedProps } from '@coinbase/cds-common/types/SharedProps';
import { convertDimensionToSize } from '@coinbase/cds-common/utils/convertDimensionToSize';
import { convertSizeWithMultiplier } from '@coinbase/cds-common/utils/convertSizeWithMultiplier';
import { getDefaultSizeObjectForIllustration } from '@coinbase/cds-common/utils/getDefaultSizeObjectForIllustration';
import { prefixSvgIds } from '@coinbase/cds-common/utils/prefixSvgIds';
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

type ThemeableImportMap = Record<string, () => Promise<{ content: string }>>;

type VersionMapShape<Variant extends IllustrationVariant> = Record<
  IllustrationNamesMap[Variant],
  number
>;

const inFlight = new Map<string, Promise<string>>();
const resolved = new Map<string, string>();

function loadSvgContent(
  cacheKey: string,
  importMapLoader: () => Promise<{ default: ThemeableImportMap }>,
  name: string,
): Promise<string> {
  const cachedContent = resolved.get(cacheKey);
  if (cachedContent) return Promise.resolve(cachedContent);

  const existing = inFlight.get(cacheKey);
  if (existing) return existing;

  const promise = importMapLoader()
    .then((mod) => {
      const importMap = mod.default;
      const loader = importMap[name];
      if (!loader) {
        throw new Error(`No themeable SVG found for illustration: ${name}`);
      }
      return loader();
    })
    .then((svgModule) => {
      const content = prefixSvgIds(svgModule.content, name);
      resolved.set(cacheKey, content);
      inFlight.delete(cacheKey);
      return content;
    })
    .catch((err) => {
      inFlight.delete(cacheKey);
      throw err;
    });

  inFlight.set(cacheKey, promise);
  return promise;
}

export function createThemeableIllustration<Variant extends IllustrationVariant>(
  variant: Variant,
  versionMap: VersionMapShape<Variant>,
  importMapLoader: () => Promise<{ default: ThemeableImportMap }>,
) {
  const defaultSize = getDefaultSizeObjectForIllustration(variant);

  type Props = ThemeableIllustrationBasePropsWithA11y<Variant>;

  const ThemeableIllustration = memo(function ThemeableIllustration({
    name,
    dimension,
    scaleMultiplier,
    testID,
    alt = '',
    fallback = null,
  }: Props) {
    const { activeColorScheme } = useTheme();
    const version = versionMap[name];

    const cacheKey = `${variant}/${name}`;
    const [svgContent, setSvgContent] = useState<string | null>(
      () => resolved.get(cacheKey) ?? null,
    );
    const [loadFailed, setLoadFailed] = useState(false);

    useEffect(() => {
      if (svgContent || loadFailed) return;

      let cancelled = false;

      loadSvgContent(cacheKey, importMapLoader, name as string)
        .then((content) => {
          if (!cancelled) setSvgContent(content);
        })
        .catch((err) => {
          if (!cancelled) {
            setLoadFailed(true);
            if (isDevelopment()) {
              console.error(`Failed to load themeable illustration "${String(name)}":`, err);
            }
          }
        });

      return () => {
        cancelled = true;
      };
    }, [cacheKey, svgContent, loadFailed, name]);

    const { width, height } = useMemo(() => {
      let size = defaultSize;
      if (dimension) {
        size = convertDimensionToSize(dimension);
      }
      if (scaleMultiplier) {
        size = convertSizeWithMultiplier(size, scaleMultiplier);
      }
      return size;
    }, [dimension, scaleMultiplier]);

    if (version === undefined) {
      if (isDevelopment()) {
        console.error(`Unable to find illustration with name: ${name}`);
      }
      return fallback;
    }

    if (svgContent) {
      return (
        <span
          dangerouslySetInnerHTML={{ __html: svgContent }}
          aria-hidden={!alt}
          aria-label={alt || undefined}
          data-testid={testID}
          role="img"
          style={{ display: 'inline-block', width, height, lineHeight: 0 }}
        />
      );
    }

    const cdnSrc = `https://static-assets.coinbase.com/ui-infra/illustration/v1/${variant}/svg/${activeColorScheme}/${name}-${version}.svg`;

    return <img alt={alt} data-testid={testID} height={height} src={cdnSrc} width={width} />;
  });

  ThemeableIllustration.displayName = 'ThemeableIllustration';
  return ThemeableIllustration;
}
