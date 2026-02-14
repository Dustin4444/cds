import { memo, useMemo } from 'react';
import { useTheme } from '@coinbase/cds-web/hooks/useTheme';
import { Box } from '@coinbase/cds-web/layout/Box';
import type { ChartTextChildren,ScrubberBeaconLabelProps } from '@coinbase/cds-web-visualization/chart';
import {
  DefaultScrubberBeaconLabel,
  getLineData,
  LineChart,
  Scrubber,
  useCartesianChartContext,
  useScrubberContext,
} from '@coinbase/cds-web-visualization/chart';

const PercentageScrubberBeaconLabel = memo(
  ({ seriesId, color, label, ...props }: ScrubberBeaconLabelProps) => {
    const { getSeriesData, dataLength } = useCartesianChartContext();
    const { scrubberPosition } = useScrubberContext();

    const seriesData = useMemo(
      () => getLineData(getSeriesData(seriesId)),
      [getSeriesData, seriesId],
    );

    const dataIndex = useMemo(() => {
      return scrubberPosition ?? Math.max(0, dataLength - 1);
    }, [scrubberPosition, dataLength]);

    const percentageLabel: ChartTextChildren = useMemo(() => {
      if (seriesData !== undefined) {
        const dataAtPosition = seriesData[dataIndex];
        return (
          <>
            {dataAtPosition}%
            <tspan fontWeight="400"> {label}</tspan>
          </>
        );
      }
      return label;
    }, [label, seriesData, dataIndex]);

    return (
      <DefaultScrubberBeaconLabel
        {...props}
        background={color}
        color="rgb(var(--gray0))"
        label={percentageLabel}
        seriesId={seriesId}
      />
    );
  },
);

export function PercentageBeaconLabelChart({ background, scrubberLineStroke, ...props }) {
  return (
    <Box borderRadius={300} padding={2} style={{ background }}>
      <LineChart {...props}>
        <Scrubber
          hideOverlay
          idlePulse
          BeaconLabelComponent={PercentageScrubberBeaconLabel}
          beaconStroke={background}
          lineStroke={scrubberLineStroke}
        />
      </LineChart>
    </Box>
  );
}

export function PercentageBeaconLabels() {
  const theme = useTheme();

  const isLightTheme = theme.activeColorScheme === 'light';
  const background = isLightTheme ? 'rgb(var(--gray90))' : 'rgb(var(--gray0))';
  const scrubberLineStroke = isLightTheme ? 'rgb(var(--gray0))' : 'rgb(var(--gray90))';

  return (
    <PercentageBeaconLabelChart
      enableScrubbing
      showArea
      areaType="dotted"
      background={background}
      height={250}
      inset={{ bottom: 8, left: 8, top: 8, right: 0 }}
      scrubberLineStroke={scrubberLineStroke}
      series={[
        {
          id: 'prices2',
          data: [90, 78, 71, 55, 2, 55, 78, 48, 79, 96, 32, 80, 79, 42],
          color: 'rgb(var(--blue40))',
          label: 'ATL',
        },
        {
          id: 'prices',
          data: [10, 22, 29, 45, 98, 45, 22, 52, 21, 4, 68, 20, 21, 58],
          color: 'rgb(var(--chartreuse40))',
          label: 'NYC',
        },
      ]}
      xAxis={{
        range: ({ min, max }) => ({ min, max: max - 92 }),
      }}
    />
  );
}
