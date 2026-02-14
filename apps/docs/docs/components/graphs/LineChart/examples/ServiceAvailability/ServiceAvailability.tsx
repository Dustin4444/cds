import { memo, useCallback,useMemo } from 'react';
import {
  CartesianChart,
  Line,
  Scrubber,
  XAxis,
  YAxis,
} from '@coinbase/cds-web-visualization/chart';

export const ServiceAvailability = memo(function ServiceAvailability() {
  const availabilityEvents = useMemo(
    () => [
      { date: new Date('2022-01-01'), availability: 79 },
      { date: new Date('2022-01-03'), availability: 81 },
      { date: new Date('2022-01-04'), availability: 82 },
      { date: new Date('2022-01-06'), availability: 91 },
      { date: new Date('2022-01-07'), availability: 92 },
      { date: new Date('2022-01-10'), availability: 86 },
    ],
    [],
  );

  const chartAccessibilityLabel = `Availability chart showing ${availabilityEvents.length} data points over time`;

  const scrubberAccessibilityLabel = useCallback(
    (index: number) => {
      const event = availabilityEvents[index];
      const formattedDate = event.date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const status =
        event.availability >= 90 ? 'Good' : event.availability >= 85 ? 'Warning' : 'Critical';
      return `${formattedDate}: Availability ${event.availability}% - Status: ${status}`;
    },
    [availabilityEvents],
  );

  return (
    <CartesianChart
      enableScrubbing
      accessibilityLabel={chartAccessibilityLabel}
      height={{ base: 200, tablet: 225, desktop: 250 }}
      series={[
        {
          id: 'availability',
          data: availabilityEvents.map((event) => event.availability),
          gradient: {
            stops: ({ min, max }) => [
              { offset: min, color: 'var(--color-fgNegative)' },
              { offset: 85, color: 'var(--color-fgNegative)' },
              { offset: 85, color: 'var(--color-fgWarning)' },
              { offset: 90, color: 'var(--color-fgWarning)' },
              { offset: 90, color: 'var(--color-fgPositive)' },
              { offset: max, color: 'var(--color-fgPositive)' },
            ],
          },
        },
      ]}
      xAxis={{
        data: availabilityEvents.map((event) => event.date.getTime()),
      }}
      yAxis={{
        domain: ({ min, max }) => ({ min: Math.max(min - 2, 0), max: Math.min(max + 2, 100) }),
      }}
    >
      <XAxis
        showGrid
        showLine
        showTickMarks
        tickLabelFormatter={(value) => new Date(value).toLocaleDateString()}
      />
      <YAxis
        showGrid
        showLine
        showTickMarks
        position="left"
        tickLabelFormatter={(value) => `${value}%`}
      />
      <Line
        curve="stepAfter"
        points={(props) => ({
          ...props,
          fill: 'var(--color-bg)',
          stroke: props.fill,
        })}
        seriesId="availability"
      />
      <Scrubber hideOverlay accessibilityLabel={scrubberAccessibilityLabel} />
    </CartesianChart>
  );
});
