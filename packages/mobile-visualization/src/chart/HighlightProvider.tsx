import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  runOnJS,
  type SharedValue,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { Haptics } from '@coinbase/cds-mobile/utils/haptics';

import type { BarBounds, HighlightedItem, HighlightScope } from './utils/highlight';
import { getPointOnSerializableScale } from './utils/point';
import { useCartesianChartContext } from './ChartProvider';
import { invertSerializableScale, ScrubberContext, type ScrubberContextValue } from './utils';

/**
 * Context value for chart highlighting state.
 */
export type HighlightContextValue = {
  /**
   * Whether highlighting is enabled.
   */
  enabled: boolean;
  /**
   * The highlight scope configuration.
   */
  scope: HighlightScope;
  /**
   * The current highlighted item(s) during interaction.
   */
  highlight: SharedValue<HighlightedItem[]>;
  /**
   * Function to programmatically set the highlighted items.
   */
  setHighlight: (items: HighlightedItem[]) => void;
  /**
   * Register a bar element for hit testing.
   */
  registerBar: (bounds: BarBounds) => void;
  /**
   * Unregister a bar element.
   */
  unregisterBar: (seriesId: string, dataIndex: number) => void;
};

const HighlightContext = createContext<HighlightContextValue | undefined>(undefined);

/**
 * Hook to access the highlight context.
 * @throws Error if used outside of a HighlightProvider
 */
export const useHighlightContext = (): HighlightContextValue => {
  const context = useContext(HighlightContext);
  if (!context) {
    throw new Error('useHighlightContext must be used within a HighlightProvider');
  }
  return context;
};

export type HighlightProps = {
  /**
   * Whether highlighting is enabled.
   */
  enableHighlighting?: boolean;
  /**
   * Controls what aspects of the data can be highlighted.
   */
  highlightScope?: HighlightScope;
  /**
   * Pass a value to override the internal highlight state.
   */
  highlight?: HighlightedItem[];
  /**
   * Callback fired when highlighting changes during interaction.
   */
  onHighlightChange?: (items: HighlightedItem[]) => void;
};

export type HighlightProviderProps = HighlightProps & {
  children: React.ReactNode;
  /**
   * Allows continuous gestures on the chart to continue outside the bounds of the chart element.
   */
  allowOverflowGestures?: boolean;
  /**
   * Accessibility label for the chart.
   * - When a string: Used as a static label for the chart element
   * - When a function: Called with the highlighted item to generate dynamic labels during interaction
   */
  accessibilityLabel?: string | ((item: HighlightedItem) => string);
  /**
   * The accessibility mode for the chart.
   * - 'chunked': Divides chart into N accessible regions (default for line charts)
   * - 'item': Each data point is an accessible region (default for bar charts)
   * @default 'chunked'
   */
  accessibilityMode?: 'chunked' | 'item';
  /**
   * Number of accessible chunks when accessibilityMode is 'chunked'.
   * @default 10
   */
  accessibilityChunkCount?: number;
};

/**
 * HighlightProvider manages chart highlighting state and gesture handling for mobile.
 */
