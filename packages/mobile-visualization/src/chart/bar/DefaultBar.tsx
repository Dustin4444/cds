import { memo, useEffect, useMemo } from 'react';
import { Easing, useDerivedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '@coinbase/cds-mobile/hooks/useTheme';

import { useCartesianChartContext } from '../ChartProvider';
import { useHighlightContext } from '../HighlightProvider';
import { Path } from '../Path';
import { defaultBarEnterTransition, getBarPath, withStaggerDelayTransition } from '../utils';
import { defaultTransition, getTransition } from '../utils/transition';

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
    borderRadius = 4,
    roundTop,
    roundBottom,
    d,
    fill,
    fillOpacity = 1,
    dataX,
    dataY,
    seriesId,
    stroke,
    strokeWidth,
    origin,
    transitions,
    transition,
    fadeOnHighlight,
  }) => {
    const { animate, drawingArea, layout } = useCartesianChartContext();
    const highlightContext = useHighlightContext();
    const theme = useTheme();
    const { enabled: highlightEnabled, scope, registerBar, unregisterBar } = highlightContext;

    const dataIndex = useMemo(() => {
      if (typeof dataX === 'number') return dataX;
      if (typeof dataY === 'number') return dataY;
      return null;
    }, [dataX, dataY]);

    const defaultFill = fill || theme.color.fgPrimary;

    // Register bar bounds for hit testing when series highlighting is enabled.
    useEffect(() => {
      if (!highlightEnabled || !scope.series || !seriesId) return;

      const index = dataIndex ?? 0;

      registerBar({
        x,
        y,
        width,
        height,
        dataIndex: index,
        seriesId,
      });

      return () => {
        unregisterBar(seriesId, index);
      };
    }, [
      highlightEnabled,
      scope.series,
      seriesId,
      registerBar,
      unregisterBar,
      x,
      y,
      width,
      height,
      dataIndex,
    ]);

    const highlightByDataIndex = scope.dataIndex ?? false;
    const highlightBySeries = scope.series ?? false;

    const effectiveOpacity = useDerivedValue(() => {
      if (!fadeOnHighlight || !highlightEnabled) return fillOpacity;

      const items = highlightContext.highlight.value;
      let targetOpacity = fillOpacity;

      if (items.length > 0) {
        const isHighlighted = items.some((item) => {
          const indexMatch = !highlightByDataIndex || item.dataIndex === dataIndex;
          const seriesMatch =
            !highlightBySeries || item.seriesId === null || item.seriesId === seriesId;
          return indexMatch && seriesMatch;
        });

        targetOpacity = isHighlighted ? fillOpacity : fillOpacity * FADED_OPACITY_FACTOR;
      }

      return withTiming(targetOpacity, FADE_ANIMATION_CONFIG);
    }, [
      fadeOnHighlight,
      highlightEnabled,
      fillOpacity,
      highlightByDataIndex,
      highlightBySeries,
      dataIndex,
      seriesId,
    ]);

    // For vertical layout, stagger by x (category axis). For horizontal, stagger by y (category axis).
    const normalizedStagger = useMemo(() => {
      const barsGrowVertically = layout !== 'horizontal';
      if (barsGrowVertically) {
        return drawingArea.width > 0 ? (x - drawingArea.x) / drawingArea.width : 0;
      }
      return drawingArea.height > 0 ? (y - drawingArea.y) / drawingArea.height : 0;
    }, [layout, x, y, drawingArea.x, drawingArea.y, drawingArea.width, drawingArea.height]);

    const enterTransition = useMemo(
      () =>
        withStaggerDelayTransition(
          getTransition(transitions?.enter, animate, defaultBarEnterTransition),
          normalizedStagger,
        ),
      [transitions?.enter, animate, normalizedStagger],
    );
    const updateTransition = useMemo(
      () =>
        withStaggerDelayTransition(
          getTransition(
            transitions?.update !== undefined ? transitions.update : transition,
            animate,
            defaultTransition,
          ),
          normalizedStagger,
        ),
      [transitions?.update, transition, animate, normalizedStagger],
    );

    const initialPath = useMemo(() => {
      if (!animate) return undefined;

      const minSize = 1;
      const barsGrowVertically = layout !== 'horizontal';
      const baseline = origin ?? (barsGrowVertically ? y + height : x);

      const initialX = barsGrowVertically ? x : baseline;
      const initialY = barsGrowVertically ? baseline : y;
      const initialWidth = barsGrowVertically ? width : minSize;
      const initialHeight = barsGrowVertically ? minSize : height;

      return getBarPath(
        initialX,
        initialY,
        initialWidth,
        initialHeight,
        borderRadius,
        !!roundTop,
        !!roundBottom,
        layout,
      );
    }, [animate, layout, x, y, origin, width, height, borderRadius, roundTop, roundBottom]);

    return (
      <Path
        animate={animate}
        clipPath={null}
        d={d}
        fill={stroke ? 'none' : defaultFill}
        fillOpacity={fadeOnHighlight ? effectiveOpacity : fillOpacity}
        initialPath={initialPath}
        stroke={stroke}
        strokeWidth={strokeWidth}
        transitions={{
          enter: enterTransition,
          update: updateTransition,
        }}
      />
    );
  },
);
