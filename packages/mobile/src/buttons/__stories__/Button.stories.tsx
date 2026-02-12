import React from 'react';

import type { ThemeConfig } from '../../core/theme';
import { Example, ExampleScreen } from '../../examples/ExampleScreen';
import { LinearGradient } from '../../gradients/LinearGradient';
import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../../icons';
import { Box } from '../../layout/Box';
import { HStack } from '../../layout/HStack';
import { VStack } from '../../layout/VStack';
import { RemoteImage } from '../../media/RemoteImage';
import { ThemeProvider } from '../../system/ThemeProvider';
import { defaultTheme } from '../../themes/defaultTheme';
import { Text } from '../../typography/Text';
import { Button, type ButtonProps } from '../Button';
import { ButtonGroup } from '../ButtonGroup';
import { defaultGradientTheme } from '../../themes/gradients/defaultGradientTheme';

const buttonStories: Omit<ButtonProps, 'children'>[] = [
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
];

const ButtonScreen = () => {
  const theme = useTheme();
  return (
    <ExampleScreen>
      <Example inline title="Complex example">
        <Button compact endIcon="caretDown" variant="secondary">
          <HStack alignItems="center" justifyContent="center" paddingTop={0}>
            <RemoteImage height={16} resizeMode="cover" shape="circle" width={16} />
            <Text color="fgMuted" font="label2" paddingStart={1} testID="DexInputNetwork">
              Ethereum
            </Text>
          </HStack>
        </Button>
      </Example>
      {buttonStories.map((props, index) => {
        return (
          <Example inline>
            <Button key={index} {...props}>
              I am a button
            </Button>
          </Example>
        );
      })}
      <Example title="Long text content">
        <Button>
          Some really really really long button text that should get truncated after wrapping two
          lines
        </Button>
      </Example>
      <Example title="Typography props">
        <VStack alignItems="flex-start" gap={2}>
          <Button>I am a headline button</Button>
          <Button font="body">I am a body button</Button>
          <Button font="title3">I am a title3 button</Button>
          <Button fontSize="title3" fontWeight="body">
            I have custom fontSize & fontWeight
          </Button>
        </VStack>
      </Example>

      <Example title="Custom endIcon on Button">
        <VStack gap={2}>
          <ButtonGroup accessibilityLabel="Group">
            <Button end={<Icon color="fg" name="caretRight" size="s" />}>
              <Text font="label1">Test</Text>
            </Button>
            <Button end={<Icon active color="fg" name="add" size="s" />} variant="secondary">
              <Text font="label1">Test</Text>
            </Button>
            <Button end={<Icon active color="fg" name="airdrop" size="s" />} variant="secondary">
              <Text font="label1">Test</Text>
            </Button>
          </ButtonGroup>
        </VStack>
      </Example>
      <Example title="Custom wrapperStyles for Wallet">
        <Button
          transparent
          wrapperStyles={{
            base: { backgroundColor: 'green' },
          }}
        >
          Hello world
        </Button>
      </Example>

      <ThemeProvider activeColorScheme={theme.activeColorScheme} theme={defaultGradientTheme}>
        <Example title="Gradient Buttons">
          <Button
            GradientComponent={LinearGradient}
            color="fgInverse"
            gradient="brand"
            onPress={() => {}}
          >
            Brand Gradient Button
          </Button>

          <Button
            GradientComponent={LinearGradient}
            color="fgInverse"
            gradient={{
              direction: 'to-r',
              colors: [theme.color.bgPositive, theme.color.bgPrimary],
            }}
            onPress={() => {}}
          >
            Positive to Primary
          </Button>

          <Button
            GradientComponent={LinearGradient}
            color="fgInverse"
            gradient={{
              direction: 'to-r',
              colors: [theme.color.bgNegative, theme.color.bgWarning],
            }}
            onPress={() => {}}
          >
            Negative to Warning
          </Button>

          <Button
            GradientComponent={LinearGradient}
            color="fgInverse"
            gradient="premium"
            onPress={() => {}}
          >
            Premium Gradient
          </Button>

          <Button
            GradientComponent={LinearGradient}
            color="fgInverse"
            gradient={{
              direction: 45,
              colors: [theme.color.accentBoldBlue, theme.color.accentBoldPurple],
            }}
            onPress={() => {}}
          >
            Custom Angle (45°)
          </Button>

          <Button
            GradientComponent={LinearGradient}
            color="fgInverse"
            gradient={{
              direction: 'to-r',
              colors: [
                { color: theme.color.accentBoldBlue, offset: 0 },
                { color: theme.color.accentBoldPurple, offset: 0.5 },
                { color: theme.color.accentBoldRed, offset: 1 },
              ],
            }}
            onPress={() => {}}
          >
            Custom Color Stops
          </Button>
        </Example>

        <Example title="Gradient Button Block">
          <Button
            block
            GradientComponent={LinearGradient}
            color="fgInverse"
            gradient="brand"
            onPress={() => {}}
          >
            Full Width Gradient Button
          </Button>

          <Button
            block
            GradientComponent={LinearGradient}
            color="fgInverse"
            gradient={{
              direction: 'to-r',
              colors: [theme.color.accentBoldPurple, theme.color.transparent],
            }}
            onPress={() => {}}
          >
            Multi-Color Gradient
          </Button>

          <Button
            block
            GradientComponent={LinearGradient}
            color="fgInverse"
            gradient="positive"
            onPress={() => {}}
            startIcon="checkmark"
          >
            Gradient with Icon
          </Button>
        </Example>
        <Example title="Gradient Button Blend Styles">
          <Button
            variant="gradient"
            GradientComponent={LinearGradient}
            blendStyles={{
              backgroundGradient: {
                direction: 'to-r',
                colors: [theme.color.accentBoldYellow, theme.color.accentBoldPurple],
              },
              pressedBackgroundGradient: {
                direction: 'to-r',
                colors: [theme.color.accentBoldBlue, theme.color.accentBoldPurple],
              },
              disabledBackgroundGradient: {
                direction: 'to-r',
                colors: [theme.color.fgMuted, theme.color.transparent],
              },
            }}
          >
            Blend Styles
          </Button>
          <Button
            disabled
            variant="gradient"
            GradientComponent={LinearGradient}
            blendStyles={{
              backgroundGradient: {
                direction: 'to-r',
                colors: [theme.color.accentBoldYellow, theme.color.accentBoldPurple],
              },
              pressedBackgroundGradient: {
                direction: 'to-r',
                colors: [theme.color.accentBoldBlue, theme.color.accentBoldPurple],
              },
              disabledBackgroundGradient: {
                direction: 'to-r',
                colors: [theme.color.fgMuted, theme.color.transparent],
              },
            }}
          >
            Disabled Blend Styles
          </Button>
        </Example>
      </ThemeProvider>

      <Example title="Custom Theme Gradient Presets">
        <CustomThemeGradientExample />
      </Example>
    </ExampleScreen>
  );
};

