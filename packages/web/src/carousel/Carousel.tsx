import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRefMap } from '@coinbase/cds-common/hooks/useRefMap';
import { RefMapContext } from '@coinbase/cds-common/system/RefMapContext';
import type { Rect, SharedAccessibilityProps, SharedProps } from '@coinbase/cds-common/types';
import { css } from '@linaria/core';
import {
  animate,
  domMax,
  LazyMotion,
  m,
  useAnimation,
  useDragControls,
  useMotionValue,
  useTransform,
} from 'framer-motion';

import { cx } from '../cx';
import { type BoxBaseProps, type BoxDefaultElement, type BoxProps } from '../layout/Box';
import { HStack } from '../layout/HStack';
import { VStack } from '../layout/VStack';
import { Text } from '../typography';

import { CarouselContext, type CarouselContextValue, useCarouselContext } from './CarouselContext';
import { CarouselItem } from './CarouselItem';
import { DefaultCarouselNavigation } from './DefaultCarouselNavigation';
import { DefaultCarouselPagination } from './DefaultCarouselPagination';

const defaultCarouselCss = css`
  & img {
    pointer-events: none;
  }
`;

export type CarouselItemRenderChildren = React.FC<{ isVisible: boolean }>;

export type CarouselItemBaseProps = Omit<BoxBaseProps, 'children'> & {
  /**
   * Unique identifier for this carousel item.
   */
  id: string;
  /**
   * Component to render as the carousel item content.
   * Can be a React node or a function that receives the visibility state.
   */
  children?: CarouselItemRenderChildren | React.ReactNode;
};

export type CarouselItemProps = Omit<BoxProps<BoxDefaultElement>, 'children'> &
  CarouselItemBaseProps;

export type CarouselItemComponent = React.FC<CarouselItemProps>;
export type CarouselItemElement = React.ReactElement<CarouselItemProps, CarouselItemComponent>;

export { CarouselContext, useCarouselContext };
export type { CarouselContextValue };

export type CarouselNavigationComponentBaseProps = {
  /**
   * Callback for when the previous button is pressed.
   */
  onGoPrevious?: () => void;
  /**
   * Callback for when the next button is pressed.
   */
  onGoNext?: () => void;
  /**
   * Whether the previous button is disabled.
   */
  disableGoPrevious?: boolean;
  /**
   * Whether the next button is disabled.
   */
  disableGoNext?: boolean;
  /**
   * Accessibility label for the next page button.
   */
  nextPageAccessibilityLabel?: string;
  /**
   * Accessibility label for the previous page button.
   */
  previousPageAccessibilityLabel?: string;
  /**
   * Whether autoplay is enabled.
   */
  autoplay?: boolean;
  /**
   * Whether the carousel is currently playing.
   */
  isPlaying?: boolean;
  /**
   * Callback to toggle play/pause state.
   */
  onTogglePlayPause?: () => void;
  /**
   * Accessibility label for the play button.
   */
  playAccessibilityLabel?: string;
  /**
   * Accessibility label for the pause button.
   */
  pauseAccessibilityLabel?: string;
};

export type CarouselNavigationComponentProps = CarouselNavigationComponentBaseProps & {
  /**
   * Custom class name for the component.
   */
  className?: string;
  /**
   * Custom styles for the component.
   */
  style?: React.CSSProperties;
};

export type CarouselNavigationComponent = React.FC<CarouselNavigationComponentProps>;

export type CarouselPaginationComponentBaseProps = {
  /**
   * Total number of pages.
   */
  totalPages: number;
  /**
   * Index of the active page.
   */
  activePageIndex: number;
  /**
   * Callback for when a page is clicked.
   */
  onClickPage?: (index: number) => void;
  /**
   * Accessibility label for the go to page button. You can optionally pass a function that will receive the pageIndex as an argument, and return an accessibility label string.
   */
  paginationAccessibilityLabel?: string | ((pageIndex: number) => string);
  /**
   * Whether autoplay is enabled.
   */
  autoplay?: boolean;
  /**
   * Progress of the current autoplay cycle (0-1).
   */
  autoplayProgress?: number;
};

export type CarouselPaginationComponentProps = CarouselPaginationComponentBaseProps & {
  /**
   * Custom class name for the root element.
   */
  className?: string;
  /**
   * Custom styles for the component.
   */
  style?: React.CSSProperties;
};

export type CarouselPaginationComponent = React.FC<CarouselPaginationComponentProps>;

export type CarouselImperativeHandle = {
  /**
   * The currently active page index.
   */
  activePageIndex: number;
  /**
   * The total number of pages.
   */
  totalPages: number;
  /**
   * Navigate to a specific page by index.
   */
  goToPage: (pageIndex: number) => void;
};

