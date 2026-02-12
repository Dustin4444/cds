import React from 'react';

import type { ThemeConfig } from '../../core/theme';
import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../../icons/Icon';
import { VStack } from '../../layout';
import { ThemeProvider } from '../../system/ThemeProvider';
import { defaultTheme } from '../../themes/defaultTheme';
import { Button, type ButtonBaseProps } from '../Button';
import { ButtonGroup } from '../ButtonGroup';
import { defaultGradientTheme } from '../../themes/gradients/defaultGradientPresets';

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

/**
 * Custom theme with dramatically different gradient colors
 * to demonstrate theme customization.
 * - brand: orange → yellow (warm, instead of default blue → purple)
 * - premium: red → orange → yellow (warm gradient)
 * - positive: uses warning color for contrast
 */
const customTheme: ThemeConfig = {
  ...defaultTheme,
  lightGradient: {
    brand: {
      direction: 'to-r',
      colors: [defaultTheme.lightColor.bgWarning, defaultTheme.lightColor.accentBoldYellow],
    },
    premium: {
      direction: 135,
      colors: [
        defaultTheme.lightColor.accentBoldRed,
        defaultTheme.lightColor.bgWarning,
        defaultTheme.lightColor.accentBoldYellow,
      ],
    },
    positive: {
      direction: 'to-b',
      colors: [
        defaultTheme.lightColor.bgWarning,
        { color: defaultTheme.lightColor.bgWarning, opacity: 0.7 },
      ],
    },
  },
  darkGradient: {
    brand: {
      direction: 'to-r',
      colors: [defaultTheme.darkColor.bgWarning, defaultTheme.darkColor.accentBoldYellow],
    },
    premium: {
      direction: 135,
      colors: [
        defaultTheme.darkColor.accentBoldRed,
        defaultTheme.darkColor.bgWarning,
        defaultTheme.darkColor.accentBoldYellow,
      ],
    },
    positive: {
      direction: 'to-b',
      colors: [
        defaultTheme.darkColor.bgWarning,
        { color: defaultTheme.darkColor.bgWarning, opacity: 0.7 },
      ],
    },
  },
};

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
      {/* Preset Gradients */}
      <VStack alignItems="flex-start" gap={2}>
        <Button color="fgInverse" gradient="brand" onClick={onClickConsole}>
          Brand Gradient (Preset)
        </Button>
        <Button color="fgInverse" gradient="premium" onClick={onClickConsole}>
          Premium Gradient (Preset)
        </Button>
        <Button
          block
          color="fgInverse"
          gradient="positive"
          onClick={onClickConsole}
          startIcon="checkmark"
        >
          Positive Gradient with Icon
        </Button>
      </VStack>

      {/* Custom Inline Gradients */}
      <VStack alignItems="flex-start" gap={2}>
        <Button
          color="fgInverse"
          gradient={{
            direction: 'to-r',
            colors: [theme.color.bgPositive, theme.color.bgPrimary],
          }}
          onClick={onClickConsole}
        >
          Custom: Positive to Primary
        </Button>
        <Button
          color="fgInverse"
          gradient={{
            direction: 45,
            colors: [theme.color.accentBoldBlue, theme.color.accentBoldPurple],
          }}
          onClick={onClickConsole}
        >
          Custom: 45° Angle
        </Button>
        <Button
          color="fgInverse"
          gradient={{
            direction: 'to-r',
            colors: [
              { color: theme.color.accentBoldBlue, offset: 0 },
              { color: theme.color.accentBoldPurple, offset: 0.5 },
              { color: theme.color.accentBoldYellow, offset: 1 },
            ],
          }}
          onClick={onClickConsole}
        >
          Custom: Color Stops
        </Button>
      </VStack>

      {/* Block Gradients */}
      <VStack gap={2}>
        <Button block color="fgInverse" gradient="brand" onClick={onClickConsole}>
          Full Width Gradient
        </Button>
        <Button
          block
          color="fgInverse"
          gradient={{
            direction: 'to-r',
            colors: [
              theme.color.accentBoldBlue,
              theme.color.accentBoldPurple,
              theme.color.accentBoldYellow,
            ],
          }}
          onClick={onClickConsole}
        >
          Multi-Color Block Gradient
        </Button>
      </VStack>

      {/* Interactive States (CSS overrides) */}
      <VStack alignItems="flex-start" gap={2}>
        <Button
          blendStyles={{
            hoveredBackground: 'linear-gradient(90deg, #0047e0 0%, #4c1d95 100%)',
            pressedBackground:
              'linear-gradient(90deg, rgb(238, 137, 83) 0%, rgb(246, 244, 79) 100%)',
            disabledBackground: 'linear-gradient(90deg, #999999 0%, #333333 100%)',
          }}
          color="fgInverse"
          gradient={{
            direction: 'to-r',
            colors: [theme.color.bgPositive, theme.color.bgPrimary],
          }}
          onClick={onClickConsole}
        >
          Gradient with Hover/Active States
        </Button>
        <Button
          disabled
          blendStyles={{
            hoveredBackground: 'linear-gradient(90deg, #0047e0 0%, #4c1d95 100%)',
            pressedBackground:
              'linear-gradient(90deg, rgb(238, 137, 83) 0%, rgb(246, 244, 79) 100%)',
            disabledBackground: 'linear-gradient(90deg, #999999 0%, #333333 100%)',
          }}
          color="fg"
          gradient={{
            direction: 45,
            colors: [theme.color.accentBoldBlue, theme.color.accentBoldYellow],
          }}
          onClick={onClickConsole}
        >
          Disabled Gradient
        </Button>
      </VStack>
      {/* Custom theme gradient */}
      <ThemeProvider activeColorScheme={theme.activeColorScheme} theme={customTheme}>
        <VStack alignItems="flex-start" gap={2}>
          <Button color="fgInverse" gradient="brand" onClick={onClickConsole}>
            Custom Brand Gradient
          </Button>
          <Button color="fgInverse" gradient="premium" onClick={onClickConsole}>
            Custom Premium Gradient
          </Button>
        </VStack>
      </ThemeProvider>

      {/* Radial and Conic Gradients (CSS overrides) */}
      <VStack alignItems="flex-start" gap={2}>
        <Button
          variant="gradient"
          blendStyles={{
            background: 'radial-gradient(circle at center, #0052ff 0%, #7b3fe4 100%)',
            hoveredBackground: 'radial-gradient(circle at center, #0047e0 0%, #5b2fb4 100%)',
            pressedBackground: 'radial-gradient(circle at center, #003cb8 0%, #4b1fa4 100%)',
            disabledBackground: 'radial-gradient(circle at center, #999999 0%, #333333 100%)',
          }}
          color="fgInverse"
          onClick={onClickConsole}
        >
          Radial Gradient (Circle)
        </Button>
        <Button
          variant="gradient"
          color="fgInverse"
          onClick={onClickConsole}
          blendStyles={{
            background: 'radial-gradient(ellipse at top, #05b169 0%, #0052ff 50%, #7b3fe4 100%)',
            hoveredBackground:
              'radial-gradient(ellipse at top, #04a159 0%, #0047e0 50%, #5b2fb4 100%)',
            pressedBackground:
              'radial-gradient(ellipse at top, #039149 0%, #003cb8 50%, #4b1fa4 100%)',
            disabledBackground: 'radial-gradient(ellipse at top, #999999 0%, #333333 100%)',
          }}
        >
          Radial Gradient (Ellipse)
        </Button>
        <Button
          blendStyles={{
            background:
              'radial-gradient(circle at top right, #7b3fe4 0%, #0052ff 50%, #05b169 100%)',
            hoveredBackground:
              'radial-gradient(circle at top right, #5b2fb4 0%, #0047e0 50%, #04a159 100%)',
            pressedBackground:
              'radial-gradient(circle at top right, #4b1fa4 0%, #003cb8 50%, #039149 100%)',
            disabledBackground: 'radial-gradient(circle at top right, #999999 0%, #333333 100%)',
          }}
          variant="gradient"
          color="fgInverse"
          onClick={onClickConsole}
        >
          Radial Gradient (Corner)
        </Button>
        <Button
          blendStyles={{
            background: 'conic-gradient(from 0deg, #0052ff, #7b3fe4, #05b169, #0052ff)',
            hoveredBackground: 'conic-gradient(from 45deg, #0052ff, #7b3fe4, #05b169, #0052ff)',
            pressedBackground: 'conic-gradient(from 90deg, #0052ff, #7b3fe4, #05b169, #0052ff)',
            disabledBackground: 'conic-gradient(from 135deg, #0052ff, #7b3fe4, #05b169, #0052ff)',
          }}
          variant="gradient"
          color="fgInverse"
          onClick={onClickConsole}
        >
          Conic Gradient (Color Wheel)
        </Button>
        <Button
          block
          blendStyles={{
            background:
              'conic-gradient(from 0deg, #0052ff 0deg 90deg, #7b3fe4 90deg 180deg, #05b169 180deg 270deg, #cf4700 270deg 360deg)',
            hoveredBackground:
              'conic-gradient(from 45deg, #0052ff 0deg 90deg, #7b3fe4 90deg 180deg, #05b169 180deg 270deg, #cf4700 270deg 360deg)',
            pressedBackground:
              'conic-gradient(from 90deg, #0052ff 0deg 90deg, #7b3fe4 90deg 180deg, #05b169 180deg 270deg, #cf4700 270deg 360deg)',
            disabledBackground:
              'conic-gradient(from 135deg, #0052ff 0deg 90deg, #7b3fe4 90deg 180deg, #05b169 180deg 270deg, #cf4700 270deg 360deg)',
          }}
          variant="gradient"
          color="fgInverse"
          onClick={onClickConsole}
        >
          Conic Gradient (Hard Stops)
        </Button>
      </VStack>
    </VStack>
  );
}
