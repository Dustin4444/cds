import React, { useCallback, useMemo, useState } from 'react';
import type { ColorScheme, ThemeVars } from '@coinbase/cds-common/core/theme';

import type { ThemeConfig } from '../../../core/theme';
import { Example, ExampleScreen } from '../../../examples/ExampleScreen';
import { Box } from '../../../layout/Box';
import { HStack } from '../../../layout/HStack';
import { VStack } from '../../../layout/VStack';
import { Pressable } from '../../../system/Pressable';
import { ThemeProvider } from '../../../system/ThemeProvider';
import { defaultTheme } from '../../../themes/defaultTheme';
import { Text } from '../../../typography/Text';
import { HeroSquare as HeroSquareRegular } from '../../HeroSquare';
import { Pictogram as PictogramRegular } from '../../Pictogram';
import { SpotIcon as SpotIconRegular } from '../../SpotIcon';
import { SpotRectangle as SpotRectangleRegular } from '../../SpotRectangle';
import { SpotSquare as SpotSquareRegular } from '../../SpotSquare';
import { HeroSquare } from '../HeroSquare';
import { Pictogram } from '../Pictogram';
import { SpotIcon } from '../SpotIcon';
import { SpotRectangle } from '../SpotRectangle';
import { SpotSquare } from '../SpotSquare';

type IllustrationColorKey = ThemeVars.IllustrationColor;

type IllustrationPalette = { [key in IllustrationColorKey]: string };

const PRESET_THEMES: Record<string, { light: IllustrationPalette; dark: IllustrationPalette }> = {
  default: {
    light: defaultTheme.lightIllustrationColor!,
    dark: defaultTheme.darkIllustrationColor!,
  },
  monochrome: {
    light: {
      primary: 'rgb(30, 30, 30)',
      black: 'rgb(0, 0, 0)',
      white: 'rgb(255, 255, 255)',
      gray: 'rgb(180, 180, 180)',
      gray2: 'rgb(120, 120, 120)',
      gray3: 'rgb(210, 210, 210)',
      positive: 'rgb(80, 80, 80)',
      negative: 'rgb(60, 60, 60)',
      accent1: 'rgb(140, 140, 140)',
      accent2: 'rgb(160, 160, 160)',
      accent3: 'rgb(100, 100, 100)',
      accent4: 'rgb(200, 200, 200)',
      invert: 'rgb(20, 20, 20)',
      invert2: 'rgb(240, 240, 240)',
    },
    dark: {
      primary: 'rgb(220, 220, 220)',
      black: 'rgb(0, 0, 0)',
      white: 'rgb(255, 255, 255)',
      gray: 'rgb(100, 100, 100)',
      gray2: 'rgb(100, 100, 100)',
      gray3: 'rgb(255, 255, 255)',
      positive: 'rgb(180, 180, 180)',
      negative: 'rgb(160, 160, 160)',
      accent1: 'rgb(140, 140, 140)',
      accent2: 'rgb(120, 120, 120)',
      accent3: 'rgb(200, 200, 200)',
      accent4: 'rgb(190, 190, 190)',
      invert: 'rgb(255, 255, 255)',
      invert2: 'rgb(40, 40, 40)',
    },
  },
  warm: {
    light: {
      primary: 'rgb(200, 80, 40)',
      black: 'rgb(50, 20, 10)',
      white: 'rgb(255, 250, 240)',
      gray: 'rgb(210, 190, 170)',
      gray2: 'rgb(80, 50, 30)',
      gray3: 'rgb(230, 210, 190)',
      positive: 'rgb(100, 160, 60)',
      negative: 'rgb(200, 50, 50)',
      accent1: 'rgb(240, 180, 40)',
      accent2: 'rgb(220, 120, 60)',
      accent3: 'rgb(180, 100, 40)',
      accent4: 'rgb(240, 150, 80)',
      invert: 'rgb(40, 20, 10)',
      invert2: 'rgb(255, 245, 235)',
    },
    dark: {
      primary: 'rgb(240, 120, 70)',
      black: 'rgb(30, 15, 5)',
      white: 'rgb(255, 250, 240)',
      gray: 'rgb(120, 90, 70)',
      gray2: 'rgb(120, 90, 70)',
      gray3: 'rgb(255, 250, 240)',
      positive: 'rgb(140, 200, 100)',
      negative: 'rgb(240, 90, 80)',
      accent1: 'rgb(230, 190, 80)',
      accent2: 'rgb(240, 150, 90)',
      accent3: 'rgb(210, 130, 60)',
      accent4: 'rgb(250, 180, 110)',
      invert: 'rgb(255, 250, 240)',
      invert2: 'rgb(50, 25, 10)',
    },
  },
};

