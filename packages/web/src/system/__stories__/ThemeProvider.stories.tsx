import React from 'react';
import type { ColorScheme } from '@coinbase/cds-common/core/theme';

import { Button, IconButton } from '../../buttons';
import type { ComponentsConfig, ThemeConfig } from '../../core/theme';
import { useTheme } from '../../hooks/useTheme';
import { Divider } from '../../layout/Divider';
import { HStack } from '../../layout/HStack';
import { VStack } from '../../layout/VStack';
import { defaultTheme } from '../../themes/defaultTheme';
import { Text } from '../../typography/Text';
import { ThemeProvider, useThemeProviderStyles } from '../ThemeProvider';

const Child = ({ expectedColorScheme }: { expectedColorScheme: ColorScheme }) => {
  const theme = useTheme();
  return (
    <VStack background="bg">
      <VStack gap={3} padding={1}>
        <VStack>
          <Button variant="secondary">Secondary button</Button>
          <Button variant="primary">Primary button</Button>
          <Text as="p" color="bgSecondary" display="block" font="body">
            Secondary text
          </Text>
        </VStack>
        <VStack bordered borderRadius={400} elevation={1} gap={1} padding={2}>
          <Text as="p" display="block" font="body">
            Elevation 1
          </Text>
          <Button variant="secondary">Secondary button</Button>
          <Button variant="primary">Primary button</Button>
        </VStack>
        <VStack bordered borderRadius={400} elevation={2} gap={1} padding={2}>
          <Text as="p" display="block" font="body">
            Elevation 2
          </Text>
          <Button variant="secondary">Secondary button</Button>
          <Button variant="primary">Primary button</Button>
        </VStack>
        <Text as="p" display="block" font="body">
          ClassName value at nested ThemeProvider parent level: {theme.activeColorScheme}
        </Text>
        <Text as="p" display="block" font="body">
          Should be {expectedColorScheme}
        </Text>
      </VStack>
    </VStack>
  );
};

const StyledThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  const style = useThemeProviderStyles(theme);
  return <div style={style}>{children}</div>;
};

const ChildThemeProviderDark = () => {
  const theme = useTheme();
  return (
    <ThemeProvider activeColorScheme="dark" theme={theme}>
      <StyledThemeProvider>
        <Child expectedColorScheme="dark" />
      </StyledThemeProvider>
    </ThemeProvider>
  );
};

const customTheme: ThemeConfig = {
  ...defaultTheme,
  lightColor: {
    ...defaultTheme.lightColor,
    bg: `rgb(${defaultTheme.lightSpectrum.orange50})`,
    bgPrimary: `rgb(${defaultTheme.lightSpectrum.red20})`,
    bgSecondary: `rgb(${defaultTheme.lightSpectrum.blue50})`,
  },
  darkColor: {
    ...defaultTheme.darkColor,
    bg: `rgb(${defaultTheme.darkSpectrum.orange50})`,
    bgPrimary: `rgb(${defaultTheme.darkSpectrum.red20})`,
    bgSecondary: `rgb(${defaultTheme.darkSpectrum.blue50})`,
  },
};

const ChildThemeWithOverrides = () => {
  const theme = useTheme();
  return (
    <ThemeProvider activeColorScheme={theme.activeColorScheme} theme={customTheme}>
      <Text as="p" display="block" font="body">
        With theme overrides
      </Text>
      <Child expectedColorScheme="light" />
    </ThemeProvider>
  );
};

const ChildThemeWithOverridesDark = () => {
  return (
    <ThemeProvider activeColorScheme="dark" theme={customTheme}>
      <Text as="p" display="block" font="body">
        With theme overrides
      </Text>
      <Child expectedColorScheme="dark" />
    </ThemeProvider>
  );
};

const ChildThemeWithNestedOverrides = () => {
  const theme = useTheme();
  return (
    <ThemeProvider activeColorScheme={theme.activeColorScheme} theme={customTheme}>
      <ThemeProvider activeColorScheme="light" theme={theme}>
        <Text as="p" display="block" font="body">
          With nested theme overrides
        </Text>
        <Child expectedColorScheme="light" />
      </ThemeProvider>
    </ThemeProvider>
  );
};

const ChildThemeWithNestedOverridesDark = () => {
  const theme = useTheme();
  return (
    <ThemeProvider activeColorScheme="dark" theme={customTheme}>
      <ThemeProvider activeColorScheme="dark" theme={theme}>
        <Text as="p" display="block" font="body">
          With nested theme overrides
        </Text>
        <Child expectedColorScheme="dark" />
      </ThemeProvider>
    </ThemeProvider>
  );
};