export type CarouselBaseProps = SharedProps &
  SharedAccessibilityProps &
  BoxBaseProps & {
    /**
     * Children are required to be CarouselItems because we calculate
     * their offset relative to the parent container.
     */
    children?: CarouselItemElement | CarouselItemElement[];
    /**
     * Defines the drag interaction behavior for the carousel.
     * 'none' disables dragging completely.
     * 'free' enables free-form dragging with natural deceleration when released.
     * 'snap' enables dragging with automatic snapping to targets when released,
     * defined by snapMode.
     * @default 'snap'
     */
    drag?: 'none' | 'free' | 'snap';
    /**
     * Specifies the pagination and navigation strategy for the carousel.
     * 'item' treats each item as a separate page for navigation, pagination, and snapping.
     * 'page' groups items into pages based on visible area for navigation, pagination, and snapping.
     * This affects page calculation, navigation button behavior, and snap targets when dragging.
     * @default 'page'
     */
    snapMode?: 'item' | 'page';
    /**
     * Hides the navigation arrows (previous/next buttons).
     */
    hideNavigation?: boolean;
    /**
     * Hides the pagination indicators (dots/bars showing current page).
     */
    hidePagination?: boolean;
    /**
     * Custom component to render navigation arrows.
     * @default DefaultCarouselNavigation
     */
    NavigationComponent?: CarouselNavigationComponent;
    /**
     * Custom component to render pagination indicators.
     * @default DefaultCarouselPagination
     */
    PaginationComponent?: CarouselPaginationComponent;
    /**
     * Title to display above the carousel.
     * When a string is provided, it will be rendered with default title styling.
     * When a React element is provided, it completely replaces the default title component
     * and styling.
     */
    title?: React.ReactNode;
    /**
     * Accessibility label for the next page button.
     */
    nextPageAccessibilityLabel?: string;
    /**
     * Accessibility label for the previous page button.
     */
    previousPageAccessibilityLabel?: string;
    /**
     * Accessibility label for the go to page button.
     */
    paginationAccessibilityLabel?: string | ((pageIndex: number) => string);
    /**
     * Callback fired when the carousel page changes.
     */
    onChangePage?: (activePageIndex: number) => void;
    /**
     * Callback fired when the user starts dragging the carousel.
     */
    onDragStart?: () => void;
    /**
     * Callback fired when the user ends dragging the carousel.
     */
    onDragEnd?: () => void;
    /**
     * Enables infinite looping. When true, the carousel will seamlessly
     * loop from the last item back to the first.
     * @note Requires at least 2 pages worth of content to function.
     */
    loop?: boolean;
    /**
     * Enables autoplay functionality. When true, the carousel will automatically
     * advance to the next page at the interval specified by autoplayInterval.
     */
    autoplay?: boolean;
    /**
     * The interval in milliseconds between automatic page transitions.
     * @note only applies when autoplay is enabled.
     * @default 3000
     */
    autoplayInterval?: number;
    /**
     * Accessibility label for the play button.
     */
    playAccessibilityLabel?: string;
    /**
     * Accessibility label for the pause button.
     */
    pauseAccessibilityLabel?: string;
  };

export type CarouselProps = Omit<BoxProps<BoxDefaultElement>, 'title'> &
  CarouselBaseProps & {
    /**
     * Custom class name for the root element.
     */
    className?: string;
    /**
     * Custom class names for the component.
     */
    classNames?: {
      /**
       * Custom class name for the root element.
       */
      root?: string;
      /**
       * Custom class name for the title element.
       */
      title?: string;
      /**
       * Custom class name for the navigation element.
       */
      navigation?: string;
      /**
       * Custom class name for the pagination element.
       */
      pagination?: string;
      /**
       * Custom class name for the main carousel element.
       */
      carousel?: string;
      /**
       * Custom class name for the outer carousel container element.
       */
      carouselContainer?: string;
    };
    /**
     * Custom styles for the root element.
     */
    style?: React.CSSProperties;
    /**
     * Custom styles for the component.
     */
    styles?: {
      /**
       * Custom styles for the root element.
       */
      root?: React.CSSProperties;
      /**
       * Custom styles for the title element.
       */
      title?: React.CSSProperties;
      /**
       * Custom styles for the navigation element.
       */
      navigation?: React.CSSProperties;
      /**
       * Custom styles for the pagination element.
       */
      pagination?: React.CSSProperties;
      /**
       * Custom styles for the main carousel element.
       */
      carousel?: React.CSSProperties;
      /**
       * Custom styles for the outer carousel container element.
       */
      carouselContainer?: React.CSSProperties;
    };
  };

/**
 * Wraps a value within a range (min, max) for circular indexing.
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range (exclusive).
 * @param value - The value to wrap.
 * @returns The wrapped value within the range.
 */
const wrap = (min: number, max: number, value: number): number => {
  const range = max - min;
  return min + ((((value - min) % range) + range) % range);
};

/**
 * Calculates the locations of each item in the carousel, offset from the first item.
 * @param itemRects - The items to get the offsets for.
 * @returns The item offsets.
 */
const getItemOffsets = (itemRects: { [itemId: string]: Rect }) => {
  // Filter out clone items (they have IDs starting with "clone-")
  const originalItems = Object.entries(itemRects)
    .filter(([id]) => !id.startsWith('clone-'))
    .map(([, rect]) => rect);

  if (originalItems.length === 0) return [];

  const sortedItems = originalItems.sort((a, b) => a.x - b.x);

  const initialItemOffset = sortedItems[0].x;
  return sortedItems.map((item) => ({
    ...item,
    x: item.x - initialItemOffset,
  }));
};

