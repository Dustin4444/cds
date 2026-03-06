import React from 'react';
import { names } from '@coinbase/cds-icons/names';

import { useTheme } from '../../hooks/useTheme';
import { HStack, VStack } from '../../layout';
import { ThemeProvider } from '../../system/ThemeProvider';
import { defaultGradientTheme } from '../../themes/gradients/defaultGradientTheme';
import { Text } from '../../typography/Text';
import { IconButton, type IconButtonBaseProps } from '../IconButton';

const iconName = 'arrowsHorizontal';
const accessibilityLabel = 'Horizontal arrows';

const variants = [
  {
    component: (props?: Partial<IconButtonBaseProps>) => (
      <IconButton name={iconName} variant="primary" {...props} />
    ),
    title: 'Primary',
  },
  {
    component: (props?: Partial<IconButtonBaseProps>) => (
      <IconButton transparent name={iconName} variant="primary" {...props} />
    ),
    title: 'Primary transparent',
  },
  {
    component: (props?: Partial<IconButtonBaseProps>) => (
      <IconButton name={iconName} variant="secondary" {...props} />
    ),
    title: 'Secondary',
  },
  {
    component: (props?: Partial<IconButtonBaseProps>) => (
      <IconButton transparent name={iconName} variant="secondary" {...props} />
    ),
    title: 'Secondary transparent',
  },
  {
    component: (props?: Partial<IconButtonBaseProps>) => (
      <IconButton name={iconName} variant="foregroundMuted" {...props} />
    ),
    title: 'ForegroundMuted',
  },
  {
    component: (props?: Partial<IconButtonBaseProps>) => (
      <IconButton transparent name={iconName} variant="foregroundMuted" {...props} />
    ),
    title: 'ForegroundMuted transparent',
  },
];

export const Default = () => (
  <VStack gap={6}>
    <VStack gap={2}>
      <Text font="title3">Basic Usage</Text>
      <IconButton accessibilityLabel="Horizontal arrows" name="arrowsHorizontal" />
    </VStack>
    <VStack gap={2}>
      <Text font="title3">States</Text>
      <HStack alignItems="center" gap={4}>
        <IconButton
          disabled
          accessibilityLabel={accessibilityLabel}
          name={iconName}
          variant="primary"
        />
        <Text font="body">Disabled primary</Text>
      </HStack>
      <HStack alignItems="center" gap={4}>
        <IconButton disabled accessibilityLabel={accessibilityLabel} name={iconName} />
        <Text font="body">Disabled secondary</Text>
      </HStack>
    </VStack>
    <VStack gap={2}>
      <Text font="title3">Without Compact Styles</Text>
      <IconButton accessibilityLabel={accessibilityLabel} compact={false} name={iconName} />
    </VStack>
    <VStack gap={2}>
      <Text font="title3">Custom Style</Text>
      <IconButton
        accessibilityLabel={accessibilityLabel}
        compact={false}
        name={iconName}
        style={{ backgroundColor: 'red', transform: 'scale(0.5)' }}
      />
    </VStack>
    <VStack gap={2}>
      <Text font="title3">Variants</Text>
      {variants.map((variant, index) => (
        <HStack key={index} alignItems="center" gap={4}>
          {variant.component({ accessibilityLabel })}
          <Text font="body">{variant.title}</Text>
        </HStack>
      ))}
    </VStack>
    <VStack gap={2}>
      <Text font="title3">Variants Loading</Text>
      {variants.map((variant, index) => (
        <HStack key={index} alignItems="center" gap={4}>
          {variant.component({ accessibilityLabel, loading: true })}
          <Text font="body">{variant.title}</Text>
        </HStack>
      ))}
    </VStack>
  </VStack>
);

const IconButtonSheet = ({ startIndex, endIndex }: { startIndex: number; endIndex: number }) => {
  return (
    <HStack flexWrap="wrap" gap={2} paddingBottom={2}>
      {names.slice(startIndex, endIndex).map((name) => (
        <VStack key={name}>
          <HStack alignItems="center" gap={2}>
            <IconButton accessibilityLabel={name} name={name} variant="primary" />
            <IconButton accessibilityLabel={name} name={name} variant="secondary" />
            <IconButton accessibilityLabel={name} name={name} variant="foregroundMuted" />
          </HStack>
        </VStack>
      ))}
    </HStack>
  );
};