export const HighlightProvider: React.FC<HighlightProviderProps> = ({
  children,
  allowOverflowGestures,
  enableHighlighting = false,
  highlightScope: scopeProp,
  highlight: controlledHighlight,
  onHighlightChange,
  accessibilityLabel,
  accessibilityMode = 'chunked',
  accessibilityChunkCount = 10,
}) => {
  const chartContext = useCartesianChartContext();

  if (!chartContext) {
    throw new Error('HighlightProvider must be used within a ChartContext');
  }

  const { getXSerializableScale, getXAxis, dataLength } = chartContext;

  const scope: HighlightScope = useMemo(
    () => ({
      dataIndex: scopeProp?.dataIndex ?? false,
      series: scopeProp?.series ?? false,
    }),
    [scopeProp],
  );

  // Bar registry for hit testing (use ref to avoid re-renders)
  const barsRef = useRef<BarBounds[]>([]);

  const registerBar = useCallback((bounds: BarBounds) => {
    barsRef.current.push(bounds);
  }, []);

  const unregisterBar = useCallback((seriesId: string, dataIndex: number) => {
    barsRef.current = barsRef.current.filter(
      (bar) => !(bar.seriesId === seriesId && bar.dataIndex === dataIndex),
    );
  }, []);

  // Find bar at touch point (iterates in reverse for correct z-order)
  const findBarAtPoint = useCallback((touchX: number, touchY: number): BarBounds | null => {
    const bars = barsRef.current;
    for (let i = bars.length - 1; i >= 0; i--) {
      const bar = bars[i];
      if (
        touchX >= bar.x &&
        touchX <= bar.x + bar.width &&
        touchY >= bar.y &&
        touchY <= bar.y + bar.height
      ) {
        return bar;
      }
    }
    return null;
  }, []);

  // Determine if we're in controlled mode
  const isControlled = controlledHighlight !== undefined;

  // Use SharedValue for UI thread performance
  const internalHighlight = useSharedValue<HighlightedItem[]>([]);

  // The exposed highlight SharedValue - returns controlled value or internal value
  const highlight: SharedValue<HighlightedItem[]> = useMemo(() => {
    if (isControlled) {
      // Create a proxy that returns the controlled value but doesn't update internal state
      return {
        get value() {
          return controlledHighlight ?? [];
        },
        set value(_newValue: HighlightedItem[]) {
          // In controlled mode, don't update - the gesture handlers will call onHighlightChange directly
        },
        addListener: internalHighlight.addListener.bind(internalHighlight),
        removeListener: internalHighlight.removeListener.bind(internalHighlight),
        modify: internalHighlight.modify.bind(internalHighlight),
      } as SharedValue<HighlightedItem[]>;
    }
    return internalHighlight;
  }, [isControlled, controlledHighlight, internalHighlight]);

  const xAxis = useMemo(() => getXAxis(), [getXAxis]);
  const xScale = useMemo(() => getXSerializableScale(), [getXSerializableScale]);

  // Convert X coordinate to data index (worklet-compatible)
  const getDataIndexFromX = useCallback(
    (touchX: number): number => {
      'worklet';

      if (!xScale || !xAxis) return 0;

      if (xScale.type === 'band') {
        const [domainMin, domainMax] = xScale.domain;
        const categoryCount = domainMax - domainMin + 1;
        let closestIndex = 0;
        let closestDistance = Infinity;

        for (let i = 0; i < categoryCount; i++) {
          const xPos = getPointOnSerializableScale(i, xScale);
          if (xPos !== undefined) {
            const distance = Math.abs(touchX - xPos);
            if (distance < closestDistance) {
              closestDistance = distance;
              closestIndex = i;
            }
          }
        }
        return closestIndex;
      } else {
        // For numeric scales with axis data, find the nearest data point
        const axisData = xAxis.data;
        if (axisData && Array.isArray(axisData) && typeof axisData[0] === 'number') {
          const numericData = axisData as number[];
          let closestIndex = 0;
          let closestDistance = Infinity;

          for (let i = 0; i < numericData.length; i++) {
            const xValue = numericData[i];
            const xPos = getPointOnSerializableScale(xValue, xScale);
            if (xPos !== undefined) {
              const distance = Math.abs(touchX - xPos);
              if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = i;
              }
            }
          }
          return closestIndex;
        } else {
          const xValue = invertSerializableScale(touchX, xScale);
          const dataIndex = Math.round(xValue);
          const domain = xAxis.domain;
          return Math.max(domain.min ?? 0, Math.min(dataIndex, domain.max ?? 0));
        }
      }
    },
    [xAxis, xScale],
  );

  // Haptic feedback handlers
  const handleStartEndHaptics = useCallback(() => {
    void Haptics.lightImpact();
  }, []);

  // Handle JS thread callback when highlight changes
  const handleHighlightChangeJS = useCallback(
    (items: HighlightedItem[]) => {
      onHighlightChange?.(items);
    },
    [onHighlightChange],
  );

  // React to highlight changes and call JS callback
  useAnimatedReaction(
    () => highlight.value,
    (currentValue, previousValue) => {
      if (currentValue !== previousValue) {
        runOnJS(handleHighlightChangeJS)(currentValue);
      }
    },
    [handleHighlightChangeJS],
  );

  // Setter function for context - always fires callback, only updates internal state when uncontrolled
  const setHighlight = useCallback(
    (newItems: HighlightedItem[]) => {
      if (!isControlled) {
        internalHighlight.value = newItems;
      }
      onHighlightChange?.(newItems);
    },
    [isControlled, internalHighlight, onHighlightChange],
  );

  // Helper to create highlighted item with optional series hit testing
  const createHighlightedItem = useCallback(
    (x: number, y: number, dataIndex: number | null): HighlightedItem => {
      let seriesId: string | null = null;
      if (scope.series) {
        const hitBar = findBarAtPoint(x, y);
        if (hitBar) {
          seriesId = hitBar.seriesId;
        }
      }
      return { dataIndex, seriesId };
    },
    [scope.series, findBarAtPoint],
  );

  // Create the long press pan gesture for single touch
  const singleTouchGesture = useMemo(
    () =>
      Gesture.Pan()
        .activateAfterLongPress(110)
        .shouldCancelWhenOutside(!allowOverflowGestures)
        .onStart(function onStart(event) {
          runOnJS(handleStartEndHaptics)();

          // Android does not trigger onUpdate when the gesture starts
          if (Platform.OS === 'android') {
            const dataIndex = scope.dataIndex ? getDataIndexFromX(event.x) : null;
            runOnJS((x: number, y: number, di: number | null) => {
              const newItem = createHighlightedItem(x, y, di);
              const currentItems = internalHighlight.value;
              const currentItem = currentItems[0];
              if (
                newItem.dataIndex !== currentItem?.dataIndex ||
                newItem.seriesId !== currentItem?.seriesId
              ) {
                if (!isControlled) {
                  internalHighlight.value = [newItem];
                }
                onHighlightChange?.([newItem]);
              }
            })(event.x, event.y, dataIndex);
          }
        })
        .onUpdate(function onUpdate(event) {
          const dataIndex = scope.dataIndex ? getDataIndexFromX(event.x) : null;
          runOnJS((x: number, y: number, di: number | null) => {
            const newItem = createHighlightedItem(x, y, di);
            const currentItems = internalHighlight.value;
            const currentItem = currentItems[0];
            if (
              newItem.dataIndex !== currentItem?.dataIndex ||
              newItem.seriesId !== currentItem?.seriesId
            ) {
              if (!isControlled) {
                internalHighlight.value = [newItem];
              }
              onHighlightChange?.([newItem]);
            }
          })(event.x, event.y, dataIndex);
        })
        .onEnd(function onEnd() {
          if (enableHighlighting) {
            runOnJS(handleStartEndHaptics)();
            if (!isControlled) {
              internalHighlight.value = [];
            }
            runOnJS(onHighlightChange ?? (() => {}))([]);
          }
        })
        .onTouchesCancelled(function onTouchesCancelled() {
          if (enableHighlighting) {
            if (!isControlled) {
              internalHighlight.value = [];
            }
            runOnJS(onHighlightChange ?? (() => {}))([]);
          }
        }),
    [
      allowOverflowGestures,
      handleStartEndHaptics,
      getDataIndexFromX,
      scope.dataIndex,
      createHighlightedItem,
      internalHighlight,
      enableHighlighting,
      isControlled,
      onHighlightChange,
    ],
  );

  const gesture = singleTouchGesture;

  const contextValue: HighlightContextValue = useMemo(
    () => ({
      enabled: enableHighlighting,
      scope,
      highlight,
      setHighlight,
      registerBar,
      unregisterBar,
    }),
    [enableHighlighting, scope, highlight, setHighlight, registerBar, unregisterBar],
  );

  // Derive scrubberPosition from internal highlight for backwards compatibility
  const scrubberPosition = useDerivedValue<number | undefined>(() => {
    const items = internalHighlight.value;
    if (!items || items.length === 0) return undefined;
    return items[0]?.dataIndex ?? undefined;
  }, [internalHighlight]);

  // Provide ScrubberContext for backwards compatibility
  const scrubberContextValue: ScrubberContextValue = useMemo(
    () => ({
      enableScrubbing: enableHighlighting,
      scrubberPosition,
    }),
    [enableHighlighting, scrubberPosition],
  );

  // Helper to get label from accessibilityLabel (string or function)
  const getAccessibilityLabelForItem = useCallback(
    (item: HighlightedItem): string => {
      if (typeof accessibilityLabel === 'string') {
        return accessibilityLabel;
      }
      if (typeof accessibilityLabel === 'function') {
        return accessibilityLabel(item);
      }
      return '';
    },
    [accessibilityLabel],
  );

  // Generate accessibility regions based on mode
  const accessibilityRegions = useMemo(() => {
    // Only generate regions if we have a function label (for dynamic per-item labels)
    // Static string labels don't need regions
    if (!enableHighlighting || !accessibilityLabel || typeof accessibilityLabel === 'string') {
      return null;
    }

    const regions: Array<{
      key: string;
      flex: number;
      label: string;
      highlightedItem: HighlightedItem;
    }> = [];

    if (accessibilityMode === 'chunked') {
      // Divide into chunks
      const chunkSize = Math.ceil(dataLength / accessibilityChunkCount);
      for (let i = 0; i < accessibilityChunkCount && i * chunkSize < dataLength; i++) {
        const startIndex = i * chunkSize;
        const endIndex = Math.min((i + 1) * chunkSize, dataLength);
        const chunkLength = endIndex - startIndex;
        const item: HighlightedItem = { dataIndex: startIndex, seriesId: null };

        regions.push({
          key: `chunk-${i}`,
          flex: chunkLength,
          label: getAccessibilityLabelForItem(item),
          highlightedItem: item,
        });
      }
    } else if (accessibilityMode === 'item') {
      // Each data point is a region
      for (let i = 0; i < dataLength; i++) {
        const item: HighlightedItem = { dataIndex: i, seriesId: null };
        regions.push({
          key: `item-${i}`,
          flex: 1,
          label: getAccessibilityLabelForItem(item),
          highlightedItem: item,
        });
      }
    }

    return regions;
  }, [
    enableHighlighting,
    accessibilityLabel,
    accessibilityMode,
    accessibilityChunkCount,
    dataLength,
    getAccessibilityLabelForItem,
  ]);

  const content = (
    <HighlightContext.Provider value={contextValue}>
      <ScrubberContext.Provider value={scrubberContextValue}>
        {children}
        {accessibilityRegions && (
          <View pointerEvents="box-none" style={styles.accessibilityContainer}>
            {accessibilityRegions.map((region) => (
              <View
                key={region.key}
                accessible
                accessibilityLabel={region.label}
                accessibilityRole="button"
                onAccessibilityTap={() => {
                  // Always fire callback, only update internal state when not controlled
                  if (!isControlled) {
                    internalHighlight.value = [region.highlightedItem];
                  }
                  onHighlightChange?.([region.highlightedItem]);
                  // Clear after a short delay
                  setTimeout(() => {
                    if (!isControlled) {
                      internalHighlight.value = [];
                    }
                    onHighlightChange?.([]);
                  }, 100);
                }}
                style={{ flex: region.flex }}
              />
            ))}
          </View>
        )}
      </ScrubberContext.Provider>
    </HighlightContext.Provider>
  );

  // Wrap with gesture handler only if highlighting is enabled
  if (enableHighlighting) {
    return <GestureDetector gesture={gesture}>{content}</GestureDetector>;
  }

  return content;
};

const styles = StyleSheet.create({
  accessibilityContainer: {
    flexDirection: 'row',
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
});
