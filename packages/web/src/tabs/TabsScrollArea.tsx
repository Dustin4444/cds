import React, { memo, useCallback, useMemo, useState } from 'react';
import type { SharedAccessibilityProps } from '@coinbase/cds-common';
import { css } from '@linaria/core';

import { cx } from '../cx';
import { useComponentConfig } from '../hooks/useComponentConfig';
import { useHorizontalScrollToTarget } from '../hooks/useHorizontalScrollToTarget';
import { HStack } from '../layout';
import type { BoxBaseProps } from '../layout/Box';
import type { StylesAndClassNames } from '../types';

import {
  TabsScrollAreaOverflowIndicator,
  type TabsScrollAreaOverflowIndicatorProps,
} from './TabsScrollAreaOverflowIndicator';

/**
 * Values passed to `TabsScrollArea`'s function child. Pass `onActiveTab` to `Tabs` as
 * `onActiveTabElementChange` so the scroll area can scroll the active tab into view.
 */
export type TabsScrollAreaRenderProps = {
  /**
   * Pass to `Tabs` as `onActiveTabElementChange={onActiveTab}`.
   */
  onActiveTabElementChange: (element: HTMLElement | null) => void;
};

/**
 * Static class names for TabsScrollArea component parts.
 * Use these selectors to target specific elements with CSS.
 */
export const tabsScrollAreaClassNames = {
  /** Root layout element */
  root: 'cds-TabsScrollArea',
  /** Horizontal scroll region wrapping `Tabs` */
  scrollContainer: 'cds-TabsScrollArea-scrollContainer',
  /** Applied to each overflow indicator's root */
  overflowIndicator: 'cds-TabsScrollArea-overflowIndicator',
  /** Applied to each overflow indicator's icon button */
  overflowIndicatorButton: 'cds-TabsScrollArea-overflowIndicatorButton',
  /** Applied to each overflow indicator's icon button container */
  overflowIndicatorButtonContainer: 'cds-TabsScrollArea-overflowIndicatorButtonContainer',
  /** Applied to each overflow indicator's gradient */
  overflowIndicatorGradient: 'cds-TabsScrollArea-overflowIndicatorGradient',
} as const;

export type TabsScrollAreaBaseProps = Omit<BoxBaseProps, 'children' | 'style'> &
  Pick<SharedAccessibilityProps, 'id' | 'accessibilityLabelId' | 'accessibilityDescriptionId'> & {
    previousArrowAccessibilityLabel?: string;
    nextArrowAccessibilityLabel?: string;
    /**
     * Horizontal offset when auto-scrolling to the active tab (e.g. so the active tab is not under a paddle).
     * @default 50
     */
    autoScrollOffset?: number;
    /**
     * Passed to the {@link TabsScrollAreaOverflowIndicator} to render compact sub-components (`IconButton` `compact`).
     */
    compact?: boolean;
    /**
     * Component rendered at each end when content overflows (left / right). Defaults to
     * {@link TabsScrollAreaOverflowIndicator}. Props must extend {@link TabsScrollAreaOverflowIndicatorProps}.
     */
    OverflowIndicatorComponent?: React.FC<TabsScrollAreaOverflowIndicatorProps>;
  };

export type TabsScrollAreaProps = TabsScrollAreaBaseProps &
  StylesAndClassNames<typeof tabsScrollAreaClassNames> & {
    /**
     * Render function that receives `onActiveTabElementChange` (wire to `Tabs` as `onActiveTabElementChange`).
     */
    children: (props: TabsScrollAreaRenderProps) => React.ReactNode;
    /** Merged with the root `HStack`. */
    style?: React.CSSProperties;
    /** Merged with the root `HStack`. */
    className?: string;
  };

const containerCss = css`
  isolation: isolate;
`;

