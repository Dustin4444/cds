import React, { useCallback, useMemo } from 'react';
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

import { useCartesianChartContext } from '../ChartProvider';
import {
  type ActiveItem,
  type ActiveItems,
  InteractionContext,
  type InteractionContextValue,
  type InteractionMode,
  type InteractionScope,
  type InteractionState,
  invertSerializableScale,
  ScrubberContext,
  type ScrubberContextValue,
} from '../utils';
import { getPointOnSerializableScale } from '../utils/point';

const defaultInteractionScope: InteractionScope = {
  dataIndex: true,
  series: false,
};

export type InteractionProviderProps = {
  children: React.ReactNode;
  /**
   * Allows continuous gestures on the chart to continue outside the bounds of the chart element.
   */
  allowOverflowGestures?: boolean;
  /**
   * The interaction mode.
   * - 'none': Interaction disabled
   * - 'single': Single touch interaction (default)
   * - 'multi': Multi-touch interaction
   * @default 'single'
   */
  interaction?: InteractionMode;
  /**
   * Controls what aspects of the data can be interacted with.
   * @default { dataIndex: true, series: false }
   */
  interactionScope?: InteractionScope;
  /**
   * Controlled active item (for single mode).
   * - undefined: Uncontrolled mode
   * - null: Controlled mode with no active item (ignores user gestures)
   * - ActiveItem: Controlled mode with specific active item
   */
  activeItem?: ActiveItem | null;
  /**
   * Controlled active items (for multi mode).
   * - undefined: Uncontrolled mode
   * - []: Controlled mode with no active items (ignores user gestures)
   * - ActiveItems: Controlled mode with specific active items
   */
  activeItems?: ActiveItems;
  /**
   * Callback fired when the active item changes during interaction.
   * For single mode: receives `ActiveItem | undefined`
   * For multi mode: receives `ActiveItems`
   */
  onInteractionChange?: (state: InteractionState) => void;
  /**
   * Accessibility label for the chart.
   * - When a string: Used as a static label for the chart element
   * - When a function: Called with the active item to generate dynamic labels during interaction
   */
  accessibilityLabel?: string | ((activeItem: ActiveItem) => string);
  /**
   * The accessibility mode for the chart.
   * - 'chunked': Divides chart into N accessible regions (default for line charts)
   * - 'item': Each data point is an accessible region (default for bar charts)
   * - 'series': Each series is an accessible region
   * @default 'chunked'
   */
  accessibilityMode?: 'chunked' | 'item' | 'series';
  /**
   * Number of accessible chunks when accessibilityMode is 'chunked'.
   * @default 10
   */
  accessibilityChunkCount?: number;

  // Legacy props for backwards compatibility
  /**
   * @deprecated Use `interaction="single"` instead
   */
  enableScrubbing?: boolean;
  /**
   * @deprecated Use `onInteractionChange` instead
   */
  onScrubberPositionChange?: (index: number | undefined) => void;
};

/**
 * InteractionProvider manages chart interaction state and gesture handling for mobile.
 * It supports single and multi-touch interactions with configurable scope.
 */