/**
 * Calculates the nearest page index from a given scroll offset.
 * @param scrollOffset - The scroll offset.
 * @param pageOffsets - The page offsets.
 * @returns The nearest page index.
 */
const getNearestPageIndexFromOffset = (scrollOffset: number, pageOffsets: number[]) => {
  let closestPageIndex = 0;
  let closestDistance = Infinity;
  pageOffsets.forEach((pageOffset, index) => {
    const distance = Math.abs(scrollOffset - pageOffset);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestPageIndex = index;
    }
  });
  return closestPageIndex;
};

/**
 * Finds the nearest offset from a set of candidate offsets, considering loop cycles.
 * Checks current, previous, and next cycles to find the shortest path.
 * @param currentOffset - The current scroll offset.
 * @param candidateOffsets - Array of candidate offsets within a single loop cycle.
 * @param loopLength - The total length of one loop cycle.
 * @returns The nearest offset and its index in the candidates array.
 */
const findNearestLoopOffset = (
  currentOffset: number,
  candidateOffsets: number[],
  loopLength: number,
): { offset: number; index: number } => {
  const currentCycle = Math.floor(currentOffset / loopLength);
  let nearest = { offset: 0, index: 0, distance: Infinity };

  for (const [index, candidateOffset] of candidateOffsets.entries()) {
    for (const cycle of [currentCycle - 1, currentCycle, currentCycle + 1]) {
      const cycleOffset = cycle * loopLength + candidateOffset;
      const distance = Math.abs(currentOffset - cycleOffset);
      if (distance < nearest.distance) {
        nearest = { offset: cycleOffset, index, distance };
      }
    }
  }

  return { offset: nearest.offset, index: nearest.index };
};

/**
 * Calculates the offsets for a given set of items grouped by item.
 * @note when looping, all items have a page offset, otherwise we find
 * the last item that can start a page and still show all remaining items.
 * @param items - The items to get the page offsets for.
 * @param containerWidth - The width of the container.
 * @param maxScrollOffset - The maximum scroll offset.
 * @param loop - Whether looping is enabled.
 * @returns The page offsets and the total number of pages.
 */
const getSnapItemPageOffsets = (
  items: Rect[],
  containerWidth: number,
  maxScrollOffset: number,
  loop?: boolean,
): { totalPages: number; pageOffsets: number[] } => {
  if (loop) {
    const offsets: number[] = [];
    for (let i = 0; i < items.length; i++) {
      offsets.push(items[i].x);
    }
    return { totalPages: offsets.length, pageOffsets: offsets };
  }

  let lastPageStartIndex = items.length - 1;
  const lastItem = items[lastPageStartIndex];
  const lastItemsEndPosition = lastItem.x + lastItem.width;

  // Find the last item that can start a page and still show all remaining items
  let i = lastPageStartIndex;
  let viewportEndIfStartingAtThisItem = lastItem.x + containerWidth;
  while (i >= 0 && viewportEndIfStartingAtThisItem >= lastItemsEndPosition) {
    lastPageStartIndex = i;
    i--;
    if (i >= 0) {
      viewportEndIfStartingAtThisItem = items[i].x + containerWidth;
    }
  }

  // Create pages - each item before lastPageStartIndex gets its own page
  const offsets: number[] = [];

  for (let i = 0; i < lastPageStartIndex; i++) {
    const item = items[i];
    const offset = Math.min(item.x, maxScrollOffset);
    offsets.push(offset);
  }

  // Add the final page that shows all remaining items
  const lastPageItem = items[lastPageStartIndex];
  const lastPageOffset = Math.min(lastPageItem.x, maxScrollOffset);
  offsets.push(lastPageOffset);

  return { totalPages: offsets.length, pageOffsets: offsets };
};

/**
 * Calculates the offsets for a given set of items grouped by page.
 * @param items - The items to get the page offsets for.
 * @param containerWidth - The width of the container.
 * @param maxScrollOffset - The maximum scroll offset.
 * @returns The page offsets and the total number of pages.
 */
const getSnapPageOffsets = (
  items: Rect[],
  containerWidth: number,
  maxScrollOffset: number,
): { totalPages: number; pageOffsets: number[] } => {
  // Find natural page breaks based on what fits in viewport
  const offsets = [0];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    // Calculate the current viewport boundaries based on the last page offset
    const currentViewportStart = offsets[offsets.length - 1];
    const currentViewportEnd = currentViewportStart + containerWidth;

    // If this item extends beyond current viewport, we need a new page
    if (item.x + item.width > currentViewportEnd && item.x !== currentViewportStart) {
      /**
       * Clamp it to the max scroll offset in cases where the start of the item
       * is greater than the max we would need to scroll to show all items.
       */
      const clampedOffset = Math.min(item.x, maxScrollOffset);
      offsets.push(clampedOffset);
    }
  }

  return { totalPages: offsets.length, pageOffsets: offsets };
};

/**
 * Clamps an offset value with elastic resistance.
 * @param offset - The offset to clamp.
 * @param maxScrollOffset - The maximum offset.
 * @param elasticAmount - The amount of elastic resistance to apply (0 - 1), defaults to 0.5.
 * @returns The clamped offset.
 */
