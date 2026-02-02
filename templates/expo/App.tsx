import { useState, useCallback, memo } from 'react';
import { ScrollView, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import type { ColorScheme } from '@coinbase/cds-common';

import { ThemeProvider } from '@coinbase/cds-mobile/system';
import { defaultTheme } from '@coinbase/cds-mobile/themes/defaultTheme';
import { Box, VStack, HStack, Divider } from '@coinbase/cds-mobile/layout';
import { Button, IconButton } from '@coinbase/cds-mobile/buttons';
import { Text } from '@coinbase/cds-mobile/typography';
import { Icon } from '@coinbase/cds-mobile/icons';
import { Avatar } from '@coinbase/cds-mobile/media';
import { Chip } from '@coinbase/cds-mobile/chips';
import { TextInput } from '@coinbase/cds-mobile/controls';

const assets = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: '$97,234.12',
    change: '+2.34%',
    positive: true,
    imageUrl:
      'https://dynamic-assets.coinbase.com/e785e0181f1a23a30d9476038d9be91e9f6c63959b538eabbc51a1abc8898940383291eede695c3b8dfaa1829a9b57f5a2d0a16b0523580346c6b8fab67af14b/asset_icons/b57ac673f06a4b0338a596817eb0a50ce16e2059f327dc117744449a47915cb2.png',
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    price: '$3,456.78',
    change: '+1.23%',
    positive: true,
    imageUrl:
      'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    price: '$189.45',
    change: '-0.56%',
    positive: false,
    imageUrl:
      'https://dynamic-assets.coinbase.com/2eefc7ffd01a18c14e20580d3fb2aed07eecc4459ea9687e20a4f3cc9b4fb18d5c6a1a57d6a3a9a5a0e80c7b3b8f6e8a8c7b3b8f6e8a8c7b3b8f6e8a8c7b3b8f/asset_icons/sol.png',
  },
  {
    name: 'Cardano',
    symbol: 'ADA',
    price: '$0.89',
    change: '+4.12%',
    positive: true,
    imageUrl:
      'https://dynamic-assets.coinbase.com/da8a6f0923e7252e1e40c0c86e5a4d5c5c2f7b3c1f9c3c5f8e9a7e5b3c2d1e0f/asset_icons/ada.png',
  },
];

const AssetRow = memo(
  ({
    name,
    symbol,
    price,
    change,
    positive,
    imageUrl,
  }: {
    name: string;
    symbol: string;
    price: string;
    change: string;
    positive: boolean;
    imageUrl: string;
  }) => (
    <HStack gap={3} alignItems="center" paddingY={2}>
      <Avatar src={imageUrl} size="m" accessibilityLabel={name} />
      <VStack flex={1}>
        <Text font="body" fontWeight="medium">
          {name}
        </Text>
        <Text font="body" color="fgMuted">
          {symbol}
        </Text>
      </VStack>
      <VStack alignItems="flex-end">
        <Text font="body" fontWeight="medium">
          {price}
        </Text>
        <Text font="body" color={positive ? 'fgPositive' : 'fgNegative'}>
          {change}
        </Text>
      </VStack>
    </HStack>
  ),
);

const App = () => {
  const systemColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(systemColorScheme ?? 'light');
  const [search, setSearch] = useState('');

  const toggleColorScheme = useCallback(() => {
    setColorScheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider theme={defaultTheme} activeColorScheme={colorScheme}>
          <SafeAreaView style={{ flex: 1 }} edges={['top']}>
            <Box flex={1} background="bg">
              <ScrollView>
                <VStack padding={4} gap={4}>
                  {/* Header */}
                  <HStack justifyContent="space-between" alignItems="center">
                    <VStack>
                      <Text font="body" color="fgMuted">
                        Welcome back
                      </Text>
                      <Text font="title2">Your Portfolio</Text>
                    </VStack>
                    <IconButton
                      name={colorScheme === 'light' ? 'moon' : 'sun'}
                      variant="overlay"
                      accessibilityLabel="Toggle color scheme"
                      onPress={toggleColorScheme}
                    />
                  </HStack>

                  {/* Balance Card */}
                  <Box background="bgSecondary" padding={4} borderRadius={300}>
                    <VStack gap={1}>
                      <Text font="body" color="fgMuted">
                        Total Balance
                      </Text>
                      <Text font="display2">$12,345.67</Text>
                      <HStack gap={1} alignItems="center">
                        <Icon name="arrowUp" size="s" color="fgPositive" />
                        <Text font="body" color="fgPositive">
                          +$234.56 (1.94%) today
                        </Text>
                      </HStack>
                    </VStack>
                  </Box>

                  {/* Action Buttons */}
                  <HStack gap={2}>
                    <Button variant="primary" flex={1}>
                      Buy
                    </Button>
                    <Button variant="secondary" flex={1}>
                      Sell
                    </Button>
                    <Button variant="secondary" flex={1}>
                      Send
                    </Button>
                  </HStack>

                  {/* Quick Filters */}
                  <HStack gap={2}>
                    <Chip selected>All</Chip>
                    <Chip>Gainers</Chip>
                    <Chip>Losers</Chip>
                    <Chip>Watchlist</Chip>
                  </HStack>

                  <Divider />

                  {/* Search */}
                  <TextInput
                    accessibilityLabel="Search assets"
                    placeholder="Search assets..."
                    value={search}
                    onChangeText={setSearch}
                    startIcon="search"
                  />

                  {/* Asset List */}
                  <VStack gap={1}>
                    <Text font="label1">Your Assets</Text>
                    {assets
                      .filter(
                        (asset) =>
                          !search ||
                          asset.name.toLowerCase().includes(search.toLowerCase()) ||
                          asset.symbol.toLowerCase().includes(search.toLowerCase()),
                      )
                      .map((asset) => (
                        <AssetRow key={asset.symbol} {...asset} />
                      ))}
                  </VStack>
                </VStack>
              </ScrollView>
            </Box>
          </SafeAreaView>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
