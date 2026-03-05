import React, { useState } from 'react';
import type { ThemeVars } from '@coinbase/cds-common/core/theme';

import { Button } from '../../buttons/Button';
import { TextInput } from '../../controls';
import { useTheme } from '../../hooks/useTheme';
import { HStack, VStack } from '../../layout';
import { defaultGradientTheme } from '../../themes/gradients';
import { Text } from '../../typography';
import { getInteractableStyles, Interactable } from '../Interactable';
import { ThemeProvider } from '../ThemeProvider';

export default {
  title: 'Components/Interactable',
  component: Interactable,
};

export const GeneratedColorStates = () => {
  const theme = useTheme();
  const [themeColor, setThemeColor] = useState<ThemeVars.Color>('bgPrimary');
  const [customBackground, setCustomBackground] = useState('');
  const [customHoveredBackground, setCustomHoveredBackground] = useState('');
  const [customPressedBackground, setCustomPressedBackground] = useState('');
  const [customDisabledBackground, setCustomDisabledBackground] = useState('');
  const isThemeColorValid = themeColor in theme.color;
  const blendStyles = {
    background: customBackground ? customBackground : undefined,
    hoveredBackground: customHoveredBackground ? customHoveredBackground : undefined,
    pressedBackground: customPressedBackground ? customPressedBackground : undefined,
    disabledBackground: customDisabledBackground ? customDisabledBackground : undefined,
  };
  const data = isThemeColorValid
    ? getInteractableStyles({ theme, background: themeColor, blendStyles })
    : {};

  const handleReset = () => {
    setThemeColor('bgPrimary');
    setCustomBackground('');
    setCustomHoveredBackground('');
    setCustomPressedBackground('');
    setCustomDisabledBackground('');
  };
  return (
    <VStack gap={2}>
      <Button alignSelf="end" onClick={handleReset} variant="secondary">
        Reset all fields
      </Button>
      <VStack gap={0.5}>
        <Text as="label" font="label1">
          Theme background color:
        </Text>
        <TextInput
          compact
          disabled={customBackground !== ''}
          helperText={
            !isThemeColorValid
              ? 'Please enter a valid theme color token name.'
              : 'The name of the theme color token that will be used for the base background color.'
          }
          onChange={(e) => setThemeColor(e.target.value as ThemeVars.Color)}
          value={themeColor}
          variant={!isThemeColorValid ? 'negative' : undefined}
        />
      </VStack>
      <VStack gap={0.5}>
        <Text as="label" font="label1">
          Custom background color:
        </Text>
        <TextInput
          compact
          helperText="A custom color for the base background color. Accepts hex, rgba, hsl, etc. If this is set, the theme background color will not be used."
          onChange={(e) => setCustomBackground(e.target.value)}
          value={customBackground}
        />
      </VStack>
      <VStack gap={0.5}>
        <Text as="label" font="label1">
          Custom base hover color:
        </Text>
        <TextInput
          compact
          helperText={
            'A custom base color for the generated hover color. Accepts hex, rgba, hsl, etc.'
          }
          onChange={(e) => setCustomHoveredBackground(e.target.value)}
          value={customHoveredBackground}
        />
      </VStack>
      <VStack gap={0.5}>
        <Text as="label" font="label1">
          Custom base pressed color:
        </Text>
        <TextInput
          compact
          helperText={
            'A custom base color for the generated pressed color. Accepts hex, rgba, hsl, etc.'
          }
          onChange={(e) => setCustomPressedBackground(e.target.value)}
          value={customPressedBackground}
        />
      </VStack>
      <VStack gap={0.5}>
        <Text as="label" font="label1">
          Custom disabled color:
        </Text>
        <TextInput
          compact
          helperText={
            'A custom base color for the generated disabled color. Accepts hex, rgba, hsl, etc.'
          }
          onChange={(e) => setCustomDisabledBackground(e.target.value)}
          value={customDisabledBackground}
        />
      </VStack>
      <Interactable
        background={themeColor}
        blendStyles={blendStyles}
        borderRadius={300}
        padding={2}
      >
        <Text font="display1">Normal</Text>
      </Interactable>

      <Interactable
        pressed
        background={themeColor}
        blendStyles={blendStyles}
        borderRadius={300}
        padding={2}
      >
        <Text font="display1">Pressed</Text>
      </Interactable>

      <Interactable
        disabled
        background={themeColor}
        blendStyles={blendStyles}
        borderRadius={300}
        padding={2}
      >
        <Text font="display1">Disabled</Text>
      </Interactable>

      <VStack background="bgAlternate" borderRadius={300} padding={2}>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </VStack>
    </VStack>
  );
};