const clampWithElasticResistance = (
  offset: number,
  maxScrollOffset: number,
  elasticAmount = 0.5,
): number => {
  if (offset < 0) {
    return offset * elasticAmount;
  } else if (offset > maxScrollOffset) {
    const overScroll = offset - maxScrollOffset;
    return maxScrollOffset + overScroll * elasticAmount;
  }
  return offset;
};

/**
 * Calculates how many items need to be cloned for looping to fill the viewport.
 * For backward clones, pass the items array reversed.
 * @param items - The item rects sorted by position (or reversed for backward clones).
 * @param containerWidth - The width of the container viewport.
 * @returns The number of items to clone.
 */
const getCloneCount = (items: Rect[], containerWidth: number): number => {
  let widthSum = 0;
  let count = 0;

  for (const item of items) {
    widthSum += item.width;
    count++;
    if (widthSum >= containerWidth) break;
  }

  return Math.max(1, count);
};

/**
 * Calculates which items are visible in the carousel based on scroll offset and viewport.
 * @param itemRects - The items to get the visibility for.
 * @param containerWidth - The width of the container viewport.
 * @param scrollOffset - The current scroll offset (positive value).
 * @returns Set of visible item IDs.
 */
const getVisibleItems = (
  itemRects: { [itemId: string]: Rect },
  containerWidth: number,
  scrollOffset: number,
): Set<string> => {
  const visibleItems = new Set<string>();

  const viewportLeft = scrollOffset;
  const viewportRight = scrollOffset + containerWidth;

  Object.entries(itemRects).forEach(([itemId, rect]) => {
    const itemLeft = rect.x;
    const itemRight = rect.x + rect.width;

    const isVisible = itemLeft < viewportRight && itemRight > viewportLeft;

    if (isVisible) {
      visibleItems.add(itemId);
    }
  });

  return visibleItems;
};

