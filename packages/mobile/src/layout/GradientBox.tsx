import React, { forwardRef, memo, useMemo } from 'react';
import type { View } from 'react-native';
import type { ThemeVars } from '@coinbase/cds-common/core/theme';

import { LinearGradientFill, type LinearGradientFillProps } from '../gradients/LinearGradientFill';
import { useTheme } from '../hooks/useTheme';

import { Box, type BoxProps } from './Box';

export { LinearGradientFill, type LinearGradientFillProps } from '../gradients/LinearGradientFill';
export { RadialGradientFill, type RadialGradientFillProps } from '../gradients/RadialGradientFill';

export type GradientBoxBaseProps = {
  /**
   * Theme gradient preset to apply as the background.
   * @example "brand" | "primary" | "positive" | "negative" | "premium"
   */
  gradient?: ThemeVars.Gradient;
  /**
   * @danger Escape hatch for applying a custom linear gradient configuration.
   * Use this for gradients not defined in the theme.
   * @example { colors: ['#0052FF', '#7B3FE4'], angle: 90 }
   */
  dangerouslySetGradient?: LinearGradientFillProps;
  /**
   * @default false
   * Gradient will overlay the children content when true.
   */
  elevated?: boolean;
  /**
   * Override the default linear gradient with a custom gradient component.
   * Use for radial, conic, or other gradient types.
   * @example <RadialGradientFill colors={['#0052FF', '#7B3FE4']} />
   */
  GradientComponent?: React.ReactNode;
};

export type GradientBoxProps = GradientBoxBaseProps & BoxProps;

export const GradientBox = memo(
  forwardRef<View, GradientBoxProps>(
    (
      {
        elevated,
        children,
        gradient,
        dangerouslySetGradient,
        overflow = 'hidden',
        GradientComponent,
        ...props
      },
      ref,
    ) => {
      const theme = useTheme();

      const gradientConfig = useMemo(
        () => dangerouslySetGradient ?? (gradient ? theme.gradient?.[gradient] : undefined),
        [dangerouslySetGradient, gradient, theme.gradient],
      );

      // TO DO: This is temporarily set to LinearGradientFillProps, and subject to change based on design decisions.
      const defaultGradient = useMemo(() => {
        if (!gradientConfig?.colors) return null;
        return <LinearGradientFill key="GradientFillContainer" {...gradientConfig} />;
      }, [gradientConfig]);

      const renderedGradient = GradientComponent ?? defaultGradient;

      const items = elevated ? [children, renderedGradient] : [renderedGradient, children];

      return (
        <Box ref={ref} overflow={overflow} {...props}>
          {items}
        </Box>
      );
    },
  ),
);

GradientBox.displayName = 'GradientBox';
