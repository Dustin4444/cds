import React, { memo, useMemo } from 'react';
import {
  animateGradientScaleConfig,
  animatePaddleOpacityConfig,
  animatePaddleScaleConfig,
  paddleHidden,
  paddleVisible,
} from '@coinbase/cds-common/animation/paddle';
import { durations } from '@coinbase/cds-common/motion/tokens';
import { zIndex } from '@coinbase/cds-common/tokens/zIndex';
import type { SharedAccessibilityProps, SharedProps } from '@coinbase/cds-common/types';
import { css } from '@linaria/core';
import { m as motion } from 'framer-motion';

import { NewAnimatePresence } from '../animation/NewAnimatePresence';
import { IconButton } from '../buttons/IconButton';
import { cx } from '../cx';
import { Box } from '../layout/Box';
import { useMotionProps } from '../motion/useMotionProps';

import { paddleWidth } from './Paddle';

const MotionBox = motion(Box);

export type TabsScrollAreaOverflowIndicatorBaseProps = SharedProps &
  SharedAccessibilityProps & {
    direction?: 'left' | 'right';
    show: boolean;
    compact?: boolean;
    onClick: () => void;
  };

export type TabsScrollAreaOverflowIndicatorProps = TabsScrollAreaOverflowIndicatorBaseProps & {
  style?: React.CSSProperties;
  className?: string;
  classNames?: {
    root?: string;
    button?: string;
    buttonContainer?: string;
    gradient?: string;
  };
  styles?: {
    root?: React.CSSProperties;
    button?: React.CSSProperties;
    buttonContainer?: React.CSSProperties;
    gradient?: React.CSSProperties;
  };
};

const tabLabelOffset = '7px';

const gradientCss = css`
  display: block;
  position: absolute;
  pointer-events: none;
  z-index: ${zIndex.interactable};
  top: 0;
  width: calc(${paddleWidth}px + var(--space-2));
  height: 100%;
`;

const gradientLeftCss = css`
  background: linear-gradient(to right, currentColor 50%, var(--color-transparent) 100%);
  left: 0px;
  transform-origin: left;
`;

const gradientRightCss = css`
  background: linear-gradient(to left, currentColor 50%, var(--color-transparent) 100%);
  right: 0px;
  transform-origin: right;
`;

const containerCss = css`
  display: block;
  position: absolute;
  z-index: ${zIndex.navigation + 1};
  padding-top: calc(var(--space-2) - ${tabLabelOffset});
  padding-bottom: calc(var(--space-2) - ${tabLabelOffset});
`;

const buttonCss = css`
  display: block;
  position: relative;
  z-index: ${zIndex.navigation};
`;

const paddleLeftCss = css`
  left: calc(var(--space-2) * -1);
  padding-inline-start: var(--space-2);
  padding-inline-end: var(--space-2);
`;

const paddleRightCss = css`
  right: calc(var(--space-2) * -1);
  padding-inline-start: var(--space-2);
  padding-inline-end: var(--space-2);
`;

const tabsScrollAreaOverflowBackground = 'bg' as const;

/**
 * Default scroll overflow control for {@link TabsScrollArea}: same visuals as {@link Paddle} with
 * fixed background token and secondary icon (no `background` / `variant` props on this API).
 */
export const TabsScrollAreaOverflowIndicator = memo(function TabsScrollAreaOverflowIndicator({
  direction = 'left',
  show,
  onClick,
  testID = `cds-paddle--${direction}`,
  accessibilityLabel,
  styles,
  classNames,
  style,
  className,
  compact,
}: TabsScrollAreaOverflowIndicatorProps) {
  const buttonStyle = useMemo(
    () => ({
      ...styles?.button,
    }),
    [styles?.button],
  );

  const rootStyle = useMemo(
    () => ({
      ...styles?.root,
      ...style,
    }),
    [style, styles?.root],
  );

  /** Opacity on the motion root so {@link NewAnimatePresence} can run exit on the direct child. */
  const containerPresenceMotionProps = useMotionProps({
    enterConfigs: [{ ...animatePaddleOpacityConfig, toValue: paddleVisible }],
    exitConfigs: [{ ...animatePaddleOpacityConfig, toValue: paddleHidden }],
    exit: 'exit',
  });

  const buttonScaleMotionProps = useMotionProps({
    enterConfigs: [{ ...animatePaddleScaleConfig, toValue: paddleVisible }],
    exitConfigs: [{ ...animatePaddleScaleConfig, toValue: paddleHidden }],
    exit: 'exit',
  });

  const gradientMotionProps = useMotionProps({
    enterConfigs: [{ ...animateGradientScaleConfig, toValue: paddleVisible }],
    exitConfigs: [{ ...animateGradientScaleConfig, toValue: paddleHidden }],
    exit: 'exit',
  });

  return (
    <NewAnimatePresence>
      {show && (
        <MotionBox
          as="span"
          className={cx(
            containerCss,
            direction === 'left' ? paddleLeftCss : paddleRightCss,
            classNames?.root,
            className,
          )}
          color={tabsScrollAreaOverflowBackground}
          data-testid={`${testID}--container`}
          style={rootStyle}
          {...containerPresenceMotionProps}
        >
          <motion.span
            className={cx(buttonCss, classNames?.buttonContainer)}
            style={styles?.buttonContainer}
            {...buttonScaleMotionProps}
          >
            <IconButton
              accessibilityLabel={accessibilityLabel}
              className={classNames?.button}
              height="fit-content"
              name={direction === 'left' ? 'caretLeft' : 'caretRight'}
              onClick={onClick}
              padding={compact ? 1 : 1.5}
              style={buttonStyle}
              testID={testID}
              variant="secondary"
              width="fit-content"
            />
          </motion.span>
          <motion.span
            className={cx(
              gradientCss,
              direction === 'left' ? gradientLeftCss : gradientRightCss,
              classNames?.gradient,
            )}
            style={styles?.gradient}
            {...gradientMotionProps}
          />
        </MotionBox>
      )}
    </NewAnimatePresence>
  );
});

TabsScrollAreaOverflowIndicator.displayName = 'TabsScrollAreaOverflowIndicator';
