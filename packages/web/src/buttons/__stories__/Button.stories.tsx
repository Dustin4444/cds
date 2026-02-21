import React from 'react';

import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../../icons/Icon';
import { VStack } from '../../layout';
import { ThemeProvider } from '../../system/ThemeProvider';
import { defaultGradientTheme } from '../../themes/gradients/defaultGradientTheme';
import { Text } from '../../typography/Text';
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

export const GradientButtons = () => {
  const { activeColorScheme } = useTheme();

  return (
    <ThemeProvider activeColorScheme={activeColorScheme} theme={defaultGradientTheme}>
      <GradientButtonsContent />
    </ThemeProvider>
  );
};

function GradientButtonsContent() {
  const theme = useTheme();

  return (
    <VStack alignItems="flex-start" gap={4}>
      {/* Theme Gradient Presets */}
      <VStack gap={1}>
        <Text as="h2" display="block" font="title3">
          Theme Gradient Presets (gradient)
        </Text>
        <VStack alignItems="flex-start" gap={2}>
          {(['primary', 'brand', 'positive', 'negative', 'premium'] as const).map((preset) => (
            <Button color="fgInverse" gradient={preset} onClick={onClickConsole}>
              Preset: {preset}
            </Button>
          ))}
        </VStack>
      </VStack>

      {/* Custom Gradients using dangerouslySetGradient */}
      <VStack alignItems="flex-start" gap={2}>
        <Text as="h2" display="block" font="title3">
          Custom Gradients (dangerouslySetGradient)
        </Text>
        <Button
          color="fgInverse"
          dangerouslySetGradient={`linear-gradient(90deg, ${theme.color.accentBoldBlue}, ${theme.color.accentBoldPurple})`}
          onClick={onClickConsole}
        >
          Custom: Blue to Purple
        </Button>
        <Button
          color="fgInverse"
          dangerouslySetGradient={`linear-gradient(45deg, ${theme.color.bgPositive}, ${theme.color.accentBoldBlue})`}
          onClick={onClickConsole}
        >
          Custom: 45° Angle
        </Button>
        <Button
          block
          color="fgInverse"
          dangerouslySetGradient={`linear-gradient(90deg, ${theme.color.accentBoldBlue}, ${theme.color.accentBoldPurple}, ${theme.color.accentBoldYellow})`}
          onClick={onClickConsole}
        >
          Multi-Color Block Gradient
        </Button>
      </VStack>

      {/* Different Gradient Styles */}
      <VStack alignItems="flex-start" gap={2}>
        <Text as="h2" display="block" font="title3">
          Different Gradient Styles
        </Text>
        <Button
          color="fgInverse"
          dangerouslySetGradient={`radial-gradient(circle, ${theme.color.accentBoldBlue}, ${theme.color.accentBoldPurple})`}
          onClick={onClickConsole}
        >
          Radial Gradient
        </Button>
        <Button
          color="fgInverse"
          dangerouslySetGradient={`conic-gradient(from 0deg, ${theme.color.bgNegative}, ${theme.color.bgWarning}, ${theme.color.bgPositive}, ${theme.color.accentBoldBlue}, ${theme.color.bgNegative})`}
          onClick={onClickConsole}
        >
          Conic Gradient
        </Button>
        <Button
          color="fgInverse"
          dangerouslySetGradient={`repeating-linear-gradient(45deg, ${theme.color.accentBoldBlue}, ${theme.color.accentBoldBlue} 10px, ${theme.color.accentBoldPurple} 10px, ${theme.color.accentBoldPurple} 20px)`}
          onClick={onClickConsole}
        >
          Repeating Linear Gradient
        </Button>
        <Button
          block
          color="fgInverse"
          dangerouslySetGradient={`linear-gradient(90deg, ${theme.color.bgNegative}, ${theme.color.bgWarning}, ${theme.color.bgPositive}, ${theme.color.accentBoldBlue})`}
          onClick={onClickConsole}
        >
          Rainbow Gradient
        </Button>
      </VStack>

      {/* Gradient with Interactive States */}
      <VStack alignItems="flex-start" gap={2}>
        <Text as="h2" display="block" font="title3">
          Gradient with Hover/Active States
        </Text>
        <Button
          blendStyles={{
            backgroundGradient: `linear-gradient(90deg, ${theme.color.bgPositive}, ${theme.color.accentBoldBlue})`,
            hoveredBackgroundGradient: `linear-gradient(90deg, ${theme.color.accentBoldBlue}, ${theme.color.accentBoldPurple})`,
            pressedBackgroundGradient: `linear-gradient(90deg, ${theme.color.bgWarning}, ${theme.color.accentBoldPurple})`,
          }}
          color="fgInverse"
          onClick={onClickConsole}
          variant="gradient"
        >
          Gradient with Hover/Active States
        </Button>
        <Button
          disabled
          blendStyles={{
            disabledBackgroundGradient: `linear-gradient(90deg, ${theme.color.bgSecondary}, ${theme.color.bgOverlay})`,
          }}
          color="fg"
          onClick={onClickConsole}
          variant="gradient"
        >
          Disabled Gradient
        </Button>
      </VStack>
    </VStack>
  );
}
