import spotRectangleVersionMap from '@coinbase/cds-illustrations/__generated__/spotRectangle/data/versionMap';

import {
  createThemeableIllustration,
  type IllustrationA11yProps,
  type IllustrationDimensionsMap,
  type ThemeableIllustrationBaseProps,
} from './createThemeableIllustration';

export type SpotRectangleBaseProps = ThemeableIllustrationBaseProps<'spotRectangle'> &
  IllustrationA11yProps & {
    /**
     * @default 240x120
     * */
    dimension?: IllustrationDimensionsMap['spotRectangle'];
  };

export type SpotRectangleProps = SpotRectangleBaseProps;

export const SpotRectangle = createThemeableIllustration(
  'spotRectangle',
  spotRectangleVersionMap,
  () =>
    import('@coinbase/cds-illustrations/__generated__/spotRectangle/data/themeableSvgImportMap'),
);

export type { SpotRectangleName } from '@coinbase/cds-illustrations';
