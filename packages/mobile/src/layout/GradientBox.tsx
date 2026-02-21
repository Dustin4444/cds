import React, { forwardRef, memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Defs, LinearGradient as Lg, Rect, Stop, Svg } from 'react-native-svg';
import type { ThemeVars } from '@coinbase/cds-common/core/theme';

import { useTheme } from '../hooks/useTheme';

import { Box, type BoxProps } from './Box';

const DEFAULT_STOPS = [0, 1];
const DEFAULT_ANGLE = 180;

function getAlpha(color: string) {
  const match = color.includes('rgba') && color.match(/,\s?([\d.]*)\)$/);
  if (match) {
    return match[1];
  }
  return '1';
}

type Coordinate = { x: number; y: number };

export type LinearGradientProps = {
  /**
   * [Optional] Start position of the gradient. By default start is calculated
   * based on the angle prop.
   */
  start?: Coordinate;
  /**
   * [Optional] End position of the gradient. By default end is calculated
   * based on the angle prop.
   * */
  end?: Coordinate;
  /**
   * The relative positions of colors. If supplied, it must be of the same length as colors.
   * @default [0, 1]
   */
  stops?: number[];
  /**
   * Colors to be distributed between start and end.
   */
  colors: NonNullable<string>[];
  /**
   * Sets gradient angle.
   * @default 180
   */
  angle?: number;
};

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
  dangerouslySetGradient?: LinearGradientProps;
  /**
   * @default false
   * Linear gradient will overlay the children content when true
   */
  elevated?: boolean;
};

export type GradientBoxProps = GradientBoxBaseProps & BoxProps;

export const GradientBox = memo(
  forwardRef<View, GradientBoxProps>(
    (
      { elevated, children, gradient, dangerouslySetGradient, overflow = 'hidden', ...props },
      ref,
    ) => {
      const theme = useTheme();

      const gradientConfig: Partial<LinearGradientProps> =
        dangerouslySetGradient ?? (gradient ? theme.gradient?.[gradient] : undefined) ?? {};

      const { start, end, stops = DEFAULT_STOPS, colors, angle = DEFAULT_ANGLE } = gradientConfig;
      const svg = useMemo(() => {
        const anglePI = (-angle * Math.PI) / 180;
        const x1 = start?.x ?? Math.round(50 + Math.sin(anglePI) * 50) / 100;
        const y1 = start?.y ?? Math.round(50 + Math.cos(anglePI) * 50) / 100;
        const x2 = end?.x ?? Math.round(50 + Math.sin(anglePI + Math.PI) * 50) / 100;
        const y2 = end?.y ?? Math.round(50 + Math.cos(anglePI + Math.PI) * 50) / 100;

        return (
          <View key="GrandientSvgContainer" style={StyleSheet.absoluteFillObject}>
            <Svg height="100%" width="100%">
              <Defs>
                <Lg id="LinearGradient" x1={x1} x2={x2} y1={y1} y2={y2}>
                  {colors?.map((color, index) => (
                    <Stop
                      key={color + String(index)}
                      offset={stops[index]}
                      stopColor={color}
                      stopOpacity={getAlpha(color)}
                    />
                  ))}
                </Lg>
              </Defs>
              <Rect fill="url(#LinearGradient)" height="100%" width="100%" />
            </Svg>
          </View>
        );
      }, [colors, start, end, angle, stops]);

      const items = elevated ? [children, svg] : [svg, children];

      return (
        <Box ref={ref} overflow={overflow} {...props}>
          {items}
        </Box>
      );
    },
  ),
);

GradientBox.displayName = 'GradientBox';
