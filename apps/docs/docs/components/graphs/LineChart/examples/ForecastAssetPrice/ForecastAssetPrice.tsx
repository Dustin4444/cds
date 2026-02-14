import { memo, useCallback } from 'react';
import { assets } from '@coinbase/cds-common/internal/data/assets';
import type { DottedLineProps,SolidLineProps } from '@coinbase/cds-web-visualization/chart';
import {
  CartesianChart,
  DefaultScrubberBeacon,
  DottedLine,
  Line,
  Scrubber,
  SolidLine,
  useCartesianChartContext,
  useScrubberContext,
  XAxis,
} from '@coinbase/cds-web-visualization/chart';
import { m } from 'framer-motion';

const startYear = 2020;
const data = [50, 45, 47, 46, 54, 54, 60, 61, 63, 66, 70];
const currentIndex = 6;

const strokeWidth = 3;
const clipOffset = strokeWidth;

const HistoricalLineComponent = memo((props: SolidLineProps) => {
  const { drawingArea, getXScale } = useCartesianChartContext();
  const xScale = getXScale();

  if (!xScale || !drawingArea) return;

  const currentX = xScale(currentIndex);

  if (currentX === undefined) return;

  return (
    <>
      <defs>
        <clipPath id="historical-clip">
          <rect
            height={drawingArea.height + clipOffset * 2}
            width={currentX + clipOffset - drawingArea.x}
            x={drawingArea.x - clipOffset}
            y={drawingArea.y - clipOffset}
          />
        </clipPath>
      </defs>
      <g clipPath="url(#historical-clip)">
        <SolidLine strokeWidth={strokeWidth} {...props} />
      </g>
    </>
  );
});

const ForecastLineComponent = memo((props: DottedLineProps) => {
  const { drawingArea, getXScale } = useCartesianChartContext();
  const xScale = getXScale();

  if (!xScale || !drawingArea) return;

  const currentX = xScale(currentIndex);

  if (currentX === undefined) return;

  return (
    <>
      <defs>
        <clipPath id="forecast-clip">
          <rect
            height={drawingArea.height + clipOffset * 2}
            width={drawingArea.x + drawingArea.width - currentX + clipOffset * 2}
            x={currentX}
            y={drawingArea.y - clipOffset}
          />
        </clipPath>
      </defs>
      <g clipPath="url(#forecast-clip)">
        <DottedLine
          strokeDasharray={`0 ${strokeWidth * 2}`}
          strokeWidth={strokeWidth}
          {...props}
        />
      </g>
    </>
  );
});

const CustomScrubber = memo(() => {
  const { scrubberPosition } = useScrubberContext();
  const isScrubbing = scrubberPosition !== undefined;

  return (
    <m.g
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.15, delay: 0.35 }}
    >
      <g style={{ opacity: isScrubbing ? 1 : 0 }}>
        <Scrubber hideOverlay />
      </g>
      <g style={{ opacity: isScrubbing ? 0 : 1 }}>
        <DefaultScrubberBeacon dataX={currentIndex} dataY={data[currentIndex]} seriesId="price" />
      </g>
    </m.g>
  );
});

export const ForecastAssetPrice = memo(function ForecastAssetPrice() {
  const axisFormatter = useCallback(
    (dataIndex: number) => {
      return startYear + dataIndex;
    },
    [],
  );

  return (
    <CartesianChart
      enableScrubbing
      height={{ base: 200, tablet: 225, desktop: 250 }}
      maxWidth={512}
      series={[{ id: 'price', data, color: assets.btc.color }]}
      style={{ margin: '0 auto' }}
    >
      <Line LineComponent={HistoricalLineComponent} curve="linear" seriesId="price" />
      <Line LineComponent={ForecastLineComponent} curve="monotone" seriesId="price" type="dotted" />
      <XAxis position="bottom" requestedTickCount={3} tickLabelFormatter={axisFormatter} />
      <CustomScrubber />
    </CartesianChart>
  );
});
