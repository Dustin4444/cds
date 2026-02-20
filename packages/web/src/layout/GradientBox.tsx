import React, { forwardRef, memo, useMemo } from 'react';
import type { ThemeVars } from '@coinbase/cds-common/core/theme';

import type { Polymorphic } from '../core/polymorphism';
import { cx } from '../cx';
import { getStyles } from '../styles/styleProps';

import { Box, type BoxBaseProps } from './Box';

export const gradientBoxDefaultElement = 'div';

export type GradientBoxDefaultElement = typeof gradientBoxDefaultElement;

export type GradientBoxBaseProps = BoxBaseProps & {
  /**
   * Theme gradient preset to apply as the background.
   * @example "brand" | "primary" | "positive" | "negative" | "premium"
   */
  gradient?: ThemeVars.Gradient;
  /**
   * @danger Escape hatch for applying a raw CSS gradient string.
   * Use this for gradients not defined in the theme.
   * @example "linear-gradient(90deg, #0052FF, #7B3FE4)"
   */
  dangerouslySetGradient?: string;
};

export type GradientBoxProps<AsComponent extends React.ElementType> = Polymorphic.Props<
  AsComponent,
  GradientBoxBaseProps
>;

type GradientBoxComponent = (<AsComponent extends React.ElementType = GradientBoxDefaultElement>(
  props: GradientBoxProps<AsComponent>,
) => Polymorphic.ReactReturn) &
  Polymorphic.ReactNamed;

export const GradientBox: GradientBoxComponent = memo(
  forwardRef<React.ReactElement<GradientBoxBaseProps>, GradientBoxBaseProps>(
    <AsComponent extends React.ElementType>(
      {
        as,
        gradient,
        dangerouslySetGradient,
        className,
        style,
        ...props
      }: GradientBoxProps<AsComponent>,
      ref?: Polymorphic.Ref<AsComponent>,
    ) => {
      const Component = (as ?? gradientBoxDefaultElement) satisfies React.ElementType;

      const inlineStyle = useMemo(
        () => ({
          backgroundImage: dangerouslySetGradient,
          ...style,
        }),
        [dangerouslySetGradient, style],
      );

      const styles = useMemo(() => getStyles({ gradient }, inlineStyle), [gradient, inlineStyle]);

      return (
        <Box
          ref={ref}
          as={Component}
          className={cx(styles.className, className)}
          style={styles.style}
          {...props}
        />
      );
    },
  ),
);

GradientBox.displayName = 'GradientBox';
