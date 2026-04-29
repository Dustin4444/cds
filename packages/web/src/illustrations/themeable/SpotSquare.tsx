import spotSquareVersionMap from '@coinbase/cds-illustrations/__generated__/spotSquare/data/versionMap';

import {
  createThemeableIllustration,
  type IllustrationA11yProps,
  type IllustrationDimensionsMap,
  type ThemeableIllustrationBaseProps,
} from './createThemeableIllustration';

export type SpotSquareBaseProps = ThemeableIllustrationBaseProps<'spotSquare'> &
  IllustrationA11yProps & {
    /**
     * @default 96x96
     * */
    dimension?: IllustrationDimensionsMap['spotSquare'];
  };

export type SpotSquareProps = SpotSquareBaseProps;

export const SpotSquare = createThemeableIllustration(
  'spotSquare',
  spotSquareVersionMap,
  () => import('@coinbase/cds-illustrations/__generated__/spotSquare/data/themeableSvgImportMap'),
);

export type { SpotSquareName } from '@coinbase/cds-illustrations';
