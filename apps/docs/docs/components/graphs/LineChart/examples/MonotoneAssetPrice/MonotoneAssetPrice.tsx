import { memo, useMemo, useCallback } from 'react';
import { sparklineInteractiveData } from '@coinbase/cds-common/internal/visualizations/SparklineInteractiveData';
import { LineChart } from '@coinbase/cds-web-visualization/chart';
import {
  Scrubber,
  DefaultScrubberBeacon,
  DefaultAxisTickLabel,
  SolidLine,
} from '@coinbase/cds-web-visualization/chart';

export const MonotoneAssetPrice = memo(function MonotoneAssetPrice() {
  const prices = sparklineInteractiveData.hour;

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

  const CustomYAxisTickLabel = useCallback(
    (props) => (
      <DefaultAxisTickLabel
        {...props}
        dx={4}
        dy={-12}
        horizontalAlignment="left"
      />
    ),
    [],
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
      const price = scrubberPriceFormatter.format(prices[index].value);
      const date = formatDate(prices[index].date);
      return (
        <>
          <tspan style={{ fontWeight: 'bold' }}>{price} USD</tspan> {date}
        </>
      );
    },
    [scrubberPriceFormatter, prices, formatDate],
  );

  const InvertedBeacon = useMemo(
    () => (props) => (
      <DefaultScrubberBeacon
        {...props}
        stroke="var(--color-fg)"
        color="var(--color-bg)"
        radius={5}
        strokeWidth={3}
      />
    ),
    [],
  );

  return (
    <LineChart
      enableScrubbing
      showYAxis
      height={{ base: 200, tablet: 250, desktop: 300 }}
      inset={{ top: 64 }}
      series={[
        {
          id: 'btc',
          data: prices.map((price) => price.value),
          color: 'var(--color-fg)',
          gradient: {
            axis: 'x',
            stops: ({ min, max }) => [
              { offset: min, color: 'var(--color-fg)', opacity: 0 },
              { offset: 32, color: 'var(--color-fg)', opacity: 1 },
            ],
          },
        },
      ]}
      style={{ outlineColor: 'var(--color-fg)' }}
      xAxis={{
        range: ({ min, max }) => ({ min: 96, max: max }),
      }}
      yAxis={{
        position: 'left',
        width: 0,
        showGrid: true,
        tickLabelFormatter: formatPrice,
        TickLabelComponent: CustomYAxisTickLabel,
      }}
    >
      <Scrubber
        hideOverlay
        BeaconComponent={InvertedBeacon}
        LineComponent={SolidLine}
        label={scrubberLabel}
        labelElevated
      />
    </LineChart>
  );
});
