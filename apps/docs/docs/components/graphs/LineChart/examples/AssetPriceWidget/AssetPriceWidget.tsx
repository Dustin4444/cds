import { memo, useCallback } from 'react';
import { candles as btcCandles } from '@coinbase/cds-common/internal/data/candles';
import { assets } from '@coinbase/cds-common/internal/data/assets';
import { useBreakpoints } from '@coinbase/cds-web/hooks/useBreakpoints';
import { Box } from '@coinbase/cds-web/layout/Box';
import { HStack } from '@coinbase/cds-web/layout/HStack';
import { VStack } from '@coinbase/cds-web/layout/VStack';
import { RemoteImage } from '@coinbase/cds-web/media/RemoteImage';
import { Text } from '@coinbase/cds-web/typography/Text';
import { LineChart, Scrubber } from '@coinbase/cds-web-visualization/chart';

export const AssetPriceWidget = memo(function AssetPriceWidget() {
  const { isPhone } = useBreakpoints();
  const prices = [...btcCandles].reverse().map((candle) => parseFloat(candle.close));
  const latestPrice = prices[prices.length - 1];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatPercentChange = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const percentChange = (latestPrice - prices[0]) / prices[0];

  const chartAccessibilityLabel = `Bitcoin price chart. Current price: ${formatPrice(latestPrice)}. Change: ${formatPercentChange(percentChange)}`;

  const scrubberAccessibilityLabel = useCallback(
    (index: number) => {
      return `Bitcoin price at position ${index + 1}: ${formatPrice(prices[index])}`;
    },
    [prices],
  );

  return (
    <VStack
      borderRadius={300}
      gap={2}
      overflow="hidden"
      padding={2}
      paddingBottom={0}
      style={{
        background:
          'linear-gradient(0deg, rgba(0, 0, 0, 0.80) 0%, rgba(0, 0, 0, 0.80) 100%), #ED702F',
      }}
    >
      <HStack alignItems="center" gap={2}>
        <RemoteImage aria-hidden shape="circle" size="xxl" source={assets.btc.imageUrl} />
        {!isPhone && (
          <VStack flexGrow={1} gap={0.25}>
            <Text aria-hidden font="title1" style={{ color: 'white' }}>
              BTC
            </Text>
            <Text color="fgMuted" font="label1">
              Bitcoin
            </Text>
          </VStack>
        )}
        <VStack alignItems="flex-end" flexGrow={isPhone ? 1 : undefined} gap={0.25}>
          <Text font="title1" style={{ color: 'white' }}>
            {formatPrice(latestPrice)}
          </Text>
          <Text
            accessibilityLabel={`Up ${formatPercentChange(percentChange)}`}
            color="fgPositive"
            font="label1"
          >
            +{formatPercentChange(percentChange)}
          </Text>
        </VStack>
      </HStack>
      <Box marginX={-2}>
        <LineChart
          showArea
          accessibilityLabel={chartAccessibilityLabel}
          height={92}
          inset={{ left: 0, right: 18, bottom: 0, top: 0 }}
          series={[
            {
              id: 'btcPrice',
              data: prices,
              color: assets.btc.color,
            },
          ]}
          width="100%"
        >
          <Scrubber
            idlePulse
            accessibilityLabel={scrubberAccessibilityLabel}
            styles={{ beacon: { stroke: 'white' } }}
          />
        </LineChart>
      </Box>
    </VStack>
  );
});
