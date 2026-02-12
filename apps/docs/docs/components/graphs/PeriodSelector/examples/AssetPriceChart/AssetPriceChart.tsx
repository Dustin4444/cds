import { memo, useCallback, useMemo, useState } from 'react';
import { sparklineInteractiveData } from '@coinbase/cds-common/internal/visualizations/SparklineInteractiveData';
import { Switch } from '@coinbase/cds-web/controls';
import { useBreakpoints } from '@coinbase/cds-web/hooks/useBreakpoints';
import { HStack } from '@coinbase/cds-web/layout/HStack';
import { VStack } from '@coinbase/cds-web/layout/VStack';
import { RollingNumber } from '@coinbase/cds-web/numbers';
import { Tray } from '@coinbase/cds-web/overlays';
import { SectionHeader } from '@coinbase/cds-web/section-header/SectionHeader';
import { Text } from '@coinbase/cds-web/typography/Text';
import { LineChart, Scrubber } from '@coinbase/cds-web-visualization/chart';

import { PeriodSelectorWrapper } from './PeriodSelectorWrapper';

const tabs = [
  { id: 'hour', label: '1H' },
  { id: 'day', label: '1D' },
  { id: 'week', label: '1W' },
  { id: 'month', label: '1M' },
  { id: 'year', label: '1Y' },
  { id: 'all', label: 'All' },
];

export function AssetPriceChart() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [showYAxis, setShowYAxis] = useState(true);
  const [showXAxis, setShowXAxis] = useState(true);
  const [scrubIndex, setScrubIndex] = useState();
  const breakpoints = useBreakpoints();

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }, []);

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

  const data = useMemo(() => sparklineInteractiveData[activeTab.id], [activeTab.id]);
  const currentPrice = useMemo(
    () => sparklineInteractiveData.hour[sparklineInteractiveData.hour.length - 1].value,
    [],
  );
  const currentTimePrice = useMemo(() => {
    if (scrubIndex !== undefined) {
      return data[scrubIndex].value;
    }
    return currentPrice;
  }, [data, scrubIndex, currentPrice]);

  const formatDate = useCallback((date) => {
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

  const scrubberLabel = useMemo(() => {
    if (scrubIndex === undefined) return;
    return formatDate(data[scrubIndex].date);
  }, [scrubIndex, data, formatDate]);

  const accessibilityLabel = useMemo(() => {
    if (scrubIndex === undefined) return;
    const price = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(data[scrubIndex].value);
    const date = formatDate(data[scrubIndex].date);
    return `Asset price: ${price} USD on ${date}`;
  }, [scrubIndex, data, formatDate]);

  const onClickSettings = useCallback(() => setShowSettings(!showSettings), [showSettings]);

  const seriesData = useMemo(() => [{ id: 'price', data: data.map((d) => d.value) }], [data]);

  const getFormattingConfigForPeriod = useCallback((period) => {
    switch (period) {
      case 'hour':
      case 'day':
        return {
          hour: 'numeric',
          minute: 'numeric',
        };

      case 'week':
      case 'month':
        return {
          month: 'numeric',
          day: 'numeric',
        };

      case 'year':
      case 'all':
        return {
          month: 'numeric',
          year: 'numeric',
        };
    }
  }, []);

  const formatXAxisDate = useCallback(
    (index) => {
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
        padding={0}
        title={<Text font="label1">Asset Price</Text>}
        balance={
          <RollingNumber
            format={{ style: 'currency', currency: 'USD' }}
            font="display3"
            color="fgMuted"
            value={currentTimePrice}
          />
        }
        end={
          isMobile ? undefined : (
            <HStack alignItems="center">
              <PeriodSelectorWrapper
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={tabs}
                onClickSettings={onClickSettings}
              />
            </HStack>
          )
        }
      />
      <LineChart
        enableScrubbing
        height={{ base: 200, tablet: 250, desktop: 300 }}
        onScrubberPositionChange={setScrubIndex}
        series={seriesData}
        yAxis={{
          domainLimit: 'strict',
          showGrid: true,
          tickLabelFormatter: formatYAxisPrice,
          width: breakpoints.isPhone ? 50 : 80,
        }}
        xAxis={{
          tickLabelFormatter: formatXAxisDate,
        }}
        showYAxis={showYAxis}
        showXAxis={showXAxis}
        accessibilityLabel={accessibilityLabel}
      >
        <Scrubber label={scrubberLabel} />
      </LineChart>
      {isMobile && (
        <HStack alignItems="center">
          <PeriodSelectorWrapper
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={tabs}
            onClickSettings={onClickSettings}
          />
        </HStack>
      )}
      {showSettings && (
        <Tray title="Chart Settings" onCloseComplete={() => setShowSettings(false)}>
          {({ handleClose }) => (
            <VStack gap={2} paddingX={3} paddingBottom={3}>
              <HStack justifyContent="space-between" alignItems="center">
                <Text font="label1">Show Y-Axis</Text>
                <Switch checked={showYAxis} onChange={toggleShowYAxis} />
              </HStack>

              <HStack justifyContent="space-between" alignItems="center">
                <Text font="label1">Show X-Axis</Text>
                <Switch checked={showXAxis} onChange={toggleShowXAxis} />
              </HStack>
            </VStack>
          )}
        </Tray>
      )}
    </VStack>
  );
}
