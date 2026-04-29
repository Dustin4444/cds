import { useState } from 'react';
import type { ColorScheme } from '@coinbase/cds-common';
import { ThemeProvider } from '@coinbase/cds-web';
import { Chip } from '@coinbase/cds-web/chips';
import { SearchInput } from '@coinbase/cds-web/controls';
import { HeroSquare } from '@coinbase/cds-web/illustrations/themeable';
import { Box, Divider, Group, HStack, VStack } from '@coinbase/cds-web/layout';
import { Sidebar, SidebarItem } from '@coinbase/cds-web/navigation';
import { MediaQueryProvider } from '@coinbase/cds-web/system';
import { defaultTheme } from '@coinbase/cds-web/themes/defaultTheme';
import { Text } from '@coinbase/cds-web/typography';

import { AssetList } from './components/AssetList';
import { CardList } from './components/CardList';
import { CDSLogo } from './components/CDSLogo';
import { Navbar } from './components/Navbar';

const navItems = [
  {
    title: 'Assets',
    icon: 'chartPie',
  },
  {
    title: 'Trade',
    icon: 'trading',
  },
  {
    title: 'Pay',
    icon: 'pay',
  },
  {
    title: 'For you',
    icon: 'newsFeed',
  },
  {
    title: 'Earn',
    icon: 'giftBox',
  },
  {
    title: 'Borrow',
    icon: 'cash',
  },
  {
    title: 'DeFi',
    icon: 'defi',
  },
] as const;

const illustrationThemes = {
  default: {
    lightIllustrationColor: defaultTheme.lightIllustrationColor,
    darkIllustrationColor: defaultTheme.darkIllustrationColor,
  },
  blueSpectrum: {
    lightIllustrationColor: Object.fromEntries(
      Object.entries(defaultTheme.lightIllustrationColor!).map(([key, value]) => [
        key,
        `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`,
      ]),
    ),
    darkIllustrationColor: Object.fromEntries(
      Object.entries(defaultTheme.darkIllustrationColor!).map(([key, value]) => [
        key,
        `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`,
      ]),
    ),
  },
  random: {
    lightIllustrationColor: Object.fromEntries(
      Object.entries(defaultTheme.lightIllustrationColor!).map(([key, value]) => [
        key,
        `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`,
      ]),
    ),
    darkIllustrationColor: Object.fromEntries(
      Object.entries(defaultTheme.darkIllustrationColor!).map(([key, value]) => [
        key,
        `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`,
      ]),
    ),
  },
  pink: {
    lightIllustrationColor: {
      primary: 'rgb(255, 100, 100)',
      black: 'rgb(255, 100, 100)',
      white: 'rgb(255, 100, 100)',
      gray: 'rgb(255, 100, 100)',
      gray2: 'rgb(255, 100, 100)',
      gray3: 'rgb(255, 100, 100)',
      positive: 'rgb(255, 100, 100)',
      negative: 'rgb(255, 100, 100)',
      accent1: 'rgb(255, 100, 100)',
      accent2: 'rgb(255, 100, 100)',
      accent3: 'rgb(255, 100, 100)',
      accent4: 'rgb(255, 100, 100)',
      invert: 'rgb(255, 100, 100)',
      invert2: 'rgb(255, 100, 100)',
    },
    darkIllustrationColor: {
      primary: 'rgb(255, 100, 100)',
      black: 'rgb(255, 100, 100)',
      white: 'rgb(255, 100, 100)',
      gray: 'rgb(255, 100, 100)',
      gray2: 'rgb(255, 100, 100)',
      gray3: 'rgb(255, 100, 100)',
      positive: 'rgb(255, 100, 100)',
      negative: 'rgb(255, 100, 100)',
      accent1: 'rgb(255, 100, 100)',
      accent2: 'rgb(255, 100, 100)',
      accent3: 'rgb(255, 100, 100)',
      accent4: 'rgb(255, 100, 100)',
      invert: 'rgb(255, 100, 100)',
      invert2: 'rgb(255, 100, 100)',
    },
  },
};

