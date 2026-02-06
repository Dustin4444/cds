import React from 'react';
import { css } from '@linaria/core';

import type { ThemeConfig } from '../../core/theme';
import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../../icons/Icon';
import { VStack } from '../../layout';
import { ThemeProvider } from '../../system/ThemeProvider';
import { defaultTheme } from '../../themes/defaultTheme';
import { Button, type ButtonBaseProps } from '../Button';
import { ButtonGroup } from '../ButtonGroup';

export default {
  component: Button,
  title: 'Components/Buttons/Button',
};

const buttonStories: Omit<ButtonBaseProps, 'children'>[] = [
  { variant: 'foregroundMuted' },
  { variant: 'secondary' },
  { variant: 'tertiary' },
  { variant: 'positive' },
  { variant: 'negative' },
  { variant: 'secondary', transparent: true },
  { variant: 'positive', transparent: true },
  { variant: 'negative', transparent: true },
  { block: true },
  { compact: true },
  { compact: true, block: true },
  { transparent: true },
  { disabled: true },
  { loading: true },
  { loading: true, compact: true },
  { startIcon: 'backArrow' },
  { endIcon: 'backArrow' },
  { startIcon: 'backArrow', endIcon: 'forwardArrow' },
  { startIcon: 'backArrow', endIcon: 'forwardArrow', block: true },
  { transparent: true, flush: 'start', compact: true, endIcon: 'forwardArrow' },
  { transparent: true, flush: 'end', compact: true, endIcon: 'forwardArrow' },
  { flush: 'start', endIcon: 'forwardArrow' },
  { flush: 'end', endIcon: 'forwardArrow' },
  { startIcon: 'backArrow', endIcon: 'forwardArrow', compact: true },
  { startIcon: 'backArrow', compact: true },
  { endIcon: 'forwardArrow', compact: true },
  { padding: 5 },
  { paddingX: 5, padding: 4 },
  { paddingY: 4 },
  { paddingStart: 6, paddingEnd: 6 },
  { paddingTop: 6, paddingBottom: 6 },
  { marginStart: -2 },
  { font: 'body' },
  { font: 'title3' },
  { fontSize: 'title3', fontWeight: 'body' },
];

const onClickConsole = () => console.log('clicked');

export const CreateButtonStories = () => (
  <VStack alignItems="flex-start" gap={2} padding={0.5}>
    {buttonStories.map((props, idx) => {
      const key = `button-${idx}`;
      return (
        <Button key={key} onClick={onClickConsole} {...props}>
          Button
        </Button>
      );
    })}
  </VStack>
);

export const CustomEndIconButton = () => (
  <VStack gap={2}>
    <ButtonGroup accessibilityLabel="Group">
      <Button end={<Icon color="fg" name="caretRight" size="s" />}>Test</Button>
      <Button end={<Icon active color="fg" name="add" size="s" />} variant="secondary">
        Test
      </Button>
      <Button
        endIconActive
        end={<Icon active color="fg" name="add" size="s" />}
        endIcon="airdrop"
        variant="secondary"
      >
        Test
      </Button>
    </ButtonGroup>
  </VStack>
);

export const FlushProps = () => (
  <VStack background="bgSecondary" gap={4} paddingX={2}>
    <Button onClick={() => {}} variant="positive">
      No Flush
    </Button>
    <Button block flush="start" onClick={() => {}}>
      Flush to Start
    </Button>
    <Button block flush="end" onClick={() => {}} variant="negative">
      Flush to End
    </Button>
  </VStack>
);

export const GradientButton = () => (
  <VStack alignItems="flex-start" gap={2}>
    <Button color="fgInverse" gradient="brand" onClick={() => console.log('clicked')}>
      Brand Gradient Button
    </Button>

    <Button
      color="fgInverse"
      gradient={{ direction: 'to-r', colors: ['bgPositive', 'bgPrimary'] }}
      onClick={() => console.log('clicked')}
    >
      Positive to Primary
    </Button>

    <Button
      color="fgInverse"
      gradient={{ direction: 'to-r', colors: ['bgNegative', 'bgWarning'] }}
      onClick={() => console.log('clicked')}
    >
      Negative to Warning
    </Button>

    <Button color="fgInverse" gradient="premium" onClick={() => console.log('clicked')}>
      Premium Gradient
    </Button>

    <Button
      color="fgInverse"
      gradient={{ direction: 45, colors: ['accentBoldBlue', 'accentBoldPurple'] }}
      onClick={() => console.log('clicked')}
    >
      Custom Angle (45°)
    </Button>

    <Button
      color="fgInverse"
      gradient={{
        direction: 'to-r',
        colors: [
          { color: 'accentBoldBlue', offset: 0 },
          { color: 'accentBoldPurple', offset: 0.5 },
          { color: 'accentBoldYellow', offset: 1 },
        ],
      }}
      onClick={() => console.log('clicked')}
    >
      Custom Color Stops
    </Button>
  </VStack>
);