export const InteractionProvider: React.FC<InteractionProviderProps> = ({
  children,
  allowOverflowGestures,
  interaction: interactionProp,
  interactionScope: scopeProp,
  activeItem: controlledActiveItem,
  activeItems: controlledActiveItems,
  onInteractionChange,
  accessibilityLabel,
  accessibilityMode = 'chunked',
  accessibilityChunkCount = 10,
  // Legacy props
  enableScrubbing,
  onScrubberPositionChange,
}) => {
  const chartContext = useCartesianChartContext();

  if (!chartContext) {
    throw new Error('InteractionProvider must be used within a ChartContext');
  }

  const { getXSerializableScale, getXAxis, dataLength } = chartContext;

  // Resolve interaction mode (with backwards compatibility)
  const interaction: InteractionMode = useMemo(() => {
    if (interactionProp !== undefined) return interactionProp;
    if (enableScrubbing !== undefined) return enableScrubbing ? 'single' : 'none';
    return 'single'; // Default to single
  }, [interactionProp, enableScrubbing]);

  const scope: InteractionScope = useMemo(
    () => ({ ...defaultInteractionScope, ...scopeProp }),
    [scopeProp],
  );

  // Determine if we're in controlled mode
  // null/[] means "controlled with no active item" - distinct from undefined (uncontrolled)
  const isControlled = controlledActiveItem !== undefined || controlledActiveItems !== undefined;

  // Use SharedValue for UI thread performance
  const internalActiveItem = useSharedValue<InteractionState>(
    interaction === 'multi' ? [] : undefined,
  );

  // The exposed activeItem SharedValue - returns controlled value or internal value
  const activeItem: SharedValue<InteractionState> = useMemo(() => {
    if (isControlled) {
      // Create a proxy that returns the controlled value but doesn't update internal state
      return {
        get value() {
          return interaction === 'multi' ? controlledActiveItems : controlledActiveItem;
        },
        set value(_newValue: InteractionState) {
          // In controlled mode, don't update - the gesture handlers will call onInteractionChange directly
        },
        addListener: internalActiveItem.addListener.bind(internalActiveItem),
        removeListener: internalActiveItem.removeListener.bind(internalActiveItem),
        modify: internalActiveItem.modify.bind(internalActiveItem),
      } as SharedValue<InteractionState>;
    }
    return internalActiveItem;
  }, [isControlled, interaction, controlledActiveItem, controlledActiveItems, internalActiveItem]);

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

  // Handle JS thread callback when active item changes
  const handleInteractionChangeJS = useCallback(
    (state: InteractionState) => {
      onInteractionChange?.(state);

      // Legacy callback support
      if (onScrubberPositionChange && interaction === 'single') {
        const singleState = state as ActiveItem | undefined;
        onScrubberPositionChange(singleState?.dataIndex ?? undefined);
      }
    },
    [onInteractionChange, onScrubberPositionChange, interaction],
  );

  // React to active item changes and call JS callback
  useAnimatedReaction(
    () => activeItem.value,
    (currentValue, previousValue) => {
      if (currentValue !== previousValue) {
        runOnJS(handleInteractionChangeJS)(currentValue);
      }
    },
    [handleInteractionChangeJS],
  );

  // Setter function for context - always fires callback, only updates internal state when uncontrolled
  const setActiveItem = useCallback(
    (newState: InteractionState) => {
      if (!isControlled) {
        internalActiveItem.value = newState;
      }
      onInteractionChange?.(newState);
    },
    [isControlled, internalActiveItem, onInteractionChange],
  );

  // Create the long press pan gesture for single mode
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
            const newActiveItem: ActiveItem = { dataIndex, seriesId: null };
            const currentItem = internalActiveItem.value as ActiveItem | undefined;
            if (newActiveItem.dataIndex !== currentItem?.dataIndex) {
              if (!isControlled) {
                internalActiveItem.value = newActiveItem;
              }
              runOnJS(onInteractionChange ?? (() => {}))(newActiveItem);
            }
          }
        })
        .onUpdate(function onUpdate(event) {
          const dataIndex = scope.dataIndex ? getDataIndexFromX(event.x) : null;
          const newActiveItem: ActiveItem = { dataIndex, seriesId: null };
          const currentItem = internalActiveItem.value as ActiveItem | undefined;
          if (newActiveItem.dataIndex !== currentItem?.dataIndex) {
            if (!isControlled) {
              internalActiveItem.value = newActiveItem;
            }
            runOnJS(onInteractionChange ?? (() => {}))(newActiveItem);
          }
        })
        .onEnd(function onEnd() {
          if (interaction !== 'none') {
            runOnJS(handleStartEndHaptics)();
            if (!isControlled) {
              internalActiveItem.value = undefined;
            }
            runOnJS(onInteractionChange ?? (() => {}))(undefined);
          }
        })
        .onTouchesCancelled(function onTouchesCancelled() {
          if (interaction !== 'none') {
            if (!isControlled) {
              internalActiveItem.value = undefined;
            }
            runOnJS(onInteractionChange ?? (() => {}))(undefined);
          }
        }),
    [
      allowOverflowGestures,
      handleStartEndHaptics,
      getDataIndexFromX,
      scope.dataIndex,
      internalActiveItem,
      interaction,
      isControlled,
      onInteractionChange,
    ],
  );

  // Create multi-touch gesture
  const multiTouchGesture = useMemo(
    () =>
      Gesture.Manual()
        .shouldCancelWhenOutside(!allowOverflowGestures)
        .onTouchesDown(function onTouchesDown(event) {
          runOnJS(handleStartEndHaptics)();

          const items: ActiveItems = event.allTouches.map((touch) => {
            const dataIndex = scope.dataIndex ? getDataIndexFromX(touch.x) : null;
            return { dataIndex, seriesId: null };
          });
          if (!isControlled) {
            internalActiveItem.value = items;
          }
          runOnJS(onInteractionChange ?? (() => {}))(items);
        })
        .onTouchesMove(function onTouchesMove(event) {
          const items: ActiveItems = event.allTouches.map((touch) => {
            const dataIndex = scope.dataIndex ? getDataIndexFromX(touch.x) : null;
            return { dataIndex, seriesId: null };
          });
          if (!isControlled) {
            internalActiveItem.value = items;
          }
          runOnJS(onInteractionChange ?? (() => {}))(items);
        })
        .onTouchesUp(function onTouchesUp(event) {
          if (event.allTouches.length === 0) {
            runOnJS(handleStartEndHaptics)();
            if (!isControlled) {
              internalActiveItem.value = [];
            }
            runOnJS(onInteractionChange ?? (() => {}))([]);
          } else {
            const items: ActiveItems = event.allTouches.map((touch) => {
              const dataIndex = scope.dataIndex ? getDataIndexFromX(touch.x) : null;
              return { dataIndex, seriesId: null };
            });
            if (!isControlled) {
              internalActiveItem.value = items;
            }
            runOnJS(onInteractionChange ?? (() => {}))(items);
          }
        })
        .onTouchesCancelled(function onTouchesCancelled() {
          if (!isControlled) {
            internalActiveItem.value = [];
          }
          runOnJS(onInteractionChange ?? (() => {}))([]);
        }),
    [
      allowOverflowGestures,
      handleStartEndHaptics,
      getDataIndexFromX,
      scope.dataIndex,
      internalActiveItem,
      isControlled,
      onInteractionChange,
    ],
  );

  const gesture = interaction === 'multi' ? multiTouchGesture : singleTouchGesture;

  const contextValue: InteractionContextValue = useMemo(
    () => ({
      mode: interaction,
      scope,
      activeItem,
      setActiveItem,
    }),
    [interaction, scope, activeItem, setActiveItem],
  );

  // Derive scrubberPosition from internal active item for backwards compatibility
  const scrubberPosition = useDerivedValue<number | undefined>(() => {
    const state = internalActiveItem.value;
    if (state === null || state === undefined) return undefined;
    if (Array.isArray(state)) {
      // For multi mode, use first item's dataIndex
      return state[0]?.dataIndex ?? undefined;
    }
    return state.dataIndex ?? undefined;
  }, [internalActiveItem]);

  // Provide ScrubberContext for backwards compatibility
  const scrubberContextValue: ScrubberContextValue = useMemo(
    () => ({
      enableScrubbing: interaction !== 'none',
      scrubberPosition,
    }),
    [interaction, scrubberPosition],
  );

  // Helper to get label from accessibilityLabel (string or function)
  const getAccessibilityLabelForItem = useCallback(
    (item: ActiveItem): string => {
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
    if (interaction === 'none' || !accessibilityLabel || typeof accessibilityLabel === 'string') {
      return null;
    }

    const regions: Array<{
      key: string;
      flex: number;
      label: string;
      activeItem: ActiveItem;
    }> = [];

    if (accessibilityMode === 'chunked') {
      // Divide into chunks
      const chunkSize = Math.ceil(dataLength / accessibilityChunkCount);
      for (let i = 0; i < accessibilityChunkCount && i * chunkSize < dataLength; i++) {
        const startIndex = i * chunkSize;
        const endIndex = Math.min((i + 1) * chunkSize, dataLength);
        const chunkLength = endIndex - startIndex;
        const item: ActiveItem = { dataIndex: startIndex, seriesId: null };

        regions.push({
          key: `chunk-${i}`,
          flex: chunkLength,
          label: getAccessibilityLabelForItem(item),
          activeItem: item,
        });
      }
    } else if (accessibilityMode === 'item') {
      // Each data point is a region
      for (let i = 0; i < dataLength; i++) {
        const item: ActiveItem = { dataIndex: i, seriesId: null };
        regions.push({
          key: `item-${i}`,
          flex: 1,
          label: getAccessibilityLabelForItem(item),
          activeItem: item,
        });
      }
    }
    // Note: 'series' mode would require series info from context

    return regions;
  }, [
    interaction,
    accessibilityLabel,
    accessibilityMode,
    accessibilityChunkCount,
    dataLength,
    getAccessibilityLabelForItem,
  ]);

  const content = (
    <InteractionContext.Provider value={contextValue}>
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
                    internalActiveItem.value = region.activeItem;
                  }
                  onInteractionChange?.(region.activeItem);
                  // Clear after a short delay
                  setTimeout(() => {
                    if (!isControlled) {
                      internalActiveItem.value = undefined;
                    }
                    onInteractionChange?.(undefined);
                  }, 100);
                }}
                style={{ flex: region.flex }}
              />
            ))}
          </View>
        )}
      </ScrubberContext.Provider>
    </InteractionContext.Provider>
  );

  // Wrap with gesture handler only if interaction is enabled
  if (interaction !== 'none') {
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
