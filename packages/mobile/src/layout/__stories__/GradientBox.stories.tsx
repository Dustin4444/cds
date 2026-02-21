import React from 'react';

import { Example, ExampleScreen } from '../../examples/ExampleScreen';
import { useTheme } from '../../hooks/useTheme';
import { ThemeProvider } from '../../system/ThemeProvider';
import { defaultGradientTheme } from '../../themes/gradients/defaultGradientTheme';
import { Text } from '../../typography/Text';
import { GradientBox } from '../GradientBox';

const BasicGradient = () => (
  <Example title="Theme Gradient Presets">
    <GradientBox gradient="brand" padding={2}>
      <Text color="fgInverse" font="body">
        brand gradient
      </Text>
    </GradientBox>

    <GradientBox gradient="primary" padding={2}>
      <Text color="fgInverse" font="body">
        Primary gradient
      </Text>
    </GradientBox>

    <GradientBox gradient="positive" padding={2}>
      <Text color="fgInverse" font="body">
        Positive gradient
      </Text>
    </GradientBox>

    <GradientBox gradient="negative" padding={2}>
      <Text color="fgInverse" font="body">
        Negative gradient
      </Text>
    </GradientBox>

    <GradientBox gradient="premium" padding={2}>
      <Text color="fgInverse" font="body">
        Premium gradient
      </Text>
    </GradientBox>
  </Example>
);

const GradientBoxScreen = () => {
  const theme = useTheme();
  return (
    <ExampleScreen>
      <ThemeProvider activeColorScheme={theme.activeColorScheme} theme={defaultGradientTheme}>
        <BasicGradient />
        <Example title="Custom Directions (dangerouslySetGradient)">
          <GradientBox
            dangerouslySetGradient={{
              angle: 90,
              colors: [theme.color.bgPrimary, theme.color.bgPositive],
            }}
            padding={2}
          >
            <Text color="fgInverse" font="body">
              Horizontal (90° angle)
            </Text>
          </GradientBox>

          <GradientBox
            dangerouslySetGradient={{
              angle: 180,
              colors: [theme.color.bgNegative, theme.color.bgWarning],
            }}
            padding={2}
          >
            <Text color="fgInverse" font="body">
              Vertical (180° angle)
            </Text>
          </GradientBox>

          <GradientBox
            dangerouslySetGradient={{
              angle: 135,
              colors: [theme.color.bgPrimary, theme.color.accentBoldPurple],
            }}
            padding={2}
          >
            <Text color="fgInverse" font="body">
              Diagonal (135° angle)
            </Text>
          </GradientBox>

          <GradientBox
            dangerouslySetGradient={{
              angle: 45,
              colors: [theme.color.bgPositive, theme.color.bgPrimary],
            }}
            padding={2}
          >
            <Text color="fgInverse" font="body">
              Custom 45° angle
            </Text>
          </GradientBox>
        </Example>

        <Example title="Multiple Color Stops">
          <GradientBox
            dangerouslySetGradient={{
              angle: 90,
              colors: [
                theme.color.bgNegative,
                theme.color.bgWarning,
                theme.color.bgPositive,
                theme.color.bgPrimary,
              ],
              stops: [0, 0.33, 0.66, 1],
            }}
            padding={2}
          >
            <Text color="fgInverse" font="body">
              Rainbow gradient
            </Text>
          </GradientBox>
        </Example>

        <Example title="With Elevated">
          <GradientBox
            elevated
            dangerouslySetGradient={{
              colors: [theme.color.transparent, theme.color.bgPrimary],
              stops: [0, 0.6, 1],
            }}
            padding={2}
          >
            <Text color="fg" font="body">
              Elevated gradient
            </Text>
          </GradientBox>
        </Example>

        <Example title="With Box Props">
          <GradientBox
            bordered
            borderColor="bgNegative"
            borderWidth={200}
            dangerouslySetGradient={{
              colors: [theme.color.bgPrimary, theme.color.accentBoldPurple],
            }}
            padding={3}
          >
            <Text color="fgInverse" font="body">
              With border and elevation
            </Text>
          </GradientBox>
        </Example>
      </ThemeProvider>
    </ExampleScreen>
  );
};

export default GradientBoxScreen;