export const GradientButtonBlock = () => (
  <VStack gap={2}>
    <Button block color="fgInverse" gradient="brand" onClick={() => console.log('clicked')}>
      Full Width Gradient Button
    </Button>

    <Button
      block
      color="fgInverse"
      gradient={{
        direction: 'to-r',
        colors: ['accentBoldBlue', 'accentBoldPurple', 'accentBoldYellow'],
      }}
      onClick={() => console.log('clicked')}
    >
      Multi-Color Gradient
    </Button>

    <Button
      block
      color="fgInverse"
      gradient="positive"
      onClick={() => console.log('clicked')}
      startIcon="checkmark"
    >
      Gradient with Icon
    </Button>
  </VStack>
);

const gradientCss = css`
  &:hover {
    background: linear-gradient(90deg, #0047e0 0%, #4c1d95 100%);
  }
  &:active,
  &[aria-pressed='true'] {
    background: linear-gradient(90deg, rgb(238, 137, 83) 0%, rgb(246, 244, 79) 100%);
  }
  &:disabled {
    background: linear-gradient(90deg, #999999 0%, #555555 100%);
  }
`;

export const GradientButtonWithInteractiveStates = () => (
  <VStack alignItems="flex-start" gap={2}>
    <Button
      className={gradientCss}
      color="fgInverse"
      gradient={{ direction: 'to-r', colors: ['bgPositive', 'bgPrimary'] }}
      onClick={() => console.log('clicked')}
    >
      Gradient with Hover States
    </Button>

    <Button
      blendStyles={{
        background: 'linear-gradient(90deg, #667EEA 0%, #764BA2 50%, #F093FB 100%)',
        hoveredBackground: 'linear-gradient(90deg, #5A6FD1 0%, #683F8E 50%, #D683E2 100%)',
        pressedBackground: 'linear-gradient(90deg, #4E60B8 0%, #5A337A 50%, #BC73C9 100%)',
      }}
      className={gradientCss}
      color="fgInverse"
      gradient={{
        direction: 90,
        colors: [
          { color: '#667EEA', offset: 0 },
          { color: '#764BA2', offset: 0.5 },
          { color: '#F093FB', offset: 1 },
        ],
      }}
      onClick={() => console.log('clicked')}
    >
      Multi-Stop Gradient States
    </Button>

    <Button
      disabled
      className={gradientCss}
      color="fg"
      gradient={{
        direction: 45,
        colors: [
          { color: '#00D9FF', offset: 0 },
          { color: '#00FF94', offset: 1 },
        ],
      }}
      onClick={() => console.log('clicked')}
    >
      Disabled Gradient State
    </Button>

    <Button
      block
      className={gradientCss}
      color="fgInverse"
      gradient={{
        direction: 'to-r',
        colors: [
          { color: '#1A1A2E', offset: 0 },
          { color: '#16213E', offset: 0.3 },
          { color: '#0F3469', offset: 1 },
        ],
      }}
      onClick={() => console.log('clicked')}
    >
      Dark Gradient Block Button
    </Button>
  </VStack>
);

const customTheme: ThemeConfig = {
  ...defaultTheme,
  gradients: {
    brand: {
      direction: 'to-r',
      colors: ['bgPositive', 'bgPrimary'],
    },
  },
};
export const GradientButtonWithThemePresets = () => {
  const { activeColorScheme } = useTheme();
  return (
    <ThemeProvider activeColorScheme={activeColorScheme} theme={customTheme}>
      <VStack gap={2}>
        <Button color="fgInverse" gradient="brand" onClick={() => console.log('clicked')}>
          Brand Gradient Button
        </Button>
      </VStack>
    </ThemeProvider>
  );
};
