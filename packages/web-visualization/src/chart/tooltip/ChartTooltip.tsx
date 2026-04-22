import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Divider,
  VStack,
  type VStackBaseProps,
  type VStackDefaultElement,
  type VStackProps,
} from '@coinbase/cds-web/layout';
import { Portal } from '@coinbase/cds-web/overlays/Portal';
import { tooltipContainerId } from '@coinbase/cds-web/overlays/PortalProvider';
import { Text } from '@coinbase/cds-web/typography';
import { flip, offset, shift, useFloating, type VirtualElement } from '@floating-ui/react-dom';

import { useCartesianChartContext } from '../ChartProvider';
import { useHighlightContext } from '../HighlightProvider';
import { type LegendShapeComponent } from '../legend/Legend';
import { isCategoricalScale } from '../utils';

import { type ChartTooltipEntryComponent, DefaultChartTooltipEntry } from './DefaultChartTooltipEntry';

function getChartTooltipComparableSortValue(
  value: number | [number, number] | null | undefined,
): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  const [a, b] = value;
  if (typeof a === 'number' && typeof b === 'number' && Number.isFinite(a) && Number.isFinite(b)) {
    return (a + b) / 2;
  }
  return null;
}

export type ChartTooltipBaseProps = VStackBaseProps & {
  /**
   * Label text displayed at the top of the tooltip.
   * Can be a static string, a custom ReactNode, or a function that receives the current dataIndex.
   * If not provided, defaults to the x-axis data value at the current index.
   * If null is returned, the label is omitted.
   */
  label?: React.ReactNode | ((dataIndex: number) => React.ReactNode);
  /**
   * Array of series IDs to include in the tooltip.
   * By default, all series will be included.
   */
  seriesIds?: string[];
  /**
   * Formatter function for series values.
   * Receives the value from the customer's `series.data` at the highlighted index (the same raw
   * input passed to the chart, not stacked or normalized plot coordinates).
   * Receives `number | [number, number] | null` and should return a ReactNode.
   * By default, tuple values render as `X-Y`.
   * String results will automatically be wrapped in Text with font="label2".
   */
  valueFormatter?: (value: number | [number, number] | null) => React.ReactNode;
  /**
   * Custom component to render each tooltip entry.
   * @default DefaultChartTooltipEntry
   */
  EntryComponent?: ChartTooltipEntryComponent;
  /**
   * Custom component to render the legend shape within each entry.
   * Only used when EntryComponent is DefaultChartTooltipEntry.
   * @default DefaultLegendShape
   */
  ShapeComponent?: LegendShapeComponent;
  /**
   * How to order series rows in the tooltip at the highlighted index.
   *
   * Sorting uses each series' raw `series.data` entry at that index (customer input), matching
   * what is passed to `valueFormatter` and the default value display.
   *
   * - `none` (default): Series appear in definition order (after `seriesIds` filtering).
   * - `ascending`: Sort by ascending comparable values.
   * - `descending`: Sort by descending comparable values.
   *
   * Series whose value is `null`, missing, or non-finite are always sorted after sortable
   * series. `[min, max]` tuple values are ordered by their arithmetic mean.
   *
   * @default 'none'
   */
  sort?: 'ascending' | 'descending' | 'none';
};

export type ChartTooltipProps = VStackProps<VStackDefaultElement> &
  ChartTooltipBaseProps & {
    /** Custom class names for individual elements of the ChartTooltip component */
    classNames?: {
      /** Root element */
      root?: string;
      /** Tooltip header label text element, not applied when label is a ReactNode */
      label?: string;
      /** Divider element */
      divider?: string;
      /** Entry row element */
      entry?: string;
      /** Entry key cluster element */
      entryKey?: string;
      /** Entry value text element */
      entryValue?: string;
      /** Entry shape wrapper element */
      entryShapeWrapper?: string;
      /** Entry shape element */
      entryShape?: string;
      /** Entry series label text element, not applied when label is a ReactNode */
      entryLabel?: string;
    };
    /** Custom styles for individual elements of the ChartTooltip component */
    styles?: {
      /** Root element */
      root?: React.CSSProperties;
      /** Tooltip header label text element, not applied when label is a ReactNode */
      label?: React.CSSProperties;
      /** Divider element */
      divider?: React.CSSProperties;
      /** Entry row element */
      entry?: React.CSSProperties;
      /** Entry key cluster element */
      entryKey?: React.CSSProperties;
      /** Entry value text element */
      entryValue?: React.CSSProperties;
      /** Entry shape wrapper element */
      entryShapeWrapper?: React.CSSProperties;
      /** Entry shape element */
      entryShape?: React.CSSProperties;
      /** Entry series label text element, not applied when label is a ReactNode */
      entryLabel?: React.CSSProperties;
    };
  };

