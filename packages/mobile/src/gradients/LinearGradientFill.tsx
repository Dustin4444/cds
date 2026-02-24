import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Defs, LinearGradient as Lg, Rect, Stop, Svg } from 'react-native-svg';

import { getAlpha } from '../utils/getAlpha';

const DEFAULT_STOPS = [0, 1];
const DEFAULT_ANGLE = 180;

type Coordinate = { x: number; y: number };

export type LinearGradientFillProps = {
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

export const LinearGradientFill = memo(
  ({
    colors,
    stops = DEFAULT_STOPS,
    start,
    end,
    angle = DEFAULT_ANGLE,
  }: LinearGradientFillProps) => {
    const anglePI = (-angle * Math.PI) / 180;
    const x1 = start?.x ?? Math.round(50 + Math.sin(anglePI) * 50) / 100;
    const y1 = start?.y ?? Math.round(50 + Math.cos(anglePI) * 50) / 100;
    const x2 = end?.x ?? Math.round(50 + Math.sin(anglePI + Math.PI) * 50) / 100;
    const y2 = end?.y ?? Math.round(50 + Math.cos(anglePI + Math.PI) * 50) / 100;

    return (
      <View style={StyleSheet.absoluteFillObject}>
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
  },
);

LinearGradientFill.displayName = 'LinearGradientFill';