/**
 * Custom theme with overridden gradient presets.
 * The `lightGradient` and `darkGradient` properties allow you to override
 * default presets or define custom gradient configurations using hex/rgba colors.
 */
const customTheme: ThemeConfig = {
  ...defaultGradientTheme,
  lightGradient: {
    // Override the default 'brand' gradient for light mode
    brand: {
      direction: 'to-r',
      colors: [defaultTheme.lightColor.bgWarning, defaultTheme.lightColor.accentBoldPurple],
    },
    // Override the default 'premium' gradient for light mode
    premium: {
      direction: 45,
      colors: [defaultTheme.lightColor.bgNegative, defaultTheme.lightColor.bgWarning],
    },
  },
  darkGradient: {
    // Override the default 'brand' gradient for dark mode
    brand: {
      direction: 'to-r',
      colors: [defaultTheme.darkColor.bgWarning, defaultTheme.darkColor.accentBoldPurple],
    },
    // Override the default 'premium' gradient for dark mode
    premium: {
      direction: 45,
      colors: [defaultTheme.darkColor.bgNegative, defaultTheme.darkColor.bgWarning],
    },
  },
};

function CustomThemeGradientExample() {
  const { activeColorScheme } = useTheme();

  return (
    <ThemeProvider activeColorScheme={activeColorScheme} theme={customTheme}>
      <VStack gap={2}>
        <Text color="fgMuted" font="caption">
          Using ThemeProvider with custom gradient presets:
        </Text>

        <Button
          GradientComponent={LinearGradient}
          color="fgInverse"
          gradient="brand"
          onPress={() => {}}
        >
          Custom Brand Gradient
        </Button>

        <Button
          GradientComponent={LinearGradient}
          color="fgInverse"
          gradient="premium"
          onPress={() => {}}
        >
          Custom Premium Gradient
        </Button>

        <Text color="fgMuted" font="caption">
          Theme: gradients.brand = to-r, #F5A623 → #7B3FE4
        </Text>
      </VStack>
    </ThemeProvider>
  );
}

export default ButtonScreen;