export const GradientStates = () => {
  const theme = useTheme();
  return (
    <ThemeProvider activeColorScheme={theme.activeColorScheme} theme={defaultGradientTheme}>
      <VStack gap={3}>
        <Text font="label1">Theme preset gradient (gradient prop)</Text>
        <HStack gap={2}>
          <Interactable borderRadius={300} gradient="brand" padding={2}>
            <Text color="fgInverse" font="body">
              Brand preset
            </Text>
          </Interactable>
          <Interactable borderRadius={300} gradient="premium" padding={2}>
            <Text color="fgInverse" font="body">
              Premium preset
            </Text>
          </Interactable>
          <Interactable borderRadius={300} gradient="positive" padding={2}>
            <Text color="fgInverse" font="body">
              Positive preset
            </Text>
          </Interactable>
        </HStack>

        <Text font="label1">Custom gradient (gradientConfig prop)</Text>
        <HStack gap={2}>
          <Interactable
            borderRadius={300}
            gradientConfig={{
              colors: [theme.color.accentBoldBlue, theme.color.accentBoldPurple],
              angle: 90,
            }}
            padding={2}
          >
            <Text color="fgInverse" font="body">
              Horizontal
            </Text>
          </Interactable>
          <Interactable
            borderRadius={300}
            borderWidth={300}
            gradientConfig={{
              colors: [
                theme.color.accentBoldGreen,
                theme.color.accentBoldBlue,
                theme.color.accentBoldPurple,
              ],
              stops: [0, 0.5, 1],
              angle: 135,
            }}
            padding={2}
          >
            <Text color="fgInverse" font="body">
              Multi-color diagonal
            </Text>
          </Interactable>
        </HStack>

        <Text font="label1">Gradient interaction states (blendStyles — hover/press/disabled)</Text>
        <Text color="fgMuted" font="caption">
          Hover and press the buttons to see gradient transitions
        </Text>
        <HStack gap={2}>
          <Interactable
            blendStyles={{
              backgroundGradient: `linear-gradient(90deg, ${theme.color.accentBoldBlue}, ${theme.color.accentBoldPurple})`,
              hoveredBackgroundGradient: `linear-gradient(90deg, ${theme.color.accentBoldPurple}, ${theme.color.accentBoldBlue})`,
              pressedBackgroundGradient: `linear-gradient(90deg, ${theme.color.accentBoldGreen}, ${theme.color.accentBoldBlue})`,
            }}
            borderRadius={300}
            padding={2}
          >
            <Text color="fgInverse" font="body">
              Hover / Press changes gradient
            </Text>
          </Interactable>

          <Interactable
            disabled
            blendStyles={{
              backgroundGradient: `linear-gradient(90deg, ${theme.color.accentBoldBlue}, ${theme.color.accentBoldPurple})`,
              disabledBackgroundGradient: `linear-gradient(90deg, ${theme.color.bgSecondary}, ${theme.color.bgTertiary})`,
            }}
            borderRadius={300}
            borderWidth={300}
            padding={2}
          >
            <Text color="fgMuted" font="body">
              Disabled gradient
            </Text>
          </Interactable>
        </HStack>
      </VStack>
    </ThemeProvider>
  );
};
