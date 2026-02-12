import type { ComponentsConfig } from '@coinbase/cds-web/core/theme';

export const advancedComponents: ComponentsConfig = {
  // Buttons
  Button: {
    borderRadius: 200,
    // paddingY: 0, Padding y is not 0
  },
  IconButton: {
    borderRadius: 200,
  },

  // Controls
  TextInput: {
    inputBackground: 'bgAlternate',
    bordered: false,
  },
  Switch: {
    background: 'bgTertiary',
  },

  // Overlays
  Tooltip: {
    invertColorScheme: false,
  },
  TooltipContent: {
    background: 'bgSecondary',
  },
};
