import { useState } from 'react';
import type { ColorScheme } from '@coinbase/cds-common';
import type { ThemeConfig } from '@coinbase/cds-web';
import { ThemeProvider } from '@coinbase/cds-web';
import { Chip } from '@coinbase/cds-web/chips';
import { SearchInput } from '@coinbase/cds-web/controls';
import {
  HeroSquare,
  Pictogram,
  SpotIcon,
  SpotRectangle,
  SpotSquare,
} from '@coinbase/cds-web/illustrations';
import {
  HeroSquare as HeroSquareThemeable,
  Pictogram as PictogramThemeable,
  SpotIcon as SpotIconThemeable,
  SpotRectangle as SpotRectangleThemeable,
  SpotSquare as SpotSquareThemeable,
} from '@coinbase/cds-web/illustrations/themeable';
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
    lightIllustrationColor: {
      primary: `rgb(${defaultTheme.lightSpectrum.blue20})`,
      black: `rgb(${defaultTheme.lightSpectrum.blue100})`,
      white: `rgb(${defaultTheme.lightSpectrum.blue0})`,
      gray: `rgb(${defaultTheme.lightSpectrum.blue5})`,
      gray2: `rgb(${defaultTheme.lightSpectrum.blue10})`,
      gray3: `rgb(${defaultTheme.lightSpectrum.blue15})`,
      positive: `rgb(${defaultTheme.lightSpectrum.blue20})`,
      negative: `rgb(${defaultTheme.lightSpectrum.blue30})`,
      accent1: `rgb(${defaultTheme.lightSpectrum.blue40})`,
      accent2: `rgb(${defaultTheme.lightSpectrum.blue50})`,
      accent3: `rgb(${defaultTheme.lightSpectrum.blue60})`,
      accent4: `rgb(${defaultTheme.lightSpectrum.blue70})`,
      invert: `rgb(${defaultTheme.lightSpectrum.blue80})`,
      invert2: `rgb(${defaultTheme.lightSpectrum.blue90})`,
    },
    darkIllustrationColor: {
      primary: `rgb(${defaultTheme.darkSpectrum.blue20})`,
      black: `rgb(${defaultTheme.darkSpectrum.blue100})`,
      white: `rgb(${defaultTheme.darkSpectrum.blue0})`,
      gray: `rgb(${defaultTheme.darkSpectrum.blue5})`,
      gray2: `rgb(${defaultTheme.darkSpectrum.blue10})`,
      gray3: `rgb(${defaultTheme.darkSpectrum.blue15})`,
      positive: `rgb(${defaultTheme.darkSpectrum.blue20})`,
      negative: `rgb(${defaultTheme.darkSpectrum.blue30})`,
      accent1: `rgb(${defaultTheme.darkSpectrum.blue40})`,
      accent2: `rgb(${defaultTheme.darkSpectrum.blue50})`,
      accent3: `rgb(${defaultTheme.darkSpectrum.blue60})`,
      accent4: `rgb(${defaultTheme.darkSpectrum.blue70})`,
      invert: `rgb(${defaultTheme.darkSpectrum.blue80})`,
      invert2: `rgb(${defaultTheme.darkSpectrum.blue90})`,
    },
  },
  random: {
    lightIllustrationColor: Object.fromEntries(
      Object.entries(defaultTheme.lightIllustrationColor!).map(([key]) => [
        key,
        `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`,
      ]),
    ) as NonNullable<ThemeConfig['lightIllustrationColor']>,
    darkIllustrationColor: Object.fromEntries(
      Object.entries(defaultTheme.darkIllustrationColor!).map(([key]) => [
        key,
        `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`,
      ]),
    ) as NonNullable<ThemeConfig['darkIllustrationColor']>,
  },
  pink: {
    lightIllustrationColor: {
      primary: `rgb(${defaultTheme.lightSpectrum.pink60})`,
      black: `rgb(${defaultTheme.lightSpectrum.pink60})`,
      white: `rgb(${defaultTheme.lightSpectrum.pink60})`,
      gray: `rgb(${defaultTheme.lightSpectrum.pink60})`,
      gray2: `rgb(${defaultTheme.lightSpectrum.pink60})`,
      gray3: `rgb(${defaultTheme.lightSpectrum.pink60})`,
      positive: `rgb(${defaultTheme.lightSpectrum.pink60})`,
      negative: `rgb(${defaultTheme.lightSpectrum.pink60})`,
      accent1: `rgb(${defaultTheme.lightSpectrum.pink60})`,
      accent2: `rgb(${defaultTheme.lightSpectrum.pink60})`,
      accent3: `rgb(${defaultTheme.lightSpectrum.pink60})`,
      accent4: `rgb(${defaultTheme.lightSpectrum.pink60})`,
      invert: `rgb(${defaultTheme.lightSpectrum.pink60})`,
      invert2: `rgb(${defaultTheme.lightSpectrum.pink60})`,
    },
    darkIllustrationColor: {
      primary: `rgb(${defaultTheme.lightSpectrum.pink60})`,
      black: `rgb(${defaultTheme.lightSpectrum.pink60})`,
      white: `rgb(${defaultTheme.lightSpectrum.pink60})`,
      gray: `rgb(${defaultTheme.lightSpectrum.pink60})`,
      gray2: `rgb(${defaultTheme.lightSpectrum.pink60})`,
      gray3: `rgb(${defaultTheme.lightSpectrum.pink60})`,
      positive: `rgb(${defaultTheme.lightSpectrum.pink60})`,
      negative: `rgb(${defaultTheme.lightSpectrum.pink60})`,
      accent1: `rgb(${defaultTheme.lightSpectrum.pink60})`,
      accent2: `rgb(${defaultTheme.lightSpectrum.pink60})`,
      accent3: `rgb(${defaultTheme.lightSpectrum.pink60})`,
      accent4: `rgb(${defaultTheme.lightSpectrum.pink60})`,
      invert: `rgb(${defaultTheme.lightSpectrum.pink60})`,
      invert2: `rgb(${defaultTheme.lightSpectrum.pink60})`,
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
            <ThemeProvider
              activeColorScheme={activeColorScheme}
              theme={{
                ...defaultTheme,
                ...illustrationThemes[illustrationThemeKey as keyof typeof illustrationThemes],
              }}
            >
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
                <HStack flexWrap="wrap" gap={1} maxWidth={400}>
                  {Object.entries(
                    illustrationThemes[illustrationThemeKey as keyof typeof illustrationThemes][
                      activeColorScheme === 'light'
                        ? 'lightIllustrationColor'
                        : 'darkIllustrationColor'
                    ],
                  ).map(([name, value]) => (
                    <HStack key={name} alignItems="center" gap={0.5}>
                      <Box
                        borderRadius={1000}
                        style={{
                          width: 12,
                          height: 12,
                          backgroundColor: value as string,
                          border: '1px solid rgba(0,0,0,0.1)',
                        }}
                      />
                      <Text font="label2">{name}</Text>
                    </HStack>
                  ))}
                </HStack>
                <Text font="title2">HeroSquare</Text>
                <Text font="headline">Themed</Text>
                <HStack gap={1}>
                  <HeroSquareThemeable name="errorRefreshWeb" scaleMultiplier={0.75} />
                  <HeroSquareThemeable name="defiHow" scaleMultiplier={0.75} />
                  <HeroSquareThemeable name="coinbaseOneZeroPortal" scaleMultiplier={0.75} />
                  <HeroSquareThemeable name="accessToAdvancedCharts" scaleMultiplier={0.75} />
                  <HeroSquareThemeable name="advancedTrading" scaleMultiplier={0.75} />
                  <HeroSquareThemeable name="airdrop" scaleMultiplier={0.75} />
                </HStack>
                <Text font="headline">Regular</Text>
                <HStack gap={1}>
                  <HeroSquare name="errorRefreshWeb" scaleMultiplier={0.75} />
                  <HeroSquare name="defiHow" scaleMultiplier={0.75} />
                  <HeroSquare name="coinbaseOneZeroPortal" scaleMultiplier={0.75} />
                  <HeroSquare name="accessToAdvancedCharts" scaleMultiplier={0.75} />
                  <HeroSquare name="advancedTrading" scaleMultiplier={0.75} />
                  <HeroSquare name="airdrop" scaleMultiplier={0.75} />
                </HStack>

                <Text font="title2">SpotSquare</Text>
                <Text font="headline">Themed</Text>
                <HStack gap={1}>
                  <SpotSquareThemeable name="encryptedEverything" />
                  <SpotSquareThemeable name="mining" />
                  <SpotSquareThemeable name="holdCrypto" />
                  <SpotSquareThemeable name="holdingCrypto" />
                  <SpotSquareThemeable name="tradeImmediately" />
                  <SpotSquareThemeable name="earnInterest" />
                </HStack>
                <Text font="headline">Regular</Text>
                <HStack gap={1}>
                  <SpotSquare name="encryptedEverything" />
                  <SpotSquare name="mining" />
                  <SpotSquare name="holdCrypto" />
                  <SpotSquare name="holdingCrypto" />
                  <SpotSquare name="tradeImmediately" />
                  <SpotSquare name="earnInterest" />
                </HStack>

                <Text font="title2">Pictogram</Text>
                <Text font="headline">Themed</Text>
                <HStack gap={1}>
                  <PictogramThemeable name="avatarHg" />
                  <PictogramThemeable name="authenticator" />
                  <PictogramThemeable name="exchangeNavigation" />
                  <PictogramThemeable name="baseComet" />
                  <PictogramThemeable name="genericCountryIDCard" />
                  <PictogramThemeable name="advancedTradingRebates" />
                </HStack>
                <Text font="headline">Regular</Text>
                <HStack gap={1}>
                  <Pictogram name="avatarHg" />
                  <Pictogram name="authenticator" />
                  <Pictogram name="exchangeNavigation" />
                  <Pictogram name="baseComet" />
                  <Pictogram name="genericCountryIDCard" />
                  <Pictogram name="advancedTradingRebates" />
                </HStack>

                <Text font="title2">SpotRectangle</Text>
                <Text font="headline">Themed</Text>
                <HStack gap={1}>
                  <SpotRectangleThemeable name="appUpdate" />
                  <SpotRectangleThemeable name="scanCode" />
                  <SpotRectangleThemeable name="faceId" />
                </HStack>
                <Text font="headline">Regular</Text>
                <HStack gap={1}>
                  <SpotRectangle name="appUpdate" />
                  <SpotRectangle name="scanCode" />
                  <SpotRectangle name="faceId" />
                </HStack>

                <Text font="title2">SpotIcon</Text>
                <Text font="headline">Themed</Text>
                <HStack gap={1}>
                  <SpotIconThemeable name="2fa" />
                  <SpotIconThemeable name="fast" />
                  <SpotIconThemeable name="warning" />
                  <SpotIconThemeable name="outage" />
                  <SpotIconThemeable name="idVerification" />
                  <SpotIconThemeable name="coinbaseOneEarn" />
                </HStack>
                <Text font="headline">Regular</Text>
                <HStack gap={1}>
                  <SpotIcon name="2fa" />
                  <SpotIcon name="fast" />
                  <SpotIcon name="warning" />
                  <SpotIcon name="outage" />
                  <SpotIcon name="idVerification" />
                  <SpotIcon name="coinbaseOneEarn" />
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
