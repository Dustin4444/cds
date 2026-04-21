import React, { memo, useMemo } from 'react';
import { useCallback } from 'react';
import { css } from '@linaria/core';

import { useCartesianChartContext } from '../ChartProvider';
import { useHighlightContext } from '../HighlightProvider';
import { Path } from '../Path';
import {
  defaultBarEnterOpacityTransition,
  defaultBarEnterTransition,
  defaultTransition,
  getBarPath,
  getTransition,
  withStaggerDelayTransition,
} from '../utils';
import { type BarTransition, getNormalizedStagger } from '../utils/bar';

import type { BarComponentProps } from './Bar';

const fadeTransitionCss = css`
  transition: fill-opacity 250ms ease-in-out;
`;

const FADED_OPACITY_FACTOR = 0.3;

export type DefaultBarProps = BarComponentProps & {
  /**
   * Custom class name for the bar.
   */
  className?: string;
  /**
   * Custom styles for the bar.
   */
  style?: React.CSSProperties;
};

/**
 * Default bar component that renders a solid bar with animation.
 * Uses pointer events to report series identity to the highlight system
 * when `highlightScope.series` is enabled.
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
    origin,
    d,
    fill = 'var(--color-fgPrimary)',
    fillOpacity = 1,
    dataX,
    dataY,
    seriesId,
    minSize = 1,
    transitions,
    transition,
    fadeOnHighlight,
    className,
    style,
    ...props
  }) => {
    const { animate, drawingArea, layout } = useCartesianChartContext();
    const highlightContext = useHighlightContext();
    const { enabled: highlightEnabled, highlight, scope } = highlightContext;

    const dataIndex = useMemo(() => {
      if (typeof dataX === 'number') return dataX;
      if (typeof dataY === 'number') return dataY;
      return null;
    }, [dataX, dataY]);

    const highlightByDataIndex = scope.dataIndex ?? false;
    const highlightBySeries = scope.series ?? false;

    const effectiveOpacity = useMemo(() => {
      if (!fadeOnHighlight || !highlightEnabled || highlight.length === 0) {
        return fillOpacity;
      }

      const isHighlighted = highlight.some((item) => {
        const indexMatch = !highlightByDataIndex || item.dataIndex === dataIndex;
        // When seriesId is null (pointer between bars), all series at this index match.
        // Only narrow to a specific series when one is identified.
        const seriesMatch =
          !highlightBySeries || item.seriesId === null || item.seriesId === seriesId;
        return indexMatch && seriesMatch;
      });

      return isHighlighted ? fillOpacity : fillOpacity * FADED_OPACITY_FACTOR;
    }, [
      fadeOnHighlight,
      highlightEnabled,
      highlight,
      fillOpacity,
      highlightByDataIndex,
      highlightBySeries,
      dataIndex,
      seriesId,
    ]);

    const handlePointerEnter = useCallback(
      (event: React.PointerEvent<SVGPathElement>) => {
        if (!highlightEnabled || !highlightBySeries) return;
        highlightContext.updatePointerHighlight(event.pointerId, { seriesId: seriesId ?? null });
      },
      [highlightContext, highlightEnabled, highlightBySeries, seriesId],
    );

    const handlePointerLeave = useCallback(
      (event: React.PointerEvent<SVGPathElement>) => {
        if (!highlightEnabled || !highlightBySeries) return;
        highlightContext.updatePointerHighlight(event.pointerId, { seriesId: null });
      },
      [highlightContext, highlightEnabled, highlightBySeries],
    );

    const resolvedStyle =
      highlightEnabled && highlightBySeries ? { ...style, cursor: 'pointer' } : style;
    const resolvedClassName = fadeOnHighlight
      ? [className, fadeTransitionCss].filter(Boolean).join(' ')
      : className;

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

    return (
      <Path
        {...props}
        animate={animate}
        className={resolvedClassName}
        clipRect={null}
        d={d}
        fill={fill}
        fillOpacity={effectiveOpacity}
        initialPath={initialPath}
        onPointerEnter={highlightEnabled && highlightBySeries ? handlePointerEnter : undefined}
        onPointerLeave={highlightEnabled && highlightBySeries ? handlePointerLeave : undefined}
        style={resolvedStyle}
        transitions={{
          enter: enterTransitionWithStagger,
          enterOpacity: enterOpacityTransitionWithStagger,
          update: updateTransition,
        }}
      />
    );
  },
);
