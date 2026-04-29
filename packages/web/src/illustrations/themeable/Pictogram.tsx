import pictogramVersionMap from '@coinbase/cds-illustrations/__generated__/pictogram/data/versionMap';

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

export const Pictogram = createThemeableIllustration(
  'pictogram',
  pictogramVersionMap,
  () => import('@coinbase/cds-illustrations/__generated__/pictogram/data/themeableSvgImportMap'),
);

export type { PictogramName } from '@coinbase/cds-illustrations';
