import { memo, useMemo, useState } from 'react';
import { LineChart, Scrubber } from '@coinbase/cds-web-visualization';

export const LineChartBasicExample = memo(() => {
  const [scrubIndex, setScrubIndex] = useState<number | undefined>(undefined);

  const yData = [2, 5.5, 2, 8.5, 1.5, 5];
  const xData = [1, 2, 3, 5, 8, 10];

  const accessibilityLabel = useMemo(() => {
    if (scrubIndex === undefined) return undefined;
    return `X: ${xData[scrubIndex]}, Y: ${yData[scrubIndex]} at point ${scrubIndex + 1}`;
  }, [scrubIndex, xData, yData]);

  return (
    <LineChart
      enableScrubbing
      points
      showArea
      showXAxis
      showYAxis
      accessibilityLabel={accessibilityLabel}
      curve="natural"
      height={150}
      inset={{ top: 16, right: 16, bottom: 0, left: 0 }}
      onScrubberPositionChange={setScrubIndex}
      series={[
        {
          id: 'line',
          data: yData,
        },
      ]}
      xAxis={{
        data: xData,
        showLine: true,
        showTickMarks: true,
        showGrid: true,
      }}
      yAxis={{
        domain: { min: 0 },
        position: 'left',
        showLine: true,
        showTickMarks: true,
        showGrid: true,
      }}
    >
      <Scrubber hideOverlay />
    </LineChart>
  );
});
