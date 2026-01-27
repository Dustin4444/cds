import React, { memo, useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

import { useTheme } from '../hooks/useTheme';
import { Box } from '../layout/Box';
import { HStack } from '../layout/HStack';
import { Pressable } from '../system/Pressable';

import type { CarouselPaginationComponentProps } from './Carousel';

export type DefaultCarouselPaginationProps = CarouselPaginationComponentProps & {
  /**
   * Custom styles for the component.
   */
  styles?: {
    /**
     * Custom styles for the root element.
     */
    root?: StyleProp<ViewStyle>;
    /**
     * Custom styles for the dot element.
     */
    dot?: StyleProp<ViewStyle>;
  };
};

export const DefaultCarouselPagination = memo(function DefaultCarouselPagination({
  totalPages,
  activePageIndex,
  onPressPage,
  autoplay,
  autoplayProgress = 0,
  style,
  styles,
  paginationAccessibilityLabel = 'Go to page',
}: DefaultCarouselPaginationProps) {
  const theme = useTheme();

  // Using paddingVertical here instead of HStack prop so it can be overridden by custom styles
  const rootStyles = useMemo(
    () => [{ paddingVertical: theme.space[0.5] }, style, styles?.root],
    [style, styles?.root, theme.space],
  );

  return (
    <HStack gap={0.5} justifyContent="center" style={rootStyles}>
      {totalPages > 0 ? (
        Array.from({ length: totalPages }, (_, index) => {
          const isActive = index === activePageIndex;
          const showProgress = autoplay && isActive;

          return (
            <Pressable
              key={index}
              accessibilityLabel={
                typeof paginationAccessibilityLabel === 'function'
                  ? paginationAccessibilityLabel(index)
                  : `${paginationAccessibilityLabel} ${index + 1}`
              }
              background={showProgress ? 'bgLine' : isActive ? 'bgPrimary' : 'bgLine'}
              borderRadius={100}
              height={4}
              onPress={() => onPressPage(index)}
              style={[{ overflow: 'hidden' }, styles?.dot]}
              testID={`carousel-page-${index}`}
              width={24}
            >
              {showProgress && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${autoplayProgress * 100}%`,
                    backgroundColor: theme.color.bgPrimary,
                    borderRadius: theme.borderRadius[100],
                  }}
                />
              )}
            </Pressable>
          );
        })
      ) : (
        <Pressable
          disabled
          background="bgLine"
          borderRadius={100}
          height={4}
          style={[{ opacity: 0 }, styles?.dot]}
          width={24}
        />
      )}
    </HStack>
  );
});
