import React, { forwardRef, memo } from 'react';
import type { View } from 'react-native';
import type { ThemeVars } from '@coinbase/cds-common/core/theme';
import type { SharedProps } from '@coinbase/cds-common/types';

import { Box, type BoxProps } from '../layout/Box';
import type { PositionStyles } from '../styles/styleProps';

export type PageFooterBaseProps = SharedProps &
  PositionStyles & {
    /**
     * Required. Accepts a ReactNode. Intended for content on the right side of the footer, such as action buttons or icons. */
    action: React.ReactNode;
    /**
     * Set the background color of the box.
     */
    background?: ThemeVars.Color;
  };

export type PageFooterProps = PageFooterBaseProps & BoxProps;

export const PageFooter = memo(
  forwardRef(function PageFooter(
    {
      action,
      paddingX = 3,
      paddingY = 1.5,
      alignItems = 'center',
      accessibilityRole = 'toolbar',
      ...props
    }: PageFooterProps,
    ref: React.ForwardedRef<View>,
  ) {
    return (
      <Box
        ref={ref}
        accessibilityRole={accessibilityRole}
        alignItems={alignItems}
        paddingX={paddingX}
        paddingY={paddingY}
        {...props}
      >
        {action}
      </Box>
    );
  }),
);
