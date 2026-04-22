import { memo, useMemo } from 'react';
import { cx } from '@coinbase/cds-web';
import {
  Box,
  HStack,
  type HStackDefaultElement,
  type HStackProps,
} from '@coinbase/cds-web/layout';
import { Text } from '@coinbase/cds-web/typography';
import { css } from '@linaria/core';

import { DefaultLegendShape } from '../legend/DefaultLegendShape';
import type { LegendShapeComponent } from '../legend/Legend';
import type { LegendShape } from '../utils';

export type ChartTooltipEntryProps = {
  /**
   * Id of the series.
   */
  seriesId: string;
  /**
   * Label of the series.
   */
  label: React.ReactNode;
  /**
   * Color of the series.
   * @default 'var(--color-fgPrimary)'
   */
  color?: string;
  /**
   * Shape of the series.
   */
  shape?: LegendShape;
  /**
   * Series value at the active data index.
   */
  value?: number | [number, number] | null;
  /**
   * Formatter function for the series value.
   */
  valueFormatter?: (value: number | [number, number] | null) => React.ReactNode;
  /**
   * Custom component to render the legend shape.
   * @default DefaultLegendShape
   */
  ShapeComponent?: LegendShapeComponent;
  /**
   * Custom class name for the root element.
   */
  className?: string;
  /**
   * Custom class names for the component parts.
   */
  classNames?: {
    /**
     * Custom class name for the root element.
     */
    root?: string;
    /**
     * Custom class name for the legend item element.
     */
    legendItem?: string;
    /**
     * Custom class name for the value element.
     */
    value?: string;
    /**
     * Custom class name for the shape wrapper element.
     */
    shapeWrapper?: string;
    /**
     * Custom class name for the shape element.
     */
    shape?: string;
    /**
     * Custom class name for the label element.
     * @note not applied when label is a ReactNode.
     */
    label?: string;
  };
  /**
   * Custom styles for the root element.
   */
  style?: React.CSSProperties;
  /**
   * Custom styles for the component parts.
   */
  styles?: {
    /**
     * Custom styles for the root element.
     */
    root?: React.CSSProperties;
    /**
     * Custom styles for the legend item element.
     */
    legendItem?: React.CSSProperties;
    /**
     * Custom styles for the value element.
     */
    value?: React.CSSProperties;
    /**
     * Custom styles for the shape wrapper element.
     */
    shapeWrapper?: React.CSSProperties;
    /**
     * Custom styles for the shape element.
     */
    shape?: React.CSSProperties;
    /**
     * Custom styles for the label element.
     * @note not applied when label is a ReactNode.
     */
    label?: React.CSSProperties;
  };
};

export type ChartTooltipEntryComponent = React.FC<ChartTooltipEntryProps>;

const chartTooltipEntryCss = css`
  align-items: center;
  justify-content: space-between;
`;

const legendItemCss = css`
  align-items: center;
`;

const shapeWrapperCss = css`
  display: flex;
  align-items: center;
`;

export type DefaultChartTooltipEntryProps = ChartTooltipEntryProps &
  Omit<HStackProps<HStackDefaultElement>, 'children' | 'color'>;

export const DefaultChartTooltipEntry = memo(
  ({
    seriesId,
    label,
    color,
    shape,
    value,
    valueFormatter,
    ShapeComponent = DefaultLegendShape,
    gap = 1,
    className,
    classNames,
    style,
    styles,
    testID,
    ...props
  }: DefaultChartTooltipEntryProps) => {
    const resolvedValue = useMemo(() => {
      if (value === undefined) return undefined;
      if (valueFormatter) return valueFormatter(value);
      if (value === null) return undefined;
      if (Array.isArray(value)) return `${value[0]}-${value[1]}`;
      return value;
    }, [value, valueFormatter]);

    return (
      <HStack
        className={cx(chartTooltipEntryCss, className, classNames?.root)}
        data-testid={testID}
        gap={gap}
        style={{ ...style, ...styles?.root }}
        {...props}
      >
        <HStack
          className={cx(legendItemCss, classNames?.legendItem)}
          gap={gap}
          style={styles?.legendItem}
          testID={seriesId}
        >
          <Box className={cx(shapeWrapperCss, classNames?.shapeWrapper)} style={styles?.shapeWrapper}>
            <ShapeComponent
              className={classNames?.shape}
              color={color}
              shape={shape}
              style={styles?.shape}
            />
          </Box>
          {typeof label === 'string' ? (
            <Text className={classNames?.label} font="label1" style={styles?.label}>
              {label}
            </Text>
          ) : (
            label
          )}
        </HStack>
        {typeof resolvedValue === 'string' || typeof resolvedValue === 'number' ? (
          <Text className={classNames?.value} font="label2" style={styles?.value}>
            {resolvedValue}
          </Text>
        ) : (
          resolvedValue
        )}
      </HStack>
    );
  },
);
