import React, { Fragment } from 'react';
import type { PressableProps } from 'react-native';
import { useModalContext } from '@coinbase/cds-common/overlays/ModalContext';
import type { ThemeVars } from '@coinbase/cds-common/core/theme';
import type { SharedProps } from '@coinbase/cds-common/types';

import type { ButtonBaseProps } from '../../buttons/Button';
import { ButtonGroup, type ButtonGroupProps } from '../../buttons/ButtonGroup';
import { useComponentConfig } from '../../hooks/useComponentConfig';
import { Box } from '../../layout/Box';

export type ModalFooterProps = {
  /** Primary action button */
  primaryAction: NonNullable<
    React.ReactElement<ButtonBaseProps & { onPress?: PressableProps['onPress'] }>
  >;
  /** Secondary action button */
  secondaryAction?: React.ReactElement<ButtonBaseProps & { onPress?: PressableProps['onPress'] }>;
  /** Horizontal padding for the footer */
  paddingX?: ThemeVars.Space;
  /** Vertical padding for the footer */
  paddingY?: ThemeVars.Space;
} & Pick<ButtonGroupProps, 'direction'> &
  SharedProps;

export const ModalFooter = (_props: ModalFooterProps) => {
  const mergedProps = useComponentConfig('ModalFooter', _props);
  const {
    primaryAction,
    secondaryAction,
    direction = 'horizontal',
    paddingX = 3,
    paddingY = 2,
    testID,
  } = mergedProps;
  const { hideDividers = false } = useModalContext();
  const actions = [secondaryAction, primaryAction].filter(Boolean);
  const isVertical = direction === 'vertical';

  // reverse actions order when stacked
  if (isVertical) {
    actions.reverse();
  }

  return (
    <Box borderedTop={!hideDividers} paddingX={paddingX} paddingY={paddingY} testID={testID}>
      <ButtonGroup block={!isVertical} direction={direction}>
        {actions.map((action, i) => (
          // actions are stable so should be fine to use index as key

          <Fragment key={i}>{action}</Fragment>
        ))}
      </ButtonGroup>
    </Box>
  );
};
