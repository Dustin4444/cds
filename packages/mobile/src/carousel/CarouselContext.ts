import React, { useContext } from 'react';
import type { Rect } from '@coinbase/cds-common/types';

export type CarouselContextValue = {
  registerItem: (id: string, state: Rect) => void;
  unregisterItem: (id: string) => void;
  /**
   * Set of item IDs that are currently visible in the carousel viewport.
   */
  visibleCarouselItems: Set<string>;
  /**
   * Whether autoplay is enabled for the carousel.
   */
  autoplay?: boolean;
  /**
   * The current play/pause state of the autoplay.
   */
  isPlaying?: boolean;
  /**
   * Callback to toggle the play/pause state of the autoplay.
   */
  onTogglePlayPause?: () => void;
  /**
   * The current progress of the autoplay animation (0-1).
   */
  autoplayProgress?: number;
};

export const CarouselContext = React.createContext<CarouselContextValue | undefined>(undefined);

export const useCarouselContext = (): CarouselContextValue => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarouselContext must be used within a Carousel component');
  }
  return context;
};
