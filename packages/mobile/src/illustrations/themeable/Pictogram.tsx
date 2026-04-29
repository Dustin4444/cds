import pictogramIllustrations from '@coinbase/cds-illustrations/__generated__/pictogram/data/svgJsMap';

import {
  createThemeableIllustration,
  type IllustrationA11yProps,
  type IllustrationDimensionsMap,
  type ThemeableIllustrationBaseProps,
} from './createThemeableIllustration';

export type PictogramBaseProps = ThemeableIllustrationBaseProps<'pictogram'> &
  IllustrationA11yProps & {
    /**
     * @default 48x48
     * */
    dimension?: IllustrationDimensionsMap['pictogram'];
  };

export type PictogramProps = PictogramBaseProps;

export const Pictogram = createThemeableIllustration('pictogram', pictogramIllustrations);

export type { PictogramName } from '@coinbase/cds-illustrations';