export const App = () => {
  const [activeNavIndex, setActiveNavIndex] = useState(0);
  const [search, setSearch] = useState('');
  const activeNavItem = navItems[activeNavIndex];

  const [activeColorScheme, setActiveColorScheme] = useState<ColorScheme>('light');
  const [illustrationThemeKey, setIllustrationThemeKey] = useState('default');

  const toggleColorScheme = () => setActiveColorScheme((s) => (s === 'light' ? 'dark' : 'light'));

  return (
    <MediaQueryProvider>
      <ThemeProvider activeColorScheme={activeColorScheme} theme={defaultTheme}>
        <HStack background="bg">
          <Sidebar autoCollapse height="100vh" logo={<CDSLogo />}>
            {navItems.map(({ title, icon }, index) => (
              <SidebarItem
                key={title}
                active={index === activeNavIndex}
                icon={icon}
                onClick={() => setActiveNavIndex(index)}
                title={title}
              />
            ))}
          </Sidebar>
          <VStack width="100%" zIndex={0}>
            <Navbar title={activeNavItem.title} toggleColorScheme={toggleColorScheme} />
            <ThemeProvider activeColorScheme={activeColorScheme} theme={defaultTheme}>
              <VStack gap={2} padding={2}>
                <Text font="title1">Illustration theming</Text>
                <Text font="headline">Illustration theme</Text>
                <HStack gap={1}>
                  {Object.keys(illustrationThemes).map((themeKey) => (
                    <Chip
                      key={themeKey}
                      accessibilityLabel={`Select ${themeKey} illustration theme`}
                      invertColorScheme={illustrationThemeKey === themeKey}
                      onClick={() => setIllustrationThemeKey(themeKey)}
                    >
                      {themeKey}
                    </Chip>
                  ))}
                </HStack>
                <HStack flexWrap="wrap" gap={1}>
                  {Object.keys(
                    illustrationThemes[illustrationThemeKey as keyof typeof illustrationThemes][
                      activeColorScheme === 'light'
                        ? 'lightIllustrationColor'
                        : 'darkIllustrationColor'
                    ],
                  ).map((color) => (
                    <Box key={color} alignItems="center" gap={1} minWidth={200}>
                      <Text font="label1">{color}:</Text>{' '}
                      <Text font="body">
                        {
                          illustrationThemes[
                            illustrationThemeKey as keyof typeof illustrationThemes
                          ][
                            activeColorScheme === 'light'
                              ? 'lightIllustrationColor'
                              : 'darkIllustrationColor'
                          ][
                            color as keyof (typeof illustrationThemes)['default']['lightIllustrationColor']
                          ]
                        }
                      </Text>
                    </Box>
                  ))}
                </HStack>
                <Text font="headline">Sample illustrations</Text>
                <HStack gap={1}>
                  <HeroSquare name="accessToAdvancedCharts" />
                  <HeroSquare name="accessToAdvancedCharts" />
                  <HeroSquare name="accessToAdvancedCharts" />
                </HStack>
              </VStack>
              <Divider />
            </ThemeProvider>
            <Group
              direction="horizontal"
              divider={() => <Divider direction="vertical" />}
              width="100%"
            >
              <VStack width={{ base: 500, desktop: 660 }}>
                <Box padding={2}>
                  <SearchInput
                    compact
                    accessibilityLabel="Search"
                    clearIconAccessibilityLabel="Clear search"
                    onChangeText={setSearch}
                    placeholder="Search"
                    startIconAccessibilityLabel="Search"
                    value={search}
                  />
                </Box>
                <Box paddingX={2} width="100%">
                  <AssetList pageSize={5} />
                </Box>
              </VStack>
              <Box paddingX={3} paddingY={2}>
                <CardList />
              </Box>
            </Group>
          </VStack>
        </HStack>
      </ThemeProvider>
    </MediaQueryProvider>
  );
};