export const Carousel = memo(
  forwardRef<CarouselImperativeHandle, CarouselProps>(
    (
      {
        children,
        title,
        hideNavigation,
        hidePagination,
        drag = 'snap',
        snapMode = 'page',
        NavigationComponent = DefaultCarouselNavigation,
        PaginationComponent = DefaultCarouselPagination,
        className,
        classNames,
        style,
        styles,
        nextPageAccessibilityLabel,
        previousPageAccessibilityLabel,
        paginationAccessibilityLabel,
        onChangePage,
        onDragStart,
        onDragEnd,
        loop,
        autoplay = false,
        autoplayInterval = 3000,
        playAccessibilityLabel,
        pauseAccessibilityLabel,
        ...props
      }: CarouselProps,
      ref: React.ForwardedRef<CarouselImperativeHandle>,
    ) => {
      const animationApi = useAnimation();
      const carouselScrollX = useMotionValue(0);
      const dragControls = useDragControls();

      const [activePageIndex, setActivePageIndex] = useState(0);
      const containerRef = useRef<HTMLDivElement>(null);
      const rootRef = useRef<HTMLDivElement>(null);
      const [containerWidth, setContainerWidth] = useState(0);
      const carouselItemRefMap = useRefMap<HTMLElement>();
      const [carouselItemRects, setCarouselItemRects] = useState<{
        [itemId: string]: Rect;
      }>({});
      const [visibleCarouselItems, setVisibleCarouselItems] = useState<Set<string>>(new Set());

      // Autoplay state
      const [isPlaying, setIsPlaying] = useState(autoplay);
      const [autoplayProgress, setAutoplayProgress] = useState(0);
      const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
      const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
      const autoplayRafRef = useRef<number | null>(null);
      const remainingTimeRef = useRef(autoplayInterval);
      const lastStartTimeRef = useRef<number | null>(null);
      const isTransitioningRef = useRef(false);
      const activePageIndexRef = useRef(activePageIndex);
      // Stores the remaining time at the start of the current countdown (for progress calculation)
      const countdownStartRemainingRef = useRef(autoplayInterval);

      // Keep ref in sync with state
      activePageIndexRef.current = activePageIndex;

      const isDragEnabled = drag !== 'none';

      useEffect(() => {
        const observer = new window.ResizeObserver(() => {
          const newRects: { [itemId: string]: Rect } = {};
          Object.entries(carouselItemRefMap.refs).forEach(([id, element]) => {
            if (element) {
              newRects[id] = {
                x: element.offsetLeft,
                y: element.offsetTop,
                width: element.offsetWidth,
                height: element.offsetHeight,
              };
            }
          });
          setCarouselItemRects(newRects);
        });

        Object.values(carouselItemRefMap.refs).forEach((element) => {
          if (element) observer.observe(element);
        });

        if (
          Object.keys(carouselItemRefMap.refs).length === 0 ||
          Object.values(carouselItemRefMap.refs).every((element) => element === null)
        ) {
          setCarouselItemRects({});
        }

        return () => observer.disconnect();
      }, [carouselItemRefMap.refs, children]);

      const contentWidth = useMemo(() => {
        if (Object.keys(carouselItemRects).length === 0) return 0;
        const items = getItemOffsets(carouselItemRects);
        const lastItem = items[items.length - 1];
        return lastItem.x + lastItem.width;
      }, [carouselItemRects]);

      const maxScrollOffset = Math.max(0, contentWidth - containerWidth);
      const hasDimensions = contentWidth > 0 && containerWidth > 0;

      // Calculate gap between items (needed for loopLength to maintain consistent spacing at wrap seam)
      const gap = useMemo(() => {
        if (Object.keys(carouselItemRects).length < 2) return 0;
        const items = getItemOffsets(carouselItemRects);
        const firstItemEnd = items[0].x + items[0].width;
        const secondItemStart = items[1].x;
        return Math.max(0, secondItemStart - firstItemEnd);
      }, [carouselItemRects]);

      const shouldLoop = useMemo(
        () => loop && hasDimensions && maxScrollOffset > 0,
        [loop, hasDimensions, maxScrollOffset],
      );

      const loopLength = useMemo(() => {
        if (!shouldLoop) return 0;
        return contentWidth + gap;
      }, [shouldLoop, contentWidth, gap]);

      const isLoopingActive = shouldLoop && loopLength > 0;

      // Derived transform: physics (carouselScrollX) can go to ±∞, visuals (wrappedX) stay bounded
      const wrappedX = useTransform(carouselScrollX, (value) => {
        if (!shouldLoop || !loopLength) return value;
        const wrapped = value % loopLength;
        return wrapped > 0 ? wrapped - loopLength : wrapped;
      });

      const updateActivePageIndex = useCallback(
        (newPageIndexOrUpdater: number | ((prevIndex: number) => number)) => {
          setActivePageIndex((prevIndex) => {
            const newPageIndex =
              typeof newPageIndexOrUpdater === 'function'
                ? newPageIndexOrUpdater(prevIndex)
                : newPageIndexOrUpdater;

            if (prevIndex !== newPageIndex && onChangePage) {
              onChangePage(newPageIndex);
            }

            return newPageIndex;
          });
        },
        [onChangePage],
      );

      // Calculate how many items to clone for each direction (enough to fill viewport)
      const cloneCounts = useMemo(() => {
        if (!shouldLoop || Object.keys(carouselItemRects).length === 0 || containerWidth === 0) {
          return { forward: 0, backward: 0 };
        }
        const items = getItemOffsets(carouselItemRects);
        return {
          forward: getCloneCount(items, containerWidth),
          backward: getCloneCount([...items].reverse(), containerWidth),
        };
      }, [shouldLoop, carouselItemRects, containerWidth]);

      const updateVisibleCarouselItems = useCallback(
        (localScrollOffset: number) => {
          if (containerWidth === 0) {
            setVisibleCarouselItems(new Set());
            return;
          }

          // For original items: wrap the offset to check visibility within one cycle
          const adjustedOffset = isLoopingActive
            ? ((localScrollOffset % loopLength) + loopLength) % loopLength
            : localScrollOffset;

          const visibleItems = getVisibleItems(carouselItemRects, containerWidth, adjustedOffset);

          // For clones: check visibility against actual (unwrapped) scroll position
          if (isLoopingActive && children) {
            const childrenArray = React.Children.toArray(children) as CarouselItemElement[];
            const items = getItemOffsets(carouselItemRects);
            const viewportLeft = localScrollOffset;
            const viewportRight = localScrollOffset + containerWidth;

            // Check backward clones visibility
            const backwardStartIndex = childrenArray.length - cloneCounts.backward;
            for (let i = 0; i < cloneCounts.backward; i++) {
              const originalIndex = backwardStartIndex + i;
              const itemData = items[originalIndex];
              if (itemData) {
                const cloneX = itemData.x - loopLength;
                const cloneRight = cloneX + itemData.width;
                if (cloneX < viewportRight && cloneRight > viewportLeft) {
                  visibleItems.add(`clone-backward-${childrenArray[originalIndex].props.id}`);
                }
              }
            }

            // Check forward clones visibility
            for (let i = 0; i < cloneCounts.forward; i++) {
              const itemData = items[i];
              if (itemData) {
                const cloneX = itemData.x + loopLength;
                const cloneRight = cloneX + itemData.width;
                if (cloneX < viewportRight && cloneRight > viewportLeft) {
                  visibleItems.add(`clone-forward-${childrenArray[i].props.id}`);
                }
              }
            }
          }

          setVisibleCarouselItems(visibleItems);
        },
        [
          containerWidth,
          isLoopingActive,
          loopLength,
          carouselItemRects,
          children,
          cloneCounts.backward,
          cloneCounts.forward,
        ],
      );

      useEffect(() => {
        const element = containerRef.current;
        if (!element) return;
        const observer = new window.ResizeObserver((entries) => {
          for (const entry of entries) {
            setContainerWidth(entry.contentRect.width);
            updateVisibleCarouselItems(Math.abs(carouselScrollX.get()));
          }
        });
        observer.observe(element);
        return () => observer.unobserve(element);
      }, [carouselItemRects, carouselScrollX, updateVisibleCarouselItems]);

      const childrenWithClones = useMemo(() => {
        if (!shouldLoop || !loopLength || !children) return children;
        if (cloneCounts.forward === 0 && cloneCounts.backward === 0) return children;

        const childrenArray = React.Children.toArray(children) as CarouselItemElement[];
        if (childrenArray.length === 0) return children;

        const result: React.ReactNode[] = [];
        const items = getItemOffsets(carouselItemRects);

        // Add backward clones (absolutely positioned before original items)
        const itemsToCloneBackward = childrenArray.slice(-cloneCounts.backward);
        itemsToCloneBackward.forEach((child, cloneIndex) => {
          const originalIndex = childrenArray.length - cloneCounts.backward + cloneIndex;
          const itemData = items[originalIndex];
          const cloneId = `clone-backward-${child.props.id}`;
          result.push(
            <CarouselItem
              key={cloneId}
              aria-hidden
              id={cloneId}
              style={{
                position: 'absolute',
                left: (itemData?.x ?? 0) - loopLength,
                width: itemData?.width,
                height: itemData?.height,
                ...(child.props.style as React.CSSProperties),
              }}
            >
              {child.props.children}
            </CarouselItem>,
          );
        });

        // Add original items (in flex flow, normal positions)
        result.push(...childrenArray);

        // Add forward clones (in flex flow after original items)
        const itemsToCloneForward = childrenArray.slice(0, cloneCounts.forward);
        itemsToCloneForward.forEach((child, cloneIndex) => {
          const itemData = items[cloneIndex];
          const cloneId = `clone-forward-${child.props.id}`;
          result.push(
            <CarouselItem
              key={cloneId}
              aria-hidden
              id={cloneId}
              style={{
                width: itemData?.width,
                height: itemData?.height,
                ...(child.props.style as React.CSSProperties),
              }}
            >
              {child.props.children}
            </CarouselItem>,
          );
        });

        return result;
      }, [shouldLoop, loopLength, children, carouselItemRects, cloneCounts]);

      // Calculate pages and their offsets based on snapMode
      const { totalPages, pageOffsets } = useMemo(() => {
        if (!hasDimensions || Object.keys(carouselItemRects).length === 0) {
          return { totalPages: 0, pageOffsets: [] };
        }

        let pageOffsets: { totalPages: number; pageOffsets: number[] };

        if (snapMode === 'item') {
          pageOffsets = getSnapItemPageOffsets(
            getItemOffsets(carouselItemRects),
            containerWidth,
            maxScrollOffset,
            shouldLoop,
          );
        } else {
          pageOffsets = getSnapPageOffsets(
            getItemOffsets(carouselItemRects),
            containerWidth,
            maxScrollOffset,
          );
        }

        updateActivePageIndex((pageIndex) => Math.min(pageIndex, pageOffsets.totalPages - 1));

        return pageOffsets;
      }, [
        hasDimensions,
        carouselItemRects,
        snapMode,
        containerWidth,
        maxScrollOffset,
        shouldLoop,
        updateActivePageIndex,
      ]);

      const goToPage = useCallback(
        (page: number, duration = 0.25) => {
          const newPage = Math.max(0, Math.min(totalPages - 1, page));
          updateActivePageIndex(newPage);
          updateVisibleCarouselItems(pageOffsets[newPage]);

          const targetOffset = isLoopingActive
            ? findNearestLoopOffset(-carouselScrollX.get(), [pageOffsets[newPage]], loopLength)
                .offset
            : pageOffsets[newPage];

          animate(carouselScrollX, -targetOffset, { type: 'tween', duration });
        },
        [
          totalPages,
          updateActivePageIndex,
          updateVisibleCarouselItems,
          pageOffsets,
          isLoopingActive,
          carouselScrollX,
          loopLength,
        ],
      );

      useImperativeHandle(
        ref,
        () => ({
          activePageIndex,
          totalPages,
          goToPage,
        }),
        [activePageIndex, totalPages, goToPage],
      );

      // Reset autoplay timer when manually navigating
      const resetAutoplayTimer = useCallback(() => {
        if (autoplay) {
          remainingTimeRef.current = autoplayInterval;
          countdownStartRemainingRef.current = autoplayInterval;
          setAutoplayProgress(0);
          lastStartTimeRef.current = isPlaying ? Date.now() : null;
          isTransitioningRef.current = false;
          // Clear existing timers so it restarts with full interval
          if (autoplayTimerRef.current) {
            clearTimeout(autoplayTimerRef.current);
            autoplayTimerRef.current = null;
          }
          if (animationTimerRef.current) {
            clearTimeout(animationTimerRef.current);
            animationTimerRef.current = null;
          }
        }
      }, [autoplay, autoplayInterval, isPlaying]);

      const handleGoNext = useCallback(() => {
        const nextPage = shouldLoop
          ? wrap(0, totalPages, activePageIndex + 1)
          : activePageIndex + 1;
        goToPage(nextPage);
        resetAutoplayTimer();
      }, [shouldLoop, totalPages, activePageIndex, goToPage, resetAutoplayTimer]);

      const handleGoPrevious = useCallback(() => {
        const prevPage = shouldLoop
          ? wrap(0, totalPages, activePageIndex - 1)
          : activePageIndex - 1;
        goToPage(prevPage);
        resetAutoplayTimer();
      }, [shouldLoop, totalPages, activePageIndex, goToPage, resetAutoplayTimer]);

      // Autoplay toggle function
      const handleTogglePlayPause = useCallback(() => {
        setIsPlaying((prev) => {
          if (prev) {
            // Pausing: calculate remaining time
            if (lastStartTimeRef.current !== null) {
              const elapsed = Date.now() - lastStartTimeRef.current;
              remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
            }
            // Clear timers and reset transition state
            if (autoplayTimerRef.current) {
              clearTimeout(autoplayTimerRef.current);
              autoplayTimerRef.current = null;
            }
            if (animationTimerRef.current) {
              clearTimeout(animationTimerRef.current);
              animationTimerRef.current = null;
            }
            isTransitioningRef.current = false;
            lastStartTimeRef.current = null;
          }
          return !prev;
        });
      }, []);

      // Autoplay progress tracking effect
      useEffect(() => {
        // Only reset progress when autoplay is disabled or not enough pages
        if (!autoplay || totalPages <= 1) {
          setAutoplayProgress(0);
          return;
        }

        // When paused, keep the current progress (don't update or reset)
        if (!isPlaying) {
          return;
        }

        const updateProgress = () => {
          // During page transition animation, keep progress at 0
          if (isTransitioningRef.current) {
            setAutoplayProgress(0);
            autoplayRafRef.current = requestAnimationFrame(updateProgress);
            return;
          }

          if (lastStartTimeRef.current !== null) {
            const elapsed = Date.now() - lastStartTimeRef.current;
            const remainingAtStart = countdownStartRemainingRef.current;
            // Calculate progress: start from where we left off, complete over remaining time
            const startProgress = 1 - remainingAtStart / autoplayInterval;
            // Divide by remainingAtStart (not full interval) so animation completes in time
            const currentProgress =
              startProgress + (elapsed / remainingAtStart) * (1 - startProgress);
            setAutoplayProgress(Math.min(currentProgress, 1));
          }
          autoplayRafRef.current = requestAnimationFrame(updateProgress);
        };

        autoplayRafRef.current = requestAnimationFrame(updateProgress);

        return () => {
          if (autoplayRafRef.current) {
            cancelAnimationFrame(autoplayRafRef.current);
            autoplayRafRef.current = null;
          }
        };
      }, [autoplay, isPlaying, totalPages, autoplayInterval]);

      // Autoplay timer effect
      const autoplayAnimationDuration = 500; // 0.5 second animation
      useEffect(() => {
        if (!autoplay || !isPlaying || totalPages <= 1) {
          return;
        }

        const startTimer = () => {
          // Record the remaining time at start of this countdown for progress calculation
          countdownStartRemainingRef.current = remainingTimeRef.current;
          lastStartTimeRef.current = Date.now();
          autoplayTimerRef.current = setTimeout(() => {
            // Mark that we're transitioning
            isTransitioningRef.current = true;

            // Reset remaining time and progress FIRST before changing page
            remainingTimeRef.current = autoplayInterval;
            setAutoplayProgress(0);

            // Always wrap to first page when at the last page
            // Use ref to avoid stale closure
            const nextPage = wrap(0, totalPages, activePageIndexRef.current + 1);
            // Use slower animation duration
            goToPage(nextPage, autoplayAnimationDuration / 1000);

            // Wait for animation to complete before starting next countdown
            animationTimerRef.current = setTimeout(() => {
              isTransitioningRef.current = false;
              animationTimerRef.current = null;
              // Start next timer
              startTimer();
            }, autoplayAnimationDuration);
          }, remainingTimeRef.current);
        };

        startTimer();

        return () => {
          if (autoplayTimerRef.current) {
            clearTimeout(autoplayTimerRef.current);
            autoplayTimerRef.current = null;
          }
          if (animationTimerRef.current) {
            clearTimeout(animationTimerRef.current);
            animationTimerRef.current = null;
          }
          isTransitioningRef.current = false;
        };
        // Note: activePageIndex intentionally not in deps - we use activePageIndexRef to avoid
        // restarting the timer loop on every page change
      }, [autoplay, isPlaying, totalPages, autoplayInterval, goToPage]);

      // Reset remaining time when autoplayInterval changes
      useEffect(() => {
        remainingTimeRef.current = autoplayInterval;
        setAutoplayProgress(0);
      }, [autoplayInterval]);

      const handleDragTransition = useCallback(
        (targetOffsetScroll: number) => {
          if (drag === 'none') return targetOffsetScroll;

          const targetOffset = -targetOffsetScroll;

          if (isLoopingActive) {
            const { offset: nearestOffset, index: pageIndex } = findNearestLoopOffset(
              targetOffset,
              pageOffsets,
              loopLength,
            );

            updateActivePageIndex(pageIndex);

            if (drag === 'snap') {
              updateVisibleCarouselItems(pageOffsets[pageIndex]);
              return -nearestOffset;
            }

            const currentCycle = Math.floor(targetOffset / loopLength);
            const localOffset = targetOffset - currentCycle * loopLength;
            updateVisibleCarouselItems(localOffset);
            return targetOffsetScroll;
          } else {
            // Non-looping logic with clamping
            const clampedScrollOffset = clampWithElasticResistance(
              targetOffset,
              maxScrollOffset,
              0,
            );
            const closestPageIndex = getNearestPageIndexFromOffset(
              clampedScrollOffset,
              pageOffsets,
            );
            updateActivePageIndex(closestPageIndex);

            if (drag === 'snap') {
              const snapOffset = pageOffsets[closestPageIndex];
              updateVisibleCarouselItems(snapOffset);
              return -snapOffset;
            }

            updateVisibleCarouselItems(clampedScrollOffset);
            return targetOffsetScroll;
          }
        },
        [
          drag,
          isLoopingActive,
          pageOffsets,
          loopLength,
          updateActivePageIndex,
          updateVisibleCarouselItems,
          maxScrollOffset,
        ],
      );

      const handleDragStart = useCallback(() => {
        onDragStart?.();
      }, [onDragStart]);

      const handleDragEnd = useCallback(() => {
        onDragEnd?.();
        resetAutoplayTimer();
      }, [onDragEnd, resetAutoplayTimer]);

      const handleClickPage = useCallback(
        (page: number) => {
          goToPage(page);
          resetAutoplayTimer();
        },
        [goToPage, resetAutoplayTimer],
      );

      const carouselContextValue = useMemo(
        () => ({
          visibleCarouselItems,
          autoplay,
          isPlaying,
          onTogglePlayPause: handleTogglePlayPause,
          autoplayProgress,
        }),
        [visibleCarouselItems, autoplay, isPlaying, handleTogglePlayPause, autoplayProgress],
      );

      return (
        <LazyMotion features={domMax}>
          <RefMapContext.Provider value={carouselItemRefMap}>
            <VStack
              ref={rootRef}
              aria-live="polite"
              aria-roledescription="carousel"
              className={cx(className, classNames?.root)}
              gap={2}
              role="group"
              style={{ overflow: 'hidden', ...style, ...styles?.root }}
              width="100%"
              {...props}
            >
              {(title || !hideNavigation) && (
                <HStack alignItems="center" justifyContent={title ? 'space-between' : 'flex-end'}>
                  {typeof title === 'string' ? (
                    <Text className={classNames?.title} font="title3" style={styles?.title}>
                      {title}
                    </Text>
                  ) : (
                    title
                  )}
                  {!hideNavigation && (
                    <NavigationComponent
                      autoplay={autoplay}
                      className={classNames?.navigation}
                      disableGoNext={
                        totalPages <= 1 || (!shouldLoop && activePageIndex >= totalPages - 1)
                      }
                      disableGoPrevious={totalPages <= 1 || (!shouldLoop && activePageIndex <= 0)}
                      isPlaying={isPlaying}
                      nextPageAccessibilityLabel={nextPageAccessibilityLabel}
                      onGoNext={handleGoNext}
                      onGoPrevious={handleGoPrevious}
                      onTogglePlayPause={handleTogglePlayPause}
                      pauseAccessibilityLabel={pauseAccessibilityLabel}
                      playAccessibilityLabel={playAccessibilityLabel}
                      previousPageAccessibilityLabel={previousPageAccessibilityLabel}
                      style={styles?.navigation}
                    />
                  )}
                </HStack>
              )}
              <div
                ref={containerRef}
                className={classNames?.carouselContainer}
                onPointerDown={(e) => {
                  if (isDragEnabled) {
                    // Allows us to grab between items where child wouldn't be selected
                    dragControls.start(e);
                    handleDragStart();
                  }
                }}
                style={{
                  width: '100%',
                  position: 'relative',
                  ...styles?.carouselContainer,
                }}
              >
                <CarouselContext.Provider value={carouselContextValue}>
                  <m.div
                    _dragX={carouselScrollX}
                    animate={animationApi}
                    className={cx(classNames?.carousel, defaultCarouselCss)}
                    drag={isDragEnabled ? 'x' : false}
                    dragConstraints={shouldLoop ? undefined : { left: -maxScrollOffset, right: 0 }}
                    dragControls={dragControls}
                    dragTransition={{
                      // How much inertia affects the target
                      power: drag === 'free' ? 0.5 : 0.125,
                      timeConstant: drag !== 'free' ? 125 : undefined,
                      modifyTarget: handleDragTransition,
                    }}
                    initial={false}
                    onDragEnd={handleDragEnd}
                    style={{
                      display: 'flex',
                      position: 'relative',
                      x: shouldLoop ? wrappedX : carouselScrollX,
                      ...styles?.carousel,
                    }}
                    whileDrag={{
                      pointerEvents: 'none',
                    }}
                  >
                    {childrenWithClones}
                  </m.div>
                </CarouselContext.Provider>
              </div>
              {!hidePagination && (
                <PaginationComponent
                  activePageIndex={activePageIndex}
                  autoplay={autoplay}
                  autoplayProgress={autoplayProgress}
                  className={classNames?.pagination}
                  onClickPage={handleClickPage}
                  paginationAccessibilityLabel={paginationAccessibilityLabel}
                  style={styles?.pagination}
                  totalPages={totalPages}
                />
              )}
            </VStack>
          </RefMapContext.Provider>
        </LazyMotion>
      );
    },
  ),
);
