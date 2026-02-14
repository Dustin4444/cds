import { memo, useCallback, useMemo, useState } from 'react';
import { Switch } from '@coinbase/cds-web/controls';
import { useBreakpoints } from '@coinbase/cds-web/hooks/useBreakpoints';
import { Box } from '@coinbase/cds-web/layout';
import { HStack } from '@coinbase/cds-web/layout/HStack';
import { VStack } from '@coinbase/cds-web/layout/VStack';
import { RollingNumber } from '@coinbase/cds-web/numbers';
import { Tray } from '@coinbase/cds-web/overlays';
import { SectionHeader } from '@coinbase/cds-web/section-header/SectionHeader';
import { Text } from '@coinbase/cds-web/typography/Text';
import { LineChart, Scrubber } from '@coinbase/cds-web-visualization/chart';

import type { DataPoint, PeriodId, TabItem } from './data';
import { PeriodSelectorWrapper } from './PeriodSelectorWrapper';

type AssetPriceChartProps = {
  activeTab: TabItem;
  currentPrice: number;
  data: DataPoint[];
  formatTimestamp: (date: Date) => string;
  isLoading?: boolean;
  onTimeChange?: (date: Date | undefined, price: number | undefined) => void;
  setActiveTab: (tab: TabItem) => void;
  tabs: TabItem[];
};

export const AssetPriceChart = memo(function AssetPriceChart({
  activeTab,
  currentPrice,
  data,
  formatTimestamp,
  isLoading,
  onTimeChange,
  setActiveTab,
  tabs,
}: AssetPriceChartProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showYAxis, setShowYAxis] = useState(true);
  const [showXAxis, setShowXAxis] = useState(true);
  const [scrubIndex, setScrubIndex] = useState<number | undefined>();
  const breakpoints = useBreakpoints();

  const formatYAxisPrice = useCallback(
    (price: number) => {
      if (breakpoints.isPhone) {
        if (price >= 1000000) {
          return `$${(price / 1000000).toFixed(1)}M`;
        } else if (price >= 1000) {
          return `$${(price / 1000).toFixed(0)}k`;
        }
        return `$${price.toFixed(0)}`;
      }
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    },
    [breakpoints.isPhone],
  );

  const toggleShowYAxis = useCallback(() => setShowYAxis((show) => !show), []);
  const toggleShowXAxis = useCallback(() => setShowXAxis((show) => !show), []);

  const handleSetActiveTab = useCallback(
    (tab: { id: string; label: string }) => {
      setActiveTab(tab as TabItem);
    },
    [setActiveTab],
  );

  const currentTimePrice = useMemo(() => {
    if (scrubIndex !== undefined && data[scrubIndex]) {
      return data[scrubIndex].value;
    }
    return currentPrice;
  }, [data, scrubIndex, currentPrice]);

  const handleScrubberPositionChange = useCallback(
    (index: number | undefined) => {
      setScrubIndex(index);
      if (onTimeChange) {
        if (index !== undefined && data[index]) {
          onTimeChange(data[index].date, data[index].value);
        } else {
          onTimeChange(undefined, undefined);
        }
      }
    },
    [data, onTimeChange],
  );

  const scrubberLabel = useMemo(() => {
    if (scrubIndex === undefined || !data[scrubIndex]) return;
    return formatTimestamp(data[scrubIndex].date);
  }, [scrubIndex, data, formatTimestamp]);

  const accessibilityLabel = useMemo(() => {
    if (scrubIndex === undefined || !data[scrubIndex]) return;
    const price = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(data[scrubIndex].value);
    const date = formatTimestamp(data[scrubIndex].date);
    return `Asset price: ${price} USD on ${date}`;
  }, [scrubIndex, data, formatTimestamp]);

  const onClickSettings = useCallback(() => setShowSettings(!showSettings), [showSettings]);

  const seriesData = useMemo(() => [{ id: 'price', data: data.map((d) => d.value) }], [data]);

  const getFormattingConfigForPeriod = useCallback((period: PeriodId) => {
    switch (period) {
      case 'hour':
      case 'day':
        return {
          hour: 'numeric' as const,
          minute: 'numeric' as const,
        };

      case 'week':
      case 'month':
        return {
          month: 'numeric' as const,
          day: 'numeric' as const,
        };

      case 'year':
      case 'all':
        return {
          month: 'numeric' as const,
          year: 'numeric' as const,
        };
    }
  }, []);

  const formatXAxisDate = useCallback(
    (index: number) => {
      if (!data[index]) return '';
      const date = data[index].date;
      const formatConfig = getFormattingConfigForPeriod(activeTab.id);

      if (activeTab.id === 'hour' || activeTab.id === 'day') {
        return date.toLocaleTimeString('en-US', formatConfig);
      } else {
        return date.toLocaleDateString('en-US', formatConfig);
      }
    },
    [data, activeTab.id, getFormattingConfigForPeriod],
  );

  const isMobile = breakpoints.isPhone || breakpoints.isTabletPortrait;

  return (
    <VStack gap={2}>
      <SectionHeader
        balance={
          <RollingNumber
            color="fgMuted"
            font="display3"
            format={{ style: 'currency', currency: 'USD' }}
            value={currentTimePrice}
          />
        }
        end={
          isMobile ? undefined : (
            <HStack alignItems="center">
              <PeriodSelectorWrapper
                activeTab={activeTab}
                onClickSettings={onClickSettings}
                setActiveTab={handleSetActiveTab}
                tabs={tabs}
              />
            </HStack>
          )
        }
        padding={0}
        title={<Text font="label1">Asset Price</Text>}
      />
      <Box style={{ opacity: isLoading ? 0.4 : 1, transition: 'opacity 0.2s ease' }}>
        <LineChart
          accessibilityLabel={accessibilityLabel}
          enableScrubbing={!isLoading}
          height={{ base: 200, tablet: 250, desktop: 300 }}
          onScrubberPositionChange={handleScrubberPositionChange}
          series={seriesData}
          showXAxis={showXAxis}
          showYAxis={showYAxis}
          xAxis={{
            tickLabelFormatter: formatXAxisDate,
          }}
          yAxis={{
            domainLimit: 'strict',
            showGrid: true,
            tickLabelFormatter: formatYAxisPrice,
            width: breakpoints.isPhone ? 50 : 80,
          }}
        >
          <Scrubber label={scrubberLabel} />
        </LineChart>
      </Box>
      {isMobile && (
        <HStack alignItems="center">
          <PeriodSelectorWrapper
            activeTab={activeTab}
            onClickSettings={onClickSettings}
            setActiveTab={handleSetActiveTab}
            tabs={tabs}
          />
        </HStack>
      )}
      {showSettings && (
        <Tray onCloseComplete={() => setShowSettings(false)} title="Chart Settings">
          {({ handleClose }) => (
            <VStack gap={2} paddingBottom={3} paddingX={3}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text font="label1">Show Y-Axis</Text>
                <Switch checked={showYAxis} onChange={toggleShowYAxis} />
              </HStack>

              <HStack alignItems="center" justifyContent="space-between">
                <Text font="label1">Show X-Axis</Text>
                <Switch checked={showXAxis} onChange={toggleShowXAxis} />
              </HStack>
            </VStack>
          )}
        </Tray>
      )}
    </VStack>
  );
});