export const ThemeProviderTest = () => {
  const theme = useTheme();
  return (
    <ThemeProvider activeColorScheme="light" theme={theme}>
      <VStack gap={3}>
        <Child expectedColorScheme="light" />
        <ChildThemeProviderDark />
        <ChildThemeWithOverrides />
        <ChildThemeWithOverridesDark />
        <ChildThemeWithNestedOverrides />
        <ChildThemeWithNestedOverridesDark />
      </VStack>
    </ThemeProvider>
  );
};

// ============================================================================
// Components Config Examples
// ============================================================================

/**
 * Simple ThemeProvider with component configuration.
 * All Buttons and IconButtons will use the configured defaults.
 */
const SimpleComponentsConfig = () => {
  const componentsConfig: ComponentsConfig = {
    Button: {
      variant: 'secondary',
      compact: true,
    },
    IconButton: {
      variant: 'secondary',
    },
  };

  return (
    <ThemeProvider activeColorScheme="light" components={componentsConfig} theme={defaultTheme}>
      <VStack gap={{ base: 2, tablet: 3 }} padding={{ base: 2, tablet: 4 }}>
        <Text as="h3" display="block" font="title2">
          Simple Components Config
        </Text>
        <Text as="p" color="fgMuted" display="block" font="body">
          All buttons inherit: variant=&quot;secondary&quot;, compact=true
        </Text>

        <HStack flexWrap="wrap" gap={2}>
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </HStack>

        <HStack flexWrap="wrap" gap={2}>
          <IconButton name="settings" />
          <IconButton name="info" />
          <IconButton name="close" />
        </HStack>
      </VStack>
    </ThemeProvider>
  );
};

/**
 * Component configuration with local prop overrides.
 * Local props take precedence over ThemeProvider configuration.
 */
const ComponentsConfigWithLocalOverrides = () => {
  const componentsConfig: ComponentsConfig = {
    Button: {
      variant: 'secondary',
      compact: true,
    },
    IconButton: {
      variant: 'secondary',
    },
  };

  return (
    <ThemeProvider activeColorScheme="light" components={componentsConfig} theme={defaultTheme}>
      <VStack gap={{ base: 2, tablet: 3 }} padding={{ base: 2, tablet: 4 }}>
        <Text as="h3" display="block" font="title2">
          Components Config with Local Overrides
        </Text>
        <Text as="p" color="fgMuted" display="block" font="body">
          Theme provides defaults, but local props override them
        </Text>

        <VStack gap={2}>
          <Text as="p" display="block" font="label1">
            Buttons (theme: secondary/compact, local overrides)
          </Text>
          <HStack flexWrap="wrap" gap={2}>
            <Button>Themed Default</Button>
            <Button variant="primary">Local Primary</Button>
            <Button compact={false}>Local Not Compact</Button>
          </HStack>
        </VStack>

        <VStack gap={2}>
          <Text as="p" display="block" font="label1">
            IconButtons (theme: secondary, local overrides)
          </Text>
          <HStack flexWrap="wrap" gap={2}>
            <IconButton name="settings" />
            <IconButton name="info" variant="primary" />
            <IconButton compact={false} name="close" />
          </HStack>
        </VStack>
      </VStack>
    </ThemeProvider>
  );
};

/**
 * Nested ThemeProviders with component configuration.
 * Child ThemeProvider merges with parent configuration.
 */
const NestedComponentsConfig = () => {
  const parentConfig: ComponentsConfig = {
    Button: {
      variant: 'secondary',
    },
    IconButton: {
      variant: 'secondary',
      compact: false,
    },
  };

  const childConfig: ComponentsConfig = {
    Button: {
      compact: true,
    },
    IconButton: {
      compact: true,
    },
  };

  return (
    <ThemeProvider activeColorScheme="light" components={parentConfig} theme={defaultTheme}>
      <VStack gap={{ base: 2, tablet: 4 }} padding={{ base: 2, tablet: 4 }}>
        <Text as="h3" display="block" font="title2">
          Nested Components Config
        </Text>

        <VStack gap={2}>
          <Text as="p" display="block" font="label1">
            Parent Level (variant: secondary)
          </Text>
          <HStack flexWrap="wrap" gap={2}>
            <Button>Parent Button 1</Button>
            <Button>Parent Button 2</Button>
            <IconButton name="settings" />
            <IconButton name="info" />
          </HStack>
        </VStack>

        <ThemeProvider activeColorScheme="light" components={childConfig} theme={defaultTheme}>
          <VStack
            gap={2}
            padding={{ base: 2, tablet: 3 }}
            style={{ border: '2px dashed var(--color-bgPositive)' }}
          >
            <Text as="p" display="block" font="label1">
              Child Level (inherits secondary + adds compact)
            </Text>
            <HStack flexWrap="wrap" gap={2}>
              <Button>Child Button 1</Button>
              <Button>Child Button 2</Button>
              <IconButton name="settings" />
              <IconButton name="info" />
            </HStack>
          </VStack>
        </ThemeProvider>
      </VStack>
    </ThemeProvider>
  );
};

