import React, { memo, useCallback, useMemo } from 'react';
import { m as motion } from 'framer-motion';
import { css } from '@linaria/core';

import { useCartesianChartContext } from '../ChartProvider';
import { useHighlightContext } from '../HighlightProvider';
import { getBarPath } from '../utils';

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
    width,
    borderRadius = 4,
    roundTop,
    roundBottom,
    originY,
    d,
    fill = 'var(--color-fgPrimary)',
    fillOpacity = 1,
    dataX,
    dataY,
    seriesId,
    transition,
    fadeOnHighlight,
    ...props
  }) => {
    const { animate } = useCartesianChartContext();
    const highlightContext = useHighlightContext();
    const { highlight, scope } = highlightContext;

    const initialPath = useMemo(() => {
      if (!animate) return undefined;
      const minHeight = 1;
      const initialY = (originY ?? 0) - minHeight;
      return getBarPath(x, initialY, width, minHeight, borderRadius, !!roundTop, !!roundBottom);
    }, [animate, x, originY, width, borderRadius, roundTop, roundBottom]);

    const dataIndex = typeof dataX === 'number' ? dataX : null;

    // Determine effective opacity based on highlight state
    const effectiveOpacity = useMemo(() => {
      if (!fadeOnHighlight || !highlightContext.enabled || highlight.length === 0) {
        return fillOpacity;
      }

      const isHighlighted = highlight.some((item) => {
        const indexMatch = !scope.dataIndex || item.dataIndex === dataIndex;
        // When seriesId is null (pointer between bars), all series at this index match.
        // Only narrow to a specific series when one is identified.
        const seriesMatch = !scope.series || item.seriesId === null || item.seriesId === seriesId;
        return indexMatch && seriesMatch;
      });

      return isHighlighted ? fillOpacity : fillOpacity * FADED_OPACITY_FACTOR;
    }, [
      fadeOnHighlight,
      highlightContext.enabled,
      highlight,
      scope,
      dataIndex,
      seriesId,
      fillOpacity,
    ]);

    const handlePointerEnter = useCallback(
      (event: React.PointerEvent) => {
        if (!highlightContext.enabled || !highlightContext.scope.series) return;
        highlightContext.updatePointerHighlight(event.pointerId, {
          seriesId: seriesId ?? null,
        });
      },
      [highlightContext, seriesId],
    );

    const handlePointerLeave = useCallback(
      (event: React.PointerEvent) => {
        if (!highlightContext.enabled || !highlightContext.scope.series) return;
        highlightContext.updatePointerHighlight(event.pointerId, {
          seriesId: null,
        });
      },
      [highlightContext],
    );

    const pointerHandlers = highlightContext.scope.series
      ? {
          onPointerEnter: handlePointerEnter,
          onPointerLeave: handlePointerLeave,
          style: { cursor: 'pointer' },
        }
      : {};

    const className = fadeOnHighlight ? fadeTransitionCss : undefined;

    if (animate && initialPath) {
      return (
        <motion.path
          {...props}
          {...pointerHandlers}
          animate={{ d }}
          className={className}
          fill={fill}
          fillOpacity={effectiveOpacity}
          initial={{ d: initialPath }}
          transition={transition}
        />
      );
    }

    return (
      <path
        {...props}
        {...pointerHandlers}
        className={className}
        d={d}
        fill={fill}
        fillOpacity={effectiveOpacity}
      />
    );
  },
);
