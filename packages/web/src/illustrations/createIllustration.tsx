import React, { memo, useEffect, useMemo, useState } from 'react';
import type { IllustrationVariant } from '@coinbase/cds-common/types/IllustrationNames';
import type {
  HeroSquareDimension,
  PictogramDimension,
  SpotIconDimension,
  SpotRectangleDimension,
  SpotSquareDimension,
} from '@coinbase/cds-common/types/IllustrationProps';
import type { SharedProps } from '@coinbase/cds-common/types/SharedProps';
import { convertDimensionToSize } from '@coinbase/cds-common/utils/convertDimensionToSize';
import { convertSizeWithMultiplier } from '@coinbase/cds-common/utils/convertSizeWithMultiplier';
import { convertThemedSvgToHex } from '@coinbase/cds-common/utils/convertThemedSvgToHex';
import { getDefaultSizeObjectForIllustration } from '@coinbase/cds-common/utils/getDefaultSizeObjectForIllustration';
import type {
  HeroSquareName,
  PictogramName,
  SpotIconName,
  SpotRectangleName,
  SpotSquareName,
} from '@coinbase/cds-illustrations';
import { isDevelopment } from '@coinbase/cds-utils';

import { useTheme } from '../hooks/useTheme';

export type IllustrationNamesMap = {
  heroSquare: HeroSquareName;
  spotRectangle: SpotRectangleName;
  pictogram: PictogramName;
  spotSquare: SpotSquareName;
  spotIcon: SpotIconName;
};

export type IllustrationDimensionsMap = {
  heroSquare: HeroSquareDimension;
  spotSquare: SpotSquareDimension;
  spotRectangle: SpotRectangleDimension;
  pictogram: PictogramDimension;
  spotIcon: SpotIconDimension;
};

export type IllustrationBaseProps<T extends keyof IllustrationNamesMap> = SharedProps & {
  /** Name of illustration as defined in Figma */
  name: IllustrationNamesMap[T];
  /**
   * HeroSquare Default:  240x240
   * SpotSquare Default: 96x96
   * Pictogram Default: 48x48
   * SpotRectangle Default: 240x120
   *
   */
  dimension?: IllustrationDimensionsMap[T];
  /** Multiply the width & height while maintaining aspect ratio */
  scaleMultiplier?: number;
  /**
   * Fallback element to render if unable to find an illustration with the matching name
   * @default null
   * */
  fallback?: null | React.ReactElement;
  /** Apply the theme to the illustration */
  applyTheme?: boolean;
};

type IllustrationConfigShape<Variant extends IllustrationVariant> = Record<
  IllustrationNamesMap[Variant],
  number
>;

export type IllustrationA11yProps = {
  /** Alt tag to apply to the img
   * @default "" will identify the image as decorative
   */
  alt?: string;
};

export type IllustrationBasePropsWithA11y<Type extends IllustrationVariant> =
  IllustrationBaseProps<Type> & IllustrationA11yProps;

export function createIllustration<Variant extends IllustrationVariant>(
  variant: Variant,
  config: IllustrationConfigShape<Variant>,
) {
  const defaultSize = getDefaultSizeObjectForIllustration(variant);

  type IllustrationProps = IllustrationBasePropsWithA11y<Variant>;

  const Illustration = memo(function Illustration({
    name,
    dimension,
    scaleMultiplier,
    testID,
    alt = '',
    fallback = null,
    applyTheme,
  }: IllustrationProps) {
    const theme = useTheme();
    const version = config[name];
    const [svgMarkup, setSvgMarkup] = useState<string | null>(null);

    useEffect(() => {
      let cancelled = false;

      // Dynamically import the SVG file from the local package and update the color tokens inline
      if (applyTheme) {
        import(
          `@coinbase/cds-illustrations/__generated__/${variant}/svg/themeable/${name}-${version}.svg`
        )
          .then((mod) => {
            if (!cancelled) {
              const svgContent = mod.default ?? mod;

              // If it's a URL (starts with http/data:), fetch it; otherwise it's inline SVG markup
              if (typeof svgContent === 'string' && svgContent.startsWith('<svg')) {
                setSvgMarkup(svgContent);
              } else {
                fetch(svgContent)
                  .then((res) => res.text())
                  .then((svg) => {
                    if (!cancelled) setSvgMarkup(svg);
                  });
              }
            }
          })
          .catch((err) => {
            if (isDevelopment()) {
              console.error(`Failed to load illustration ${name}:`, err);
            }
            if (!cancelled) setSvgMarkup(null);
          });
      }

      return () => {
        cancelled = true;
      };
    }, [name, version, theme.activeColorScheme, applyTheme]);

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

    const illustrationPalette = useMemo(
      () =>
        theme.activeColorScheme === 'dark'
          ? (theme.darkIllustration as Record<string, string>)
          : (theme.lightIllustration as Record<string, string>),
      [theme.activeColorScheme, theme.darkIllustration, theme.lightIllustration],
    );

    if (version === undefined || (applyTheme && svgMarkup === null)) {
      if (isDevelopment()) {
        console.error(`Unable to find illustration with name: ${name}`);
      }
      return fallback;
    }

    if (applyTheme && svgMarkup) {
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: convertThemedSvgToHex(svgMarkup, illustrationPalette),
          }}
          aria-label={alt || undefined}
          data-testid={testID}
          role={alt ? 'img' : 'presentation'}
          style={{ width, height, display: 'inline-block' }}
        />
      );
    } else {
      const src = `https://static-assets.coinbase.com/ui-infra/illustration/v1/${variant}/svg/${theme.activeColorScheme}/${name}-${version}.svg`;
      return <img alt={alt} data-testid={testID} height={height} src={src} width={width} />;
    }
  });

  Illustration.displayName = 'Illustration';
  return Illustration;
}