const scrollContainerCss = css`
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`;
export const TabsScrollArea = memo(function TabsScrollArea(_props: TabsScrollAreaProps) {
  const mergedProps = useComponentConfig('TabsScrollArea', _props);
  const {
    children,
    position = 'relative',
    testID,
    width = '100%',
    previousArrowAccessibilityLabel = 'Previous',
    nextArrowAccessibilityLabel = 'Next',
    autoScrollOffset = 50,
    compact,
    OverflowIndicatorComponent = TabsScrollAreaOverflowIndicator,
    style,
    styles,
    className,
    classNames,
    ...props
  } = mergedProps;

  if (typeof children !== 'function') {
    throw new Error('TabsScrollArea expects a function child `(props) => <Tabs ... />`.');
  }

  const [scrollTarget, setScrollTarget] = useState<HTMLElement | null>(null);
  const { scrollRef, isScrollContentOffscreenLeft, isScrollContentOffscreenRight, handleScroll } =
    useHorizontalScrollToTarget({ activeTarget: scrollTarget, autoScrollOffset });

  const handleScrollLeft = useCallback(() => {
    scrollRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  }, [scrollRef]);

  const handleScrollRight = useCallback(() => {
    if (!scrollRef.current) return;
    const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({ left: maxScroll, behavior: 'smooth' });
  }, [scrollRef]);

  const renderedChildren = useMemo(() => {
    if (typeof children === 'function') {
      return children({ onActiveTabElementChange: setScrollTarget });
    }
    console.warn(
      'TabsScrollArea expects a function child `({ onActiveTabElementChange }) => <Tabs onActiveTabElementChange={onActiveTabElementChange} {...} />`.',
    );
    return null;
  }, [children]);

  const overflowIndicatorClassNames = useMemo(
    () => ({
      root: cx(tabsScrollAreaClassNames.overflowIndicator, classNames?.overflowIndicator),
      button: cx(
        tabsScrollAreaClassNames.overflowIndicatorButton,
        classNames?.overflowIndicatorButton,
      ),
      buttonContainer: cx(
        tabsScrollAreaClassNames.overflowIndicatorButtonContainer,
        classNames?.overflowIndicatorButtonContainer,
      ),
      gradient: cx(
        tabsScrollAreaClassNames.overflowIndicatorGradient,
        classNames?.overflowIndicatorGradient,
      ),
    }),
    [
      classNames?.overflowIndicator,
      classNames?.overflowIndicatorButton,
      classNames?.overflowIndicatorButtonContainer,
      classNames?.overflowIndicatorGradient,
    ],
  );

  const overflowIndicatorStyles = useMemo(
    () => ({
      root: styles?.overflowIndicator,
      button: styles?.overflowIndicatorButton,
      buttonContainer: styles?.overflowIndicatorButtonContainer,
      gradient: styles?.overflowIndicatorGradient,
    }),
    [
      styles?.overflowIndicator,
      styles?.overflowIndicatorButton,
      styles?.overflowIndicatorButtonContainer,
      styles?.overflowIndicatorGradient,
    ],
  );

  return (
    <HStack
      alignItems="center"
      className={cx(containerCss, tabsScrollAreaClassNames.root, className, classNames?.root)}
      position={position}
      style={{ ...style, ...styles?.root }}
      testID={testID}
      width={width}
      {...props}
    >
      <OverflowIndicatorComponent
        accessibilityLabel={previousArrowAccessibilityLabel}
        classNames={overflowIndicatorClassNames}
        compact={compact}
        direction="left"
        onClick={handleScrollLeft}
        show={isScrollContentOffscreenLeft}
        styles={overflowIndicatorStyles}
      />
      <HStack
        ref={scrollRef}
        alignItems="center"
        className={cx(
          scrollContainerCss,
          tabsScrollAreaClassNames.scrollContainer,
          classNames?.scrollContainer,
        )}
        minWidth={0}
        onScroll={handleScroll}
        overflow="auto"
        style={styles?.scrollContainer}
      >
        {renderedChildren}
      </HStack>
      <OverflowIndicatorComponent
        accessibilityLabel={nextArrowAccessibilityLabel}
        classNames={overflowIndicatorClassNames}
        compact={compact}
        direction="right"
        onClick={handleScrollRight}
        show={isScrollContentOffscreenRight}
        styles={overflowIndicatorStyles}
      />
    </HStack>
  );
});

TabsScrollArea.displayName = 'TabsScrollArea';
