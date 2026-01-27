import React, { useContext } from 'react';

export type CarouselContextValue = {
  /**
   * Set of item IDs that are currently visible in the carousel viewport.
   */
  visibleCarouselItems: Set<string>;
  /**
   * Whether autoplay is enabled for this carousel.
   */
  autoplay?: boolean;
  /**
   * Whether the carousel is currently playing (autoplay active and not paused).
   */
  isPlaying?: boolean;
  /**
   * Callback to toggle play/pause state.
   */
  onTogglePlayPause?: () => void;
  /**
   * Progress of the current autoplay cycle (0-1).
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
