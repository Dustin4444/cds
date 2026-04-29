import heroSquareVersionMap from '@coinbase/cds-illustrations/__generated__/heroSquare/data/versionMap';

import {
  createThemeableIllustration,
  type IllustrationA11yProps,
  type IllustrationDimensionsMap,
  type ThemeableIllustrationBaseProps,
} from './createThemeableIllustration';

export type HeroSquareBaseProps = ThemeableIllustrationBaseProps<'heroSquare'> &
  IllustrationA11yProps & {
    /**
     * HeroSquare dimensions.
     * @default  240x240
     * */
    dimension?: IllustrationDimensionsMap['heroSquare'];
  };

export type HeroSquareProps = HeroSquareBaseProps;

export const HeroSquare = createThemeableIllustration(
  'heroSquare',
  heroSquareVersionMap,
  () => import('@coinbase/cds-illustrations/__generated__/heroSquare/data/themeableSvgImportMap'),
);

export type { HeroSquareName } from '@coinbase/cds-illustrations/__generated__/heroSquare/types/HeroSquareName';
