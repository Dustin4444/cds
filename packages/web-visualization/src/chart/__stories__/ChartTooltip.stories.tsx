import { memo } from 'react';
import { VStack } from '@coinbase/cds-web/layout';
import { Text } from '@coinbase/cds-web/typography';

import { LineChart } from '../line/LineChart';
import { Scrubber } from '../scrubber/Scrubber';
import { ChartTooltip } from '../tooltip/ChartTooltip';

export default {
  title: 'Components/Chart/ChartTooltip',
};

const sampleData = {
  price: [102, 104, 101, 108, 110, 111, 109],
  volume: [32, 44, 30, 52, 47, 60, 55],
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const formatCompact = (value: number) =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);

const ChartWithTooltip = memo(
  ({
    seriesIds,
    valueFormatter,
  }: {
    seriesIds?: string[];
    valueFormatter?: (value: number) => React.ReactNode;
  }) => (
    <LineChart
      enableHighlighting
      showArea
      showXAxis
      showYAxis
      height={320}
      series={[
        { id: 'price', label: 'Price', color: '#0052FF', data: sampleData.price },
        { id: 'volume', label: 'Volume', color: '#0A8F5B', data: sampleData.volume },
      ]}
      xAxis={{ data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }}
    >
      <Scrubber />
      <ChartTooltip
        label={(dataIndex) => `Day ${dataIndex + 1}`}
        seriesIds={seriesIds}
        valueFormatter={valueFormatter}
      />
    </LineChart>
  ),
);

export const Basic = () => (
  <VStack gap={2}>
    <Text color="fgMuted" font="body">
      Tooltip follows pointer when hovering and uses highlighted index for content.
    </Text>
    <ChartWithTooltip valueFormatter={formatCurrency} />
  </VStack>
);

export const SeriesIdsFilter = () => (
  <VStack gap={2}>
    <Text color="fgMuted" font="body">
      This example filters tooltip rows to one series via seriesIds.
    </Text>
    <ChartWithTooltip seriesIds={['volume']} valueFormatter={formatCompact} />
  </VStack>
);

const sortSample = {
  a: [30, null, 10, 25, 5],
  b: [10, 20, 5, 15, 40],
  c: [20, 40, null, 10, 12],
};

export const SortOrder = () => (
  <VStack gap={2}>
    <LineChart
      enableHighlighting
      showArea
      showXAxis
      showYAxis
      height={320}
      series={[
        { id: 'a', label: 'Series A', color: '#0052FF', data: sortSample.a },
        { id: 'b', label: 'Series B', color: '#0A8F5B', data: sortSample.b },
        { id: 'c', label: 'Series C', color: '#E45F00', data: sortSample.c },
      ]}
      xAxis={{ data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] }}
    >
      <Scrubber />
      <ChartTooltip
        sort="descending"
        valueFormatter={(value) => {
          if (value === null || value === undefined) return '—';
          if (Array.isArray(value)) {
            return `${formatCompact(value[0])}–${formatCompact(value[1])}`;
          }
          return formatCompact(value);
        }}
      />
    </LineChart>
  </VStack>
);