/**
 * Complex nested ThemeProviders with multiple override levels.
 * Demonstrates deep nesting and configuration inheritance.
 */
const ComplexNestedComponentsConfig = () => {
  const level1Config: ComponentsConfig = {
    Button: {
      variant: 'primary',
      style: {
        borderColor: 'red',
      },
    },
    IconButton: {
      variant: 'primary',
      compact: false,
      style: {
        borderColor: 'red',
      },
    },
  };

  const level2Config: ComponentsConfig = {
    Button: {
      variant: 'secondary',
      compact: true,
      style: {
        borderColor: 'green',
      },
    },
    IconButton: {
      compact: true,
      style: {
        borderColor: 'green',
      },
    },
  };

  const level3Config: ComponentsConfig = {
    Button: {
      transparent: true,
      variant: 'positive',
      style: {
        borderColor: 'blue',
      },
    },
    IconButton: {
      transparent: true,
      variant: 'positive',
      style: {
        borderColor: 'blue',
      },
    },
  };

  return (
    <ThemeProvider activeColorScheme="light" components={level1Config} theme={defaultTheme}>
      <VStack gap={{ base: 2, tablet: 4 }} padding={{ base: 2, tablet: 4 }}>
        <Text as="h3" display="block" font="title2">
          Complex Nested Components Config
        </Text>

        <VStack gap={2}>
          <Text as="p" display="block" font="label1">
            Level 1: variant=&quot;primary&quot;, borderColor=&quot;red&quot;
          </Text>
          <HStack flexWrap="wrap" gap={2}>
            <Button>Level 1 Button</Button>
            <IconButton name="settings" />
          </HStack>
        </VStack>

        <ThemeProvider activeColorScheme="light" components={level2Config} theme={defaultTheme}>
          <VStack
            gap={2}
            padding={{ base: 2, tablet: 3 }}
            style={{ border: '2px dashed var(--color-bgPositive)' }}
          >
            <Text as="p" display="block" font="label1">
              Level 2: variant=&quot;secondary&quot;, compact=true, borderColor=&quot;green&quot;
            </Text>
            <HStack flexWrap="wrap" gap={2}>
              <Button>Level 2 Button</Button>
              <IconButton name="info" />
            </HStack>

            <ThemeProvider activeColorScheme="light" components={level3Config} theme={defaultTheme}>
              <VStack
                gap={2}
                padding={{ base: 2, tablet: 3 }}
                style={{ border: '2px dashed var(--color-bgPrimary)' }}
              >
                <Text as="p" display="block" font="label1">
                  Level 3: adds transparent=true, variant=positive, borderColor=&quot;blue&quot;
                </Text>
                <HStack flexWrap="wrap" gap={2}>
                  <Button>Level 3 Button</Button>
                  <IconButton name="close" />
                </HStack>
              </VStack>
            </ThemeProvider>
          </VStack>
        </ThemeProvider>
      </VStack>
    </ThemeProvider>
  );
};

/**
 * Nested ThemeProviders with selective component overrides.
 * Some nested providers have config, others don't.
 */
