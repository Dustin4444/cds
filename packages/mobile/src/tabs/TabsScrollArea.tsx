import React, { forwardRef, memo, useCallback, useMemo, useState } from 'react';
import { ScrollView, type StyleProp, type View, type ViewStyle } from 'react-native';
import type { SharedAccessibilityProps } from '@coinbase/cds-common';

import { useComponentConfig } from '../hooks/useComponentConfig';
import { useHorizontalScrollToTarget } from '../hooks/useHorizontalScrollToTarget';
import { type BoxBaseProps, HStack } from '../layout';

import {
  TabsScrollAreaOverflowIndicator,
  type TabsScrollAreaOverflowIndicatorProps,
} from './TabsScrollAreaOverflowIndicator';

/**
 * Values passed to `TabsScrollArea`'s function child. Pass `onActiveTabElementChange` to `Tabs` as
 * `onActiveTabElementChange` so the scroll area can scroll the active tab into view.
 */
export type TabsScrollAreaRenderProps = {
  /**
   * Pass to `Tabs` as `onActiveTabElementChange={onActiveTabElementChange}`.
   */
  onActiveTabElementChange: (element: View | null) => void;
};

export type TabsScrollAreaBaseProps = Omit<BoxBaseProps, 'children' | 'ref'> &
  SharedAccessibilityProps & {
    /**
     * Render function that receives `onActiveTabElementChange` (wire to `Tabs` as
     * `onActiveTabElementChange`).
     */
    children: (props: TabsScrollAreaRenderProps) => React.ReactNode;
    /**
     * Horizontal offset when auto-scrolling to the active tab (e.g. so the active tab is not under the overflow gradient).
     * @default 30
     */
    autoScrollOffset?: number;
    /**
     * Rendered at each end when content overflows. Defaults to {@link TabsScrollAreaOverflowIndicator}
     * ({@link OverflowGradient}). Props must extend {@link TabsScrollAreaOverflowIndicatorProps}.
     */
    OverflowIndicatorComponent?: React.FC<TabsScrollAreaOverflowIndicatorProps>;
  };

export type TabsScrollAreaProps = TabsScrollAreaBaseProps & {
  styles?: {
    /** Root layout element */
    root?: StyleProp<ViewStyle>;
    /** Horizontal `ScrollView` wrapping `Tabs` */
    scrollContainer?: StyleProp<ViewStyle>;
    /**
     * applied to overflow indicators.
     */
    overflowIndicator?: StyleProp<ViewStyle>;
  };
};

const TabsScrollAreaWithRef = forwardRef<View, TabsScrollAreaProps>(
  function TabsScrollArea(_props, ref) {
    const mergedProps = useComponentConfig('TabsScrollArea', _props);
    const {
      children,
      testID,
      width,
      autoScrollOffset = 30,
      OverflowIndicatorComponent = TabsScrollAreaOverflowIndicator,
      style,
      styles: {
        root: rootStyle,
        scrollContainer: scrollContainerStyle,
        overflowIndicator: overflowIndicatorStyle,
      } = {},
      ...props
    } = mergedProps;

    const [scrollTarget, setScrollTarget] = useState<View | null>(null);
    const {
      scrollRef,
      isScrollContentOverflowing,
      isScrollContentOffscreenLeft,
      isScrollContentOffscreenRight,
      handleScroll,
      handleScrollContainerLayout,
      handleScrollContentSizeChange,
    } = useHorizontalScrollToTarget({ activeTarget: scrollTarget, autoScrollOffset });

    const renderedChildren = useMemo(() => {
      if (typeof children === 'function') {
        return children({ onActiveTabElementChange: setScrollTarget });
      }
      console.warn(
        'TabsScrollArea expects a function child `({ onActiveTabElementChange }) => <Tabs onActiveTabElementChange={onActiveTabElementChange} {...} />`.',
      );
      return null;
    }, [children]);

    const leftShow = isScrollContentOverflowing && isScrollContentOffscreenLeft;
    const rightShow = isScrollContentOverflowing && isScrollContentOffscreenRight;

    return (
      <HStack ref={ref} style={[style, rootStyle]} testID={testID} width={width} {...props}>
        <ScrollView
          ref={scrollRef}
          horizontal
          onContentSizeChange={handleScrollContentSizeChange}
          onLayout={handleScrollContainerLayout}
          onScroll={handleScroll}
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          style={scrollContainerStyle}
        >
          {renderedChildren}
        </ScrollView>
        <OverflowIndicatorComponent
          direction="left"
          show={leftShow}
          style={overflowIndicatorStyle}
        />
        <OverflowIndicatorComponent
          direction="right"
          show={rightShow}
          style={overflowIndicatorStyle}
        />
      </HStack>
    );
  },
);

export const TabsScrollArea = memo(TabsScrollAreaWithRef);

TabsScrollAreaWithRef.displayName = 'TabsScrollArea';