type Point = { x: number; y: number };

export const ChartTooltip = memo(
  forwardRef<HTMLDivElement, ChartTooltipProps>(
    (
      {
        label,
        seriesIds,
        sort = 'none',
        valueFormatter,
        EntryComponent = DefaultChartTooltipEntry,
        ShapeComponent,
        background = 'bgElevation2',
        borderRadius = 400,
        elevation = 2,
        gap = 1,
        minWidth = 320,
        paddingX = 2,
        paddingY = 1.5,
        className,
        classNames,
        style,
        styles,
        ...props
      },
      ref,
    ) => {
      const markerRef = useRef<SVGGElement | null>(null);
      const [pointerClientPosition, setPointerClientPosition] = useState<Point | undefined>(
        undefined,
      );

      const { enabled, highlight } = useHighlightContext();
      const { series, getSeries, getXAxis, getYAxis, getXScale, getYScale, layout, drawingArea } =
        useCartesianChartContext();

      const dataIndex = highlight[0]?.dataIndex;
      const isTooltipVisible = enabled && dataIndex !== null && dataIndex !== undefined;

      const { refs, floatingStyles, update } = useFloating({
        open: isTooltipVisible,
        placement: 'bottom-start',
        strategy: 'fixed',
        middleware: [
          offset(({ placement }) => {
            const mainAxis = placement.includes('bottom') ? 16 : 8;
            const crossAxis = placement.includes('start') ? 16 : -8;
            return { mainAxis, crossAxis };
          }),
          flip({
            fallbackPlacements: ['top-start', 'bottom-end', 'top-end'],
          }),
          shift({ padding: 8 }),
        ],
      });

      const filteredSeries = useMemo(() => {
        if (seriesIds === undefined) return series;
        return series.filter((s) => seriesIds.includes(s.id));
      }, [series, seriesIds]);

      const displaySeries = useMemo(() => {
        if (sort === 'none' || dataIndex === null || dataIndex === undefined) {
          return filteredSeries;
        }

        const rows = filteredSeries.map((s, originalIndex) => ({
          series: s,
          originalIndex,
          sortValue: getChartTooltipComparableSortValue(getSeries(s.id)?.data?.[dataIndex]),
        }));

        rows.sort((a, b) => {
          const av = a.sortValue;
          const bv = b.sortValue;
          if (av === null && bv === null) return a.originalIndex - b.originalIndex;
          if (av === null) return 1;
          if (bv === null) return -1;
          const diff = av - bv;
          if (diff !== 0) return sort === 'ascending' ? diff : -diff;
          return a.originalIndex - b.originalIndex;
        });

        return rows.map((row) => row.series);
      }, [filteredSeries, sort, dataIndex, getSeries]);

      const resolvedLabel = useMemo(() => {
        if (dataIndex === undefined || dataIndex === null) return undefined;

        if (label !== undefined) {
          return typeof label === 'function' ? label(dataIndex) : label;
        }

        const xAxis = getXAxis();
        if (xAxis?.data && xAxis.data[dataIndex] !== undefined) {
          return xAxis.data[dataIndex];
        }
        return dataIndex;
      }, [dataIndex, label, getXAxis]);

      const fallbackAnchorPoint = useMemo((): Point | undefined => {
        if (dataIndex === undefined || dataIndex === null) return undefined;
        if (!drawingArea) return undefined;

        const svg = markerRef.current?.ownerSVGElement;
        if (!svg) return undefined;

        const svgRect = svg.getBoundingClientRect();
        const categoryAxisIsX = layout !== 'horizontal';
        const categoryScale = categoryAxisIsX ? getXScale() : getYScale();
        const indexAxis = categoryAxisIsX ? getXAxis() : getYAxis();

        if (!categoryScale) return undefined;

        let dataValue: number = dataIndex;
        if (
          indexAxis?.data &&
          Array.isArray(indexAxis.data) &&
          indexAxis.data[dataIndex] !== undefined
        ) {
          const rawValue = indexAxis.data[dataIndex];
          dataValue = typeof rawValue === 'string' ? dataIndex : rawValue;
        }

        const scaledPosition = categoryScale(dataValue);
        if (scaledPosition === undefined) return undefined;

        const categoryPosition =
          scaledPosition + (isCategoricalScale(categoryScale) ? categoryScale.bandwidth() / 2 : 0);

        if (categoryAxisIsX) {
          return {
            x: svgRect.left + drawingArea.x + categoryPosition,
            y: svgRect.top + drawingArea.y + drawingArea.height / 2,
          };
        }

        return {
          x: svgRect.left + drawingArea.x + drawingArea.width / 2,
          y: svgRect.top + drawingArea.y + categoryPosition,
        };
      }, [dataIndex, drawingArea, getXScale, getYScale, getXAxis, getYAxis, layout]);

      const anchorPoint = pointerClientPosition ?? fallbackAnchorPoint;

      useLayoutEffect(() => {
        if (!isTooltipVisible || !anchorPoint) return;

        const virtualEl: VirtualElement = {
          getBoundingClientRect() {
            return {
              width: 0,
              height: 0,
              x: anchorPoint.x,
              y: anchorPoint.y,
              left: anchorPoint.x,
              right: anchorPoint.x,
              top: anchorPoint.y,
              bottom: anchorPoint.y,
            } as DOMRect;
          },
        };

        refs.setReference(virtualEl);
        void update();
      }, [anchorPoint, isTooltipVisible, refs, update]);

      useEffect(() => {
        const svg = markerRef.current?.ownerSVGElement;
        if (!svg) return undefined;

        const handlePointerMove = (event: PointerEvent) => {
          setPointerClientPosition({ x: event.clientX, y: event.clientY });
        };
        const handlePointerEnd = () => {
          setPointerClientPosition(undefined);
        };

        svg.addEventListener('pointermove', handlePointerMove);
        svg.addEventListener('pointerleave', handlePointerEnd);
        svg.addEventListener('pointerup', handlePointerEnd);
        svg.addEventListener('pointercancel', handlePointerEnd);

        return () => {
          svg.removeEventListener('pointermove', handlePointerMove);
          svg.removeEventListener('pointerleave', handlePointerEnd);
          svg.removeEventListener('pointerup', handlePointerEnd);
          svg.removeEventListener('pointercancel', handlePointerEnd);
        };
      }, []);

      useEffect(() => {
        if (enabled) return;
        setPointerClientPosition(undefined);
      }, [enabled]);

      const setFloatingRef = useCallback(
        (node: HTMLDivElement | null) => {
          refs.setFloating(node);
          if (!ref) return;
          if (typeof ref === 'function') {
            ref(node);
            return;
          }
          ref.current = node;
        },
        [refs, ref],
      );

      return (
        <>
          <g ref={markerRef} />
          {isTooltipVisible ? (
            <Portal containerId={tooltipContainerId}>
              <VStack
                ref={setFloatingRef}
                background={background}
                borderRadius={borderRadius}
                className={classNames?.root ?? className}
                elevation={elevation}
                gap={gap}
                minWidth={minWidth}
                paddingX={paddingX}
                paddingY={paddingY}
                style={{ ...floatingStyles, ...style, ...styles?.root }}
                {...props}
              >
                {resolvedLabel &&
                  (typeof resolvedLabel === 'string' || typeof resolvedLabel === 'number' ? (
                    <Text className={classNames?.label} font="label1" style={styles?.label}>
                      {resolvedLabel}
                    </Text>
                  ) : (
                    resolvedLabel
                  ))}
                {resolvedLabel && displaySeries.length > 0 && (
                  <Divider className={classNames?.divider} style={styles?.divider} />
                )}
                {displaySeries.length > 0 &&
                  displaySeries.map((s) => (
                    <EntryComponent
                      key={s.id}
                      ShapeComponent={ShapeComponent}
                      classNames={{
                        root: classNames?.entry,
                        legendItem: classNames?.entryKey,
                        value: classNames?.entryValue,
                        shapeWrapper: classNames?.entryShapeWrapper,
                        shape: classNames?.entryShape,
                        label: classNames?.entryLabel,
                      }}
                      color={s.color}
                      label={s.label ?? s.id}
                      seriesId={s.id}
                      shape={s.legendShape}
                      styles={{
                        root: styles?.entry,
                        legendItem: styles?.entryKey,
                        value: styles?.entryValue,
                        shapeWrapper: styles?.entryShapeWrapper,
                        shape: styles?.entryShape,
                        label: styles?.entryLabel,
                      }}
                      value={getSeries(s.id)?.data?.[dataIndex] ?? undefined}
                      valueFormatter={valueFormatter}
                    />
                  ))}
              </VStack>
            </Portal>
          ) : undefined}
        </>
      );
    },
  ),
);