const NestedWithSelectiveOverrides = () => {
  const parentConfig: ComponentsConfig = {
    Button: {
      variant: 'primary',
      compact: true,
    },
    IconButton: {
      variant: 'primary',
    },
  };

  const childOverrideConfig: ComponentsConfig = {
    Button: {
      variant: 'secondary',
    },
    IconButton: {
      variant: 'secondary',
    },
  };

  return (
    <ThemeProvider activeColorScheme="light" components={parentConfig} theme={defaultTheme}>
      <VStack gap={{ base: 2, tablet: 4 }} padding={{ base: 2, tablet: 4 }}>
        <Text as="h3" display="block" font="title2">
          Nested with Selective Overrides
        </Text>

        <VStack gap={2}>
          <Text as="p" display="block" font="label1">
            Parent: primary + compact
          </Text>
          <HStack flexWrap="wrap" gap={2}>
            <Button>Parent Button</Button>
            <IconButton name="settings" />
          </HStack>
        </VStack>

        <ThemeProvider activeColorScheme="light" theme={defaultTheme}>
          <VStack
            gap={2}
            padding={{ base: 2, tablet: 3 }}
            style={{ border: '2px dashed var(--color-bgPositive)' }}
          >
            <Text as="p" display="block" font="label1">
              Child 1: No config override (inherits parent)
            </Text>
            <HStack flexWrap="wrap" gap={2}>
              <Button>Child 1 Button</Button>
              <IconButton name="info" />
            </HStack>
          </VStack>
        </ThemeProvider>

        <ThemeProvider
          activeColorScheme="light"
          components={childOverrideConfig}
          theme={defaultTheme}
        >
          <VStack
            gap={2}
            padding={{ base: 2, tablet: 3 }}
            style={{ border: '2px dashed var(--color-bgPositive)' }}
          >
            <Text as="p" display="block" font="label1">
              Child 2: Overrides to secondary (keeps compact)
            </Text>
            <HStack flexWrap="wrap" gap={2}>
              <Button>Child 2 Button</Button>
              <IconButton name="close" />
            </HStack>
          </VStack>
        </ThemeProvider>
      </VStack>
    </ThemeProvider>
  );
};

/**
 * Comprehensive example combining component config with local overrides
 * and nested providers.
 */
const ComprehensiveExample = () => {
  const globalConfig: ComponentsConfig = {
    Button: {
      variant: 'secondary',
    },
    IconButton: {
      variant: 'secondary',
    },
  };

  const sectionConfig: ComponentsConfig = {
    Button: {
      compact: true,
    },
  };

  return (
    <ThemeProvider activeColorScheme="light" components={globalConfig} theme={defaultTheme}>
      <VStack gap={{ base: 2, tablet: 4 }} padding={{ base: 2, tablet: 4 }}>
        <Text as="h3" display="block" font="title2">
          Comprehensive Example
        </Text>
        <Text as="p" color="fgMuted" display="block" font="body">
          Demonstrates global config, nested overrides, and local prop overrides
        </Text>

        <VStack gap={2}>
          <Text as="p" display="block" font="label1">
            Global Level: All buttons are secondary variant
          </Text>
          <HStack flexWrap="wrap" gap={2}>
            <Button>Global Default</Button>
            <Button variant="primary">Local Override to Primary</Button>
            <IconButton name="settings" />
            <IconButton name="info" variant="primary" />
          </HStack>
        </VStack>

        <ThemeProvider activeColorScheme="light" components={sectionConfig} theme={defaultTheme}>
          <VStack
            gap={{ base: 2, tablet: 3 }}
            padding={{ base: 2, tablet: 3 }}
            style={{ border: '2px dashed var(--color-bgPositive)' }}
          >
            <Text as="p" display="block" font="label1">
              Section Level: Adds compact=true to global config
            </Text>
            <HStack flexWrap="wrap" gap={2}>
              <Button>Section Default (compact)</Button>
              <Button variant="positive">Local Positive (still compact)</Button>
              <Button compact={false}>Local Not Compact</Button>
            </HStack>

            <HStack flexWrap="wrap" gap={2}>
              <IconButton name="settings" />
              <IconButton name="info" variant="primary" />
            </HStack>
          </VStack>
        </ThemeProvider>
      </VStack>
    </ThemeProvider>
  );
};

export const ThemeProviderWithComponentsConfig = () => {
  return (
    <VStack gap={{ base: 1, tablet: 2 }}>
      <SimpleComponentsConfig />
      <Divider />
      <ComponentsConfigWithLocalOverrides />
      <Divider />
      <NestedComponentsConfig />
      <Divider />
      <ComplexNestedComponentsConfig />
      <Divider />
      <NestedWithSelectiveOverrides />
      <Divider />
      <ComprehensiveExample />
      <Divider />
    </VStack>
  );
};

ThemeProviderTest.parameters = {
  a11y: {
    config: {
      /**
       * Color contrast ratio doesn't need to meet 4.5:1, as these are test examples for color override
       * @link https://dequeuniversity.com/rules/axe/4.3/color-contrast
       */
      rules: [{ id: 'color-contrast', enabled: false }],
    },
  },
};

export default {
  title: 'Components/ThemeProvider',
};
