import React from 'react';

import { useTheme } from '../../hooks/useTheme';
import { ThemeProvider } from '../../system/ThemeProvider';
import { defaultGradientTheme } from '../../themes/gradients';
import { Text } from '../../typography/Text';
import { GradientBox } from '../GradientBox';
import { VStack } from '../VStack';

export default {
  title: 'Components/GradientBox (tsx)',
  component: GradientBox,
};

export const Default = () => {
  const theme = useTheme();

  return (
    <VStack gap={2}>
      {/* Theme Gradient Presets using gradient prop */}
      <ThemeProvider activeColorScheme={theme.activeColorScheme} theme={defaultGradientTheme}>
        <Text as="h2" display="block" font="title3">
          Theme Gradient Presets (gradient)
        </Text>
        <VStack gap={1}>
          {(['primary', 'brand', 'positive', 'negative', 'premium'] as const).map((preset) => (
            <GradientBox key={preset} borderRadius={200} gradient={preset} padding={2}>
              <Text as="p" color="fgInverse" display="block" font="body">
                Preset: {preset}
              </Text>
            </GradientBox>
          ))}
        </VStack>
      </ThemeProvider>

      {/* Custom Gradients using dangerouslySetGradient */}
      <Text as="h2" display="block" font="title3">
        Custom Linear Gradients (dangerouslySetGradient)
      </Text>
      <VStack gap={1}>
        <GradientBox
          borderRadius={200}
          dangerouslySetGradient={`linear-gradient(90deg, ${theme.color.accentBoldBlue}, ${theme.color.accentBoldPurple})`}
          padding={2}
        >
          <Text as="p" color="fgInverse" display="block" font="body">
            Horizontal (left to right)
          </Text>
        </GradientBox>
        <GradientBox
          borderRadius={200}
          dangerouslySetGradient={`linear-gradient(180deg, ${theme.color.bgNegative}, ${theme.color.bgWarning})`}
          padding={2}
        >
          <Text as="p" color="fgInverse" display="block" font="body">
            Vertical (top to bottom)
          </Text>
        </GradientBox>
        <GradientBox
          borderRadius={200}
          dangerouslySetGradient={`linear-gradient(135deg, ${theme.color.accentBoldBlue}, ${theme.color.accentBoldPurple})`}
          padding={2}
        >
          <Text as="p" color="fgInverse" display="block" font="body">
            Diagonal (135°)
          </Text>
        </GradientBox>
        <GradientBox
          borderRadius={200}
          dangerouslySetGradient={`linear-gradient(45deg, ${theme.color.bgPositive}, ${theme.color.accentBoldBlue})`}
          padding={2}
        >
          <Text as="p" color="fgInverse" display="block" font="body">
            Custom angle (45°)
          </Text>
        </GradientBox>
      </VStack>

      {/* Multiple Color Stops */}
      <Text as="h2" display="block" font="title3">
        Multiple Color Stops
      </Text>
      <VStack gap={1}>
        <GradientBox
          borderRadius={200}
          dangerouslySetGradient={`linear-gradient(90deg, ${theme.color.bgNegative}, ${theme.color.bgWarning}, ${theme.color.bgPositive}, ${theme.color.accentBoldBlue})`}
          padding={2}
        >
          <Text as="p" color="fgInverse" display="block" font="body">
            Four color stops
          </Text>
        </GradientBox>
        <GradientBox
          borderRadius={200}
          dangerouslySetGradient={`linear-gradient(90deg, ${theme.color.accentBoldBlue} 0%, ${theme.color.bgPositive} 70%, ${theme.color.bgWarning} 100%)`}
          padding={2}
        >
          <Text as="p" color="fgInverse" display="block" font="body">
            Custom stop positions (0%, 70%, 100%)
          </Text>
        </GradientBox>
      </VStack>

      {/* Other Gradient Types */}
      <Text as="h2" display="block" font="title3">
        Other Gradient Types
      </Text>
      <VStack gap={1}>
        <GradientBox
          borderRadius={200}
          dangerouslySetGradient={`radial-gradient(circle, ${theme.color.accentBoldBlue}, ${theme.color.accentBoldPurple})`}
          height={150}
          padding={2}
        >
          <Text as="p" color="fgInverse" display="block" font="body">
            Radial gradient
          </Text>
        </GradientBox>
        <GradientBox
          borderRadius={1000}
          dangerouslySetGradient={`conic-gradient(from 0deg, ${theme.color.bgNegative}, ${theme.color.bgWarning}, ${theme.color.bgPositive}, ${theme.color.accentBoldBlue}, ${theme.color.accentBoldPurple}, ${theme.color.bgNegative})`}
          height={150}
          padding={2}
          width={150}
        >
          <Text as="p" color="fgInverse" display="block" font="body">
            Conic
          </Text>
        </GradientBox>
        <GradientBox
          borderRadius={200}
          dangerouslySetGradient={`repeating-linear-gradient(45deg, ${theme.color.accentBoldBlue}, ${theme.color.accentBoldBlue} 10px, ${theme.color.accentBoldPurple} 10px, ${theme.color.accentBoldPurple} 20px)`}
          height={150}
          padding={2}
        >
          <Text as="p" color="fgInverse" display="block" font="body">
            Repeating linear gradient
          </Text>
        </GradientBox>
      </VStack>
    </VStack>
  );
};
