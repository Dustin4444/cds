import spotRectangleIllustrations from '@coinbase/cds-illustrations/__generated__/spotRectangle/data/svgJsMap';

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
  spotRectangleIllustrations,
);

export type { SpotRectangleName } from '@coinbase/cds-illustrations';