const COLOR_SCHEMES: ColorScheme[] = ['light', 'dark'];

const PresetButton = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <Pressable onPress={onPress}>
    <Box
      background={active ? 'bgPrimary' : 'bgSecondary'}
      borderRadius={200}
      paddingX={1.5}
      paddingY={0.5}
    >
      <Text color={active ? 'fgInverse' : 'fg'} font="label1">
        {label}
      </Text>
    </Box>
  </Pressable>
);

const ColorSwatch = ({ color, label }: { color: string; label: string }) => (
  <HStack alignItems="center" gap={0.5}>
    <Box borderRadius={1000} style={{ width: 12, height: 12, backgroundColor: color }} />
    <Text font="legal">{label}</Text>
  </HStack>
);

const ThemeableIllustrationsStory = () => {
  const [activePreset, setActivePreset] = useState('default');

  const themeConfig = useMemo((): ThemeConfig => {
    const preset = PRESET_THEMES[activePreset];
    return {
      ...defaultTheme,
      lightIllustrationColor: preset.light,
      darkIllustrationColor: preset.dark,
    };
  }, [activePreset]);

  const handlePresetPress = useCallback((key: string) => {
    setActivePreset(key);
  }, []);

  return (
    <ExampleScreen>
      <Example title="Theme Preset">
        <HStack flexWrap="wrap" gap={1}>
          {Object.keys(PRESET_THEMES).map((key) => (
            <PresetButton
              key={key}
              active={activePreset === key}
              label={key}
              onPress={() => handlePresetPress(key)}
            />
          ))}
        </HStack>
      </Example>

      <Example title="Active Palette">
        <HStack flexWrap="wrap" gap={1}>
          {Object.entries(PRESET_THEMES[activePreset].light).map(([key, value]) => (
            <ColorSwatch key={key} color={value} label={key} />
          ))}
        </HStack>
      </Example>

      <Example title="HeroSquare">
        <VStack gap={1}>
          <Text font="label1">Themed</Text>
          <HStack gap={0}>
            {COLOR_SCHEMES.map((scheme) => (
              <ThemeProvider key={scheme} activeColorScheme={scheme} theme={themeConfig}>
                <VStack background="bg" gap={0.5} padding={1}>
                  <Text font="caption">{scheme}</Text>
                  <HStack gap={0.5}>
                    <HeroSquare name="errorRefreshWeb" scaleMultiplier={0.3} />
                    <HeroSquare name="defiHow" scaleMultiplier={0.3} />
                    <HeroSquare name="coinbaseOneZeroPortal" scaleMultiplier={0.3} />
                  </HStack>
                </VStack>
              </ThemeProvider>
            ))}
          </HStack>
          <Text font="label1">Regular</Text>
          <HStack gap={0}>
            {COLOR_SCHEMES.map((scheme) => (
              <ThemeProvider key={scheme} activeColorScheme={scheme} theme={defaultTheme}>
                <VStack background="bg" gap={0.5} padding={1}>
                  <Text font="caption">{scheme}</Text>
                  <HStack gap={0.5}>
                    <HeroSquareRegular name="errorRefreshWeb" scaleMultiplier={0.3} />
                    <HeroSquareRegular name="defiHow" scaleMultiplier={0.3} />
                    <HeroSquareRegular name="coinbaseOneZeroPortal" scaleMultiplier={0.3} />
                  </HStack>
                </VStack>
              </ThemeProvider>
            ))}
          </HStack>
        </VStack>
      </Example>

      <Example title="SpotSquare">
        <VStack gap={1}>
          <Text font="label1">Themed</Text>
          <HStack gap={0}>
            {COLOR_SCHEMES.map((scheme) => (
              <ThemeProvider key={scheme} activeColorScheme={scheme} theme={themeConfig}>
                <VStack background="bg" gap={0.5} padding={1}>
                  <Text font="caption">{scheme}</Text>
                  <HStack gap={0.5}>
                    <SpotSquare name="encryptedEverything" />
                    <SpotSquare name="mining" />
                    <SpotSquare name="holdCrypto" />
                  </HStack>
                </VStack>
              </ThemeProvider>
            ))}
          </HStack>
          <Text font="label1">Regular</Text>
          <HStack gap={0}>
            {COLOR_SCHEMES.map((scheme) => (
              <ThemeProvider key={scheme} activeColorScheme={scheme} theme={defaultTheme}>
                <VStack background="bg" gap={0.5} padding={1}>
                  <Text font="caption">{scheme}</Text>
                  <HStack gap={0.5}>
                    <SpotSquareRegular name="encryptedEverything" />
                    <SpotSquareRegular name="mining" />
                    <SpotSquareRegular name="holdCrypto" />
                  </HStack>
                </VStack>
              </ThemeProvider>
            ))}
          </HStack>
        </VStack>
      </Example>

      <Example title="Pictogram">
        <VStack gap={1}>
          <Text font="label1">Themed</Text>
          <HStack gap={0}>
            {COLOR_SCHEMES.map((scheme) => (
              <ThemeProvider key={scheme} activeColorScheme={scheme} theme={themeConfig}>
                <VStack background="bg" gap={0.5} padding={1}>
                  <Text font="caption">{scheme}</Text>
                  <HStack gap={0.5}>
                    <Pictogram name="avatarHg" />
                    <Pictogram name="authenticator" />
                    <Pictogram name="exchangeNavigation" />
                  </HStack>
                </VStack>
              </ThemeProvider>
            ))}
          </HStack>
          <Text font="label1">Regular</Text>
          <HStack gap={0}>
            {COLOR_SCHEMES.map((scheme) => (
              <ThemeProvider key={scheme} activeColorScheme={scheme} theme={defaultTheme}>
                <VStack background="bg" gap={0.5} padding={1}>
                  <Text font="caption">{scheme}</Text>
                  <HStack gap={0.5}>
                    <PictogramRegular name="avatarHg" />
                    <PictogramRegular name="authenticator" />
                    <PictogramRegular name="exchangeNavigation" />
                  </HStack>
                </VStack>
              </ThemeProvider>
            ))}
          </HStack>
        </VStack>
      </Example>

      <Example title="SpotRectangle">
        <VStack gap={1}>
          <Text font="label1">Themed</Text>
          <HStack gap={0}>
            {COLOR_SCHEMES.map((scheme) => (
              <ThemeProvider key={scheme} activeColorScheme={scheme} theme={themeConfig}>
                <VStack background="bg" gap={0.5} padding={1}>
                  <Text font="caption">{scheme}</Text>
                  <HStack gap={0.5}>
                    <SpotRectangle name="appUpdate" />
                    <SpotRectangle name="faceId" />
                  </HStack>
                </VStack>
              </ThemeProvider>
            ))}
          </HStack>
          <Text font="label1">Regular</Text>
          <HStack gap={0}>
            {COLOR_SCHEMES.map((scheme) => (
              <ThemeProvider key={scheme} activeColorScheme={scheme} theme={defaultTheme}>
                <VStack background="bg" gap={0.5} padding={1}>
                  <Text font="caption">{scheme}</Text>
                  <HStack gap={0.5}>
                    <SpotRectangleRegular name="appUpdate" />
                    <SpotRectangleRegular name="faceId" />
                  </HStack>
                </VStack>
              </ThemeProvider>
            ))}
          </HStack>
        </VStack>
      </Example>

      <Example title="SpotIcon">
        <VStack gap={1}>
          <Text font="label1">Themed</Text>
          <HStack gap={0}>
            {COLOR_SCHEMES.map((scheme) => (
              <ThemeProvider key={scheme} activeColorScheme={scheme} theme={themeConfig}>
                <VStack background="bg" gap={0.5} padding={1}>
                  <Text font="caption">{scheme}</Text>
                  <HStack gap={0.5}>
                    <SpotIcon name="2fa" />
                    <SpotIcon name="fast" />
                    <SpotIcon name="warning" />
                    <SpotIcon name="coinbaseOneEarn" />
                  </HStack>
                </VStack>
              </ThemeProvider>
            ))}
          </HStack>
          <Text font="label1">Regular</Text>
          <HStack gap={0}>
            {COLOR_SCHEMES.map((scheme) => (
              <ThemeProvider key={scheme} activeColorScheme={scheme} theme={defaultTheme}>
                <VStack background="bg" gap={0.5} padding={1}>
                  <Text font="caption">{scheme}</Text>
                  <HStack gap={0.5}>
                    <SpotIconRegular name="2fa" />
                    <SpotIconRegular name="fast" />
                    <SpotIconRegular name="warning" />
                    <SpotIconRegular name="coinbaseOneEarn" />
                  </HStack>
                </VStack>
              </ThemeProvider>
            ))}
          </HStack>
        </VStack>
      </Example>
    </ExampleScreen>
  );
};

export default ThemeableIllustrationsStory;
