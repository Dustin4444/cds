import { memo, useEffect, useMemo } from 'react';
import { Easing, useDerivedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '@coinbase/cds-mobile/hooks/useTheme';

import { useCartesianChartContext } from '../ChartProvider';
import { useHighlightContext } from '../HighlightProvider';
import { Path } from '../Path';
import { getBarPath } from '../utils';

import type { BarComponentProps } from './Bar';

export type DefaultBarProps = BarComponentProps;

const FADED_OPACITY_FACTOR = 0.3;
const FADE_ANIMATION_CONFIG = { duration: 250, easing: Easing.inOut(Easing.ease) };

/**
 * Default bar component that renders a solid bar with animation support.
 * Registers bounds for series highlighting hit testing when `highlightScope.series` is enabled.
 * Supports animated fade via `fadeOnHighlight` prop.
 */
export const DefaultBar = memo<DefaultBarProps>(
  ({
    x,
    y,
    width,
    height,
    borderRadius,
    roundTop,
    roundBottom,
    d,
    fill,
    fillOpacity = 1,
    stroke,
    strokeWidth,
    originY,
    dataX,
    seriesId,
    transition,
    fadeOnHighlight,
  }) => {
    const { animate } = useCartesianChartContext();
    const highlightContext = useHighlightContext();
    const theme = useTheme();

    const { scope } = highlightContext;
    const dataIndex = typeof dataX === 'number' ? dataX : null;

    // Register bar bounds for hit testing when series highlighting is enabled
    useEffect(() => {
      if (!highlightContext.scope.series || !seriesId) return;

      const idx = typeof dataX === 'number' ? dataX : 0;

      highlightContext.registerBar({
        x,
        y,
        width,
        height,
        dataIndex: idx,
        seriesId,
      });

      return () => {
        highlightContext.unregisterBar(seriesId, idx);
      };
    }, [x, y, width, height, dataX, seriesId, highlightContext]);

    // Animated opacity based on highlight state
    const effectiveOpacity = useDerivedValue(() => {
      if (!fadeOnHighlight || !highlightContext.enabled) return fillOpacity;

      const items = highlightContext.highlight.value;

      let targetOpacity = fillOpacity;
      if (items.length > 0) {
        const isHighlighted = items.some((item) => {
          const indexMatch = !scope.dataIndex || item.dataIndex === dataIndex;
          const seriesMatch = !scope.series || item.seriesId === null || item.seriesId === seriesId;
          return indexMatch && seriesMatch;
        });
        targetOpacity = isHighlighted ? fillOpacity : fillOpacity * FADED_OPACITY_FACTOR;
      }

      return withTiming(targetOpacity, FADE_ANIMATION_CONFIG);
    }, [fadeOnHighlight, highlightContext.enabled, fillOpacity, scope, dataIndex, seriesId]);

    const defaultFill = fill || theme.color.fgPrimary;

    const targetPath = useMemo(() => {
      const effectiveBorderRadius = borderRadius ?? 0;
      const effectiveRoundTop = roundTop ?? true;
      const effectiveRoundBottom = roundBottom ?? true;

      return (
        d ||
        getBarPath(
          x,
          y,
          width,
          height,
          effectiveBorderRadius,
          effectiveRoundTop,
          effectiveRoundBottom,
        )
      );
    }, [x, y, width, height, borderRadius, roundTop, roundBottom, d]);

    const initialPath = useMemo(() => {
      const effectiveBorderRadius = borderRadius ?? 0;
      const effectiveRoundTop = roundTop ?? true;
      const effectiveRoundBottom = roundBottom ?? true;
      const baselineY = originY ?? y + height;

      return getBarPath(
        x,
        baselineY,
        width,
        1,
        effectiveBorderRadius,
        effectiveRoundTop,
        effectiveRoundBottom,
      );
    }, [x, originY, y, height, width, borderRadius, roundTop, roundBottom]);

    return (
      <Path
        animate={animate}
        clipPath={null}
        d={targetPath}
        fill={stroke ? 'none' : defaultFill}
        fillOpacity={fadeOnHighlight ? effectiveOpacity : fillOpacity}
        initialPath={initialPath}
        stroke={stroke}
        strokeWidth={strokeWidth}
        transition={transition}
      />
    );
  },
);