// single sheet is too large for Percy, need to split up in chunks of 160 to stay under resource limit
export const Sheet1 = () => <IconButtonSheet endIndex={160} startIndex={0} />;
export const Sheet2 = () => <IconButtonSheet endIndex={320} startIndex={160} />;
export const Sheet3 = () => <IconButtonSheet endIndex={480} startIndex={320} />;
export const Sheet4 = () => <IconButtonSheet endIndex={640} startIndex={480} />;

export default {
  title: 'Components/Buttons/IconButton',
  component: IconButton,
};

export const GradientVariants = () => {
  const theme = useTheme();
  return (
    <VStack gap={6}>
      <VStack gap={2}>
        <Text font="title3">Theme gradient preset (gradient prop)</Text>
        <ThemeProvider activeColorScheme={theme.activeColorScheme} theme={defaultGradientTheme}>
          <HStack alignItems="center" gap={4}>
            <IconButton
              accessibilityLabel="Brand gradient"
              gradient="brand"
              name="arrowsHorizontal"
              variant="gradient"
            />
            <IconButton
              accessibilityLabel="Premium gradient"
              gradient="premium"
              name="arrowsHorizontal"
              variant="gradient"
            />
            <IconButton
              accessibilityLabel="Positive gradient"
              gradient="positive"
              name="arrowsHorizontal"
              variant="gradient"
            />
            <IconButton
              accessibilityLabel="Positive gradient"
              gradient="negative"
              loading={true}
              name="arrowsHorizontal"
              variant="gradient"
            />
          </HStack>
        </ThemeProvider>
      </VStack>

      <VStack gap={2}>
        <Text font="title3">Custom gradient (gradientConfig prop)</Text>
        <HStack alignItems="center" gap={4}>
          <IconButton
            accessibilityLabel="Horizontal gradient"
            gradientConfig={{
              colors: [theme.color.accentBoldBlue, theme.color.accentBoldPurple],
              angle: 90,
            }}
            name="arrowsHorizontal"
            variant="gradient"
          />
          <IconButton
            accessibilityLabel="Diagonal multi-color gradient"
            gradientConfig={{
              colors: [
                theme.color.accentBoldGreen,
                theme.color.accentBoldBlue,
                theme.color.accentBoldPurple,
              ],
              stops: [0, 0.5, 1],
              angle: 135,
            }}
            name="star"
            variant="gradient"
          />
          <IconButton
            accessibilityLabel="Large gradient"
            compact={false}
            gradientConfig={{
              colors: [theme.color.accentBoldBlue, theme.color.accentBoldPurple],
              angle: 45,
            }}
            name="arrowsHorizontal"
            variant="gradient"
          />
        </HStack>
      </VStack>

      <VStack gap={2}>
        <Text font="title3">Gradient interaction states (blendStyles — hover/press/disabled)</Text>
        <Text color="fgMuted" font="caption">
          Hover and press to see gradient transitions
        </Text>
        <HStack alignItems="center" gap={4}>
          <IconButton
            accessibilityLabel="Hover gradient"
            blendStyles={{
              backgroundGradient: `linear-gradient(135deg, ${theme.color.accentBoldBlue}, ${theme.color.accentBoldPurple})`,
              hoveredBackgroundGradient: `linear-gradient(135deg, ${theme.color.accentBoldPurple}, ${theme.color.accentBoldBlue})`,
              pressedBackgroundGradient: `linear-gradient(135deg, ${theme.color.accentBoldGreen}, ${theme.color.accentBoldBlue})`,
            }}
            name="arrowsHorizontal"
            variant="gradient"
          />
          <IconButton
            disabled
            accessibilityLabel="Disabled gradient"
            blendStyles={{
              backgroundGradient: `linear-gradient(135deg, ${theme.color.accentBoldBlue}, ${theme.color.accentBoldPurple})`,
              disabledBackgroundGradient: `linear-gradient(135deg, ${theme.color.bgSecondary}, ${theme.color.bgTertiary})`,
            }}
            name="arrowsHorizontal"
            variant="gradient"
          />
        </HStack>
      </VStack>
    </VStack>
  );
};
