import React, { forwardRef, memo, useCallback,useMemo, useState } from 'react';
import { assets } from '@coinbase/cds-common/internal/data/assets';
import { sparklineInteractiveData } from '@coinbase/cds-common/internal/visualizations/SparklineInteractiveData';
import { useTabsContext } from '@coinbase/cds-common/tabs/TabsContext';
import type { TabValue } from '@coinbase/cds-common/tabs/useTabs';
import { VStack } from '@coinbase/cds-web/layout/VStack';
import { RemoteImage } from '@coinbase/cds-web/media/RemoteImage';
import { SectionHeader } from '@coinbase/cds-web/section-header/SectionHeader';
import type { SegmentedTabProps, TabComponent,TabsActiveIndicatorProps  } from '@coinbase/cds-web/tabs';
import { SegmentedTab } from '@coinbase/cds-web/tabs';
import { Text } from '@coinbase/cds-web/typography/Text';
import { LineChart ,   PeriodSelector,
  PeriodSelectorActiveIndicator,
Scrubber ,
} from '@coinbase/cds-web-visualization/chart';

const BTCTab: TabComponent = memo(
  forwardRef(
    ({ label, ...props }: SegmentedTabProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
      const { activeTab } = useTabsContext();
      const isActive = activeTab?.id === props.id;

      return (
        <SegmentedTab
          ref={ref}
          label={
            <Text
              font="label1"
              style={{
                transition: 'color 0.2s ease',
                color: isActive ? assets.btc.color : undefined,
              }}
            >
              {label}
            </Text>
          }
          {...props}
        />
      );
    },
  ),
);

const BTCActiveIndicator = memo(({ style, ...props }: TabsActiveIndicatorProps) => (
  <PeriodSelectorActiveIndicator
    {...props}
    style={{ ...style, backgroundColor: `${assets.btc.color}1A` }}
  />
));

export function AssetPriceDottedArea() {
  const currentPrice =
    sparklineInteractiveData.hour[sparklineInteractiveData.hour.length - 1].value;
  const tabs = useMemo(
    () => [
      { id: 'hour', label: '1H' },
      { id: 'day', label: '1D' },
      { id: 'week', label: '1W' },
      { id: 'month', label: '1M' },
      { id: 'year', label: '1Y' },
      { id: 'all', label: 'All' },
    ],
    [],
  );
  const [timePeriod, setTimePeriod] = useState<TabValue>(tabs[0]);

  const sparklineTimePeriodData = useMemo(() => {
    return sparklineInteractiveData[timePeriod.id as keyof typeof sparklineInteractiveData];
  }, [timePeriod]);

  const sparklineTimePeriodDataValues = useMemo(() => {
    return sparklineTimePeriodData.map((d) => d.value);
  }, [sparklineTimePeriodData]);

  const sparklineTimePeriodDataTimestamps = useMemo(() => {
    return sparklineTimePeriodData.map((d) => d.date);
  }, [sparklineTimePeriodData]);

  const onPeriodChange = useCallback(
    (period: TabValue | null) => {
      setTimePeriod(period || tabs[0]);
    },
    [tabs, setTimePeriod],
  );

  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }),
    [],
  );

  const scrubberPriceFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [],
  );

  const formatPrice = useCallback(
    (price: number) => {
      return priceFormatter.format(price);
    },
    [priceFormatter],
  );

  const formatDate = useCallback((date: Date) => {
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });

    const monthDay = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return `${dayOfWeek}, ${monthDay}, ${time}`;
  }, []);

  const scrubberLabel = useCallback(
    (index: number) => {
      const price = scrubberPriceFormatter.format(sparklineTimePeriodDataValues[index]);
      const date = formatDate(sparklineTimePeriodDataTimestamps[index]);
      return (
        <>
          <tspan style={{ fontWeight: 'bold' }}>{price} USD</tspan> {date}
        </>
      );
    },
    [
      scrubberPriceFormatter,
      sparklineTimePeriodDataValues,
      sparklineTimePeriodDataTimestamps,
      formatDate,
    ],
  );

  const chartAccessibilityLabel = `Bitcoin price chart for ${timePeriod.label} period. Current price: ${formatPrice(currentPrice)}`;

  const scrubberAccessibilityLabel = useCallback(
    (index: number) => {
      const price = scrubberPriceFormatter.format(sparklineTimePeriodDataValues[index]);
      const date = formatDate(sparklineTimePeriodDataTimestamps[index]);
      return `${price} USD ${date}`;
    },
    [
      scrubberPriceFormatter,
      sparklineTimePeriodDataValues,
      sparklineTimePeriodDataTimestamps,
      formatDate,
    ],
  );

  return (
    <VStack gap={2}>
      <SectionHeader
        balance={<Text font="title2">{formatPrice(currentPrice)}</Text>}
        end={
          <VStack justifyContent="center">
            <RemoteImage shape="circle" size="xl" source={assets.btc.imageUrl} />
          </VStack>
        }
        style={{ padding: 0 }}
        title={<Text font="title1">Bitcoin</Text>}
      />
      <LineChart
        enableScrubbing
        showArea
        accessibilityLabel={chartAccessibilityLabel}
        areaType="dotted"
        height={{ base: 200, tablet: 225, desktop: 250 }}
        inset={{ top: 60 }}
        series={[
          {
            id: 'btc',
            data: sparklineTimePeriodDataValues,
            color: assets.btc.color,
          },
        ]}
        style={{ outlineColor: assets.btc.color }}
      >
        <Scrubber
          idlePulse
          labelElevated
          accessibilityLabel={scrubberAccessibilityLabel}
          label={scrubberLabel}
        />
      </LineChart>
      <PeriodSelector
        TabComponent={BTCTab}
        TabsActiveIndicatorComponent={BTCActiveIndicator}
        activeTab={timePeriod}
        onChange={onPeriodChange}
        tabs={tabs}
      />
    </VStack>
  );
}
