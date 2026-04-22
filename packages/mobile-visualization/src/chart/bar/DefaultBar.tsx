import { memo, useEffect, useMemo } from 'react';
import { Easing, useDerivedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '@coinbase/cds-mobile/hooks/useTheme';
import { Group } from '@shopify/react-native-skia';

import { useCartesianChartContext } from '../ChartProvider';
import { useHighlightContext } from '../HighlightProvider';
import { Path } from '../Path';
import {
  defaultBarEnterOpacityTransition,
  defaultBarEnterTransition,
  getBarPath,
  withStaggerDelayTransition,
} from '../utils';
import { type BarTransition, getNormalizedStagger } from '../utils/bar';
import { defaultTransition, getTransition } from '../utils/transition';

import type { BarComponentProps } from './Bar';

export type DefaultBarProps = BarComponentProps;

const fadeOpacity = 0.3;
const fadeTransition = { duration: 100, easing: Easing.out(Easing.ease) };

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
    minSize = 1,
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

    const highlightOpacity = useDerivedValue(() => {
      if (!fadeOnHighlight || !highlightEnabled) return 1;

      const items = highlightContext.highlight.value;
      let opacity = 1;

      if (items.length > 0) {
        const isHighlighted = items.some((item) => {
          const indexMatch = !highlightByDataIndex || item.dataIndex === dataIndex;
          const seriesMatch =
            !highlightBySeries || item.seriesId === null || item.seriesId === seriesId;
          return indexMatch && seriesMatch;
        });
        opacity = isHighlighted ? 1 : fadeOpacity;
      }

      return withTiming(opacity, fadeTransition);
    }, [
      fadeOnHighlight,
      highlightEnabled,
      highlightByDataIndex,
      highlightBySeries,
      dataIndex,
      seriesId,
    ]);

    const normalizedStagger = useMemo(
      () => getNormalizedStagger(layout, x, y, drawingArea),
      [layout, x, y, drawingArea],
    );

    const enterTransition = useMemo(
      () =>
        getTransition(
          transitions?.enter,
          animate,
          defaultBarEnterTransition,
        ) as BarTransition | null,
      [transitions?.enter, animate],
    );
    const enterTransitionWithStagger = useMemo(
      () => withStaggerDelayTransition(enterTransition, normalizedStagger),
      [enterTransition, normalizedStagger],
    );
    const enterOpacityTransition = useMemo(() => {
      if (transitions?.enterOpacity === undefined && enterTransition === null) return null;

      const enterOpacityTransition: BarTransition | null = getTransition(
        transitions?.enterOpacity,
        animate,
        defaultBarEnterOpacityTransition,
      );

      if (!enterOpacityTransition) return null;

      return {
        ...enterOpacityTransition,
        delay: enterOpacityTransition.delay ?? enterTransition?.delay,
        staggerDelay: enterOpacityTransition.staggerDelay ?? enterTransition?.staggerDelay,
      };
    }, [transitions?.enterOpacity, animate, enterTransition]);
    const enterOpacityTransitionWithStagger = useMemo(
      () => withStaggerDelayTransition(enterOpacityTransition, normalizedStagger),
      [enterOpacityTransition, normalizedStagger],
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
      if (!animate) return;
      const isHorizontalLayout = layout === 'horizontal';
      const baseline = origin ?? (isHorizontalLayout ? x : y + height);

      const initialX = isHorizontalLayout ? baseline : x;
      const initialY = isHorizontalLayout ? y : baseline;
      const initialWidth = isHorizontalLayout ? minSize : width;
      const initialHeight = isHorizontalLayout ? height : minSize;

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
    }, [
      animate,
      layout,
      x,
      y,
      origin,
      width,
      height,
      borderRadius,
      roundTop,
      roundBottom,
      minSize,
    ]);

    const path = (
      <Path
        animate={animate}
        clipPath={null}
        d={d}
        fill={stroke ? 'none' : defaultFill}
        fillOpacity={fillOpacity}
        initialPath={initialPath}
        stroke={stroke}
        strokeWidth={strokeWidth}
        transitions={{
          enter: enterTransitionWithStagger,
          enterOpacity: enterOpacityTransitionWithStagger,
          update: updateTransition,
        }}
      />
    );

    if (fadeOnHighlight) return <Group opacity={highlightOpacity}>{path}</Group>;

    return path;
  },
);
