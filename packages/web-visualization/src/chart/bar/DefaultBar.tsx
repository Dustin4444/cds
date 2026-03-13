import React, { memo, useMemo } from 'react';
import { useCallback } from 'react';
import { css } from '@linaria/core';

import { useCartesianChartContext } from '../ChartProvider';
import { useHighlightContext } from '../HighlightProvider';
import { Path } from '../Path';
import {
  defaultBarEnterTransition,
  defaultTransition,
  getBarPath,
  getTransition,
  withStaggerDelayTransition,
} from '../utils';

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

      const initialX = barsGrowVertically ? x : (origin ?? x);
      const initialY = barsGrowVertically ? (origin ?? y + height) : y;
      const initialWidth = barsGrowVertically ? width : minSize;
      const initialHeight = barsGrowVertically ? minSize : height;

      return getBarPath(
        initialX,
        initialY,
        initialWidth,
        initialHeight,
        borderRadius ?? 0,
        !!roundTop,
        !!roundBottom,
        layout,
      );
    }, [animate, layout, x, y, origin, width, height, borderRadius, roundTop, roundBottom]);

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
          enter: enterTransition,
          update: updateTransition,
        }}
      />
    );
  },
);
