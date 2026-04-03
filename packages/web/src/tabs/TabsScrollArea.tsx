import React, { memo, useCallback, useMemo, useState } from 'react';
import type { SharedAccessibilityProps } from '@coinbase/cds-common';
import { css } from '@linaria/core';

import { cx } from '../cx';
import { useComponentConfig } from '../hooks/useComponentConfig';
import { useHorizontalScrollToTarget } from '../hooks/useHorizontalScrollToTarget';
import { HStack } from '../layout';
import type { BoxBaseProps } from '../layout/Box';

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

export type TabsScrollAreaBaseProps = Omit<BoxBaseProps, 'children' | 'style'> &
  Pick<SharedAccessibilityProps, 'id' | 'accessibilityLabelId' | 'accessibilityDescriptionId'> & {
    /**
     * Render function that receives `onActiveTabElementChange` (wire to `Tabs` as `onActiveTabElementChange`).
     */
    children: (props: TabsScrollAreaRenderProps) => React.ReactNode;
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

export type TabsScrollAreaProps = TabsScrollAreaBaseProps & {
  /** Merged with the root `HStack`. */
  style?: React.CSSProperties;
  /** Merged with the root `HStack`. */
  className?: string;
  styles?: {
    /** Root layout element */
    root?: React.CSSProperties;
    /** Horizontal scroll region wrapping `Tabs` */
    scrollContainer?: React.CSSProperties;
    /** Applied to each overflow indicator's root (`style` / `className` on the rendered component) */
    overflowIndicator?: React.CSSProperties;
    overflowIndicatorButton?: React.CSSProperties;
    overflowIndicatorButtonContainer?: React.CSSProperties;
    overflowIndicatorGradient?: React.CSSProperties;
  };
  classNames?: {
    root?: string;
    /** Horizontal scroll region wrapping `Tabs` */
    scrollContainer?: string;
    /** Applied to each overflow indicator's root */
    overflowIndicator?: string;
    /** Applied to each overflow indicator's icon button */
    overflowIndicatorButton?: string;
    /** Applied to each overflow indicator's icon button container */
    overflowIndicatorButtonContainer?: string;
    /** Applied to each overflow indicator's gradient */
    overflowIndicatorGradient?: string;
  };
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
    styles: {
      root: rootStyle,
      scrollContainer: scrollContainerStyle,
      overflowIndicator: overflowIndicatorStyle,
      overflowIndicatorButton: overflowIndicatorButtonStyle,
      overflowIndicatorButtonContainer: overflowIndicatorButtonContainerStyle,
      overflowIndicatorGradient: overflowIndicatorGradientStyle,
    } = {},
    className,
    classNames: {
      root: rootClassName,
      scrollContainer: scrollContainerClassName,
      overflowIndicator: overflowIndicatorClassName,
      overflowIndicatorButton: overflowIndicatorButtonClassName,
      overflowIndicatorButtonContainer: overflowIndicatorButtonContainerClassName,
      overflowIndicatorGradient: overflowIndicatorGradientClassName,
    } = {},
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
      root: overflowIndicatorClassName,
      button: overflowIndicatorButtonClassName,
      buttonContainer: overflowIndicatorButtonContainerClassName,
      gradient: overflowIndicatorGradientClassName,
    }),
    [
      overflowIndicatorClassName,
      overflowIndicatorButtonClassName,
      overflowIndicatorButtonContainerClassName,
      overflowIndicatorGradientClassName,
    ],
  );

  const overflowIndicatorStyles = useMemo(
    () => ({
      root: overflowIndicatorStyle,
      button: overflowIndicatorButtonStyle,
      buttonContainer: overflowIndicatorButtonContainerStyle,
      gradient: overflowIndicatorGradientStyle,
    }),
    [
      overflowIndicatorStyle,
      overflowIndicatorButtonStyle,
      overflowIndicatorButtonContainerStyle,
      overflowIndicatorGradientStyle,
    ],
  );

  return (
    <HStack
      alignItems="center"
      className={cx(containerCss, className, rootClassName)}
      position={position}
      style={{ ...style, ...rootStyle }}
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
        className={cx(scrollContainerCss, scrollContainerClassName)}
        minWidth={0}
        onScroll={handleScroll}
        overflow="auto"
        style={scrollContainerStyle}
      >
        {renderedChildren}
      </HStack>
      <OverflowIndicatorComponent
        accessibilityLabel={nextArrowAccessibilityLabel}
        className={overflowIndicatorClassName}
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
