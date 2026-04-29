import spotIconVersionMap from '@coinbase/cds-illustrations/__generated__/spotIcon/data/versionMap';

import {
  createThemeableIllustration,
  type IllustrationA11yProps,
  type IllustrationDimensionsMap,
  type ThemeableIllustrationBaseProps,
} from './createThemeableIllustration';

export type SpotIconBaseProps = ThemeableIllustrationBaseProps<'spotIcon'> &
  IllustrationA11yProps & {
    /**
     * @default 32x32
     * */
    dimension?: IllustrationDimensionsMap['spotIcon'];
  };

export type SpotIconProps = SpotIconBaseProps;

export const SpotIcon = createThemeableIllustration(
  'spotIcon',
  spotIconVersionMap,
  () => import('@coinbase/cds-illustrations/__generated__/spotIcon/data/themeableSvgImportMap'),
);

export type { SpotIconName } from '@coinbase/cds-illustrations';
