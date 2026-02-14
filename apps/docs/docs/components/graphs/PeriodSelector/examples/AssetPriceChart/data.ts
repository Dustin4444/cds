export type PeriodId = 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';

export type DataPoint = {
  value: number;
  date: Date;
};

export type TabItem = {
  id: PeriodId;
  label: string;
};

export const tabs: TabItem[] = [
  { id: 'hour', label: '1H' },
  { id: 'day', label: '1D' },
  { id: 'week', label: '1W' },
  { id: 'month', label: '1M' },
  { id: 'year', label: '1Y' },
  { id: 'all', label: 'All' },
];

// -- Coinbase Advanced Trade API types --

type Candle = {
  start: string;
  low: string;
  high: string;
  open: string;
  close: string;
  volume: string;
};

type PeriodConfig = {
  granularity: string;
  durationSeconds: number;
  granularitySeconds: number;
};

const MAX_CANDLES_PER_REQUEST = 350;

const PERIOD_CONFIGS: Record<PeriodId, PeriodConfig> = {
  hour: { granularity: 'ONE_MINUTE', durationSeconds: 3600, granularitySeconds: 60 },
  day: { granularity: 'FIVE_MINUTES', durationSeconds: 86400, granularitySeconds: 300 },
  week: { granularity: 'FIFTEEN_MINUTES', durationSeconds: 7 * 86400, granularitySeconds: 900 },
  month: { granularity: 'ONE_HOUR', durationSeconds: 30 * 86400, granularitySeconds: 3600 },
  year: { granularity: 'ONE_DAY', durationSeconds: 365 * 86400, granularitySeconds: 86400 },
  all: { granularity: 'ONE_DAY', durationSeconds: 5 * 365 * 86400, granularitySeconds: 86400 },
};

const DEFAULT_PRODUCT_ID = 'BTC-USD';

async function fetchCandles(
  productId: string,
  start: number,
  end: number,
  granularity: string,
): Promise<Candle[]> {
  const url = new URL(
    `https://api.coinbase.com/api/v3/brokerage/market/products/${productId}/candles`,
  );
  url.searchParams.set('start', String(start));
  url.searchParams.set('end', String(end));
  url.searchParams.set('granularity', granularity);
  url.searchParams.set('limit', String(MAX_CANDLES_PER_REQUEST));

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Candle fetch failed: ${response.status}`);
  }
  const json = await response.json();
  return json.candles ?? [];
}

/**
 * Fetches candle data from the Coinbase public API for the given period.
 * Automatically paginates when the requested time window exceeds the
 * 350-candle-per-request limit.
 */
export async function fetchDataForPeriod(
  periodId: PeriodId,
  productId = DEFAULT_PRODUCT_ID,
): Promise<DataPoint[]> {
  const { granularity, durationSeconds, granularitySeconds } = PERIOD_CONFIGS[periodId];
  const now = Math.floor(Date.now() / 1000);
  const start = now - durationSeconds;

  const allCandles: Candle[] = [];
  let chunkStart = start;

  while (chunkStart < now) {
    const chunkEnd = Math.min(chunkStart + MAX_CANDLES_PER_REQUEST * granularitySeconds, now);
    const candles = await fetchCandles(productId, chunkStart, chunkEnd, granularity);
    allCandles.push(...candles);
    chunkStart = chunkEnd;
  }

  return allCandles
    .map((candle) => ({
      value: parseFloat(candle.close),
      date: new Date(Number(candle.start) * 1000),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

// -- Timestamp formatters --

/**
 * Creates a timestamp formatter appropriate for the given period:
 * - hour:       "8:00:45 PM"
 * - day/week:   "Sunday 3:00 PM"
 * - month:      "December 1, 8:00 AM"
 * - year/all:   "January 1, 2024"
 */
export function createTimestampFormatter(periodId: PeriodId): (date: Date) => string {
  switch (periodId) {
    case 'hour':
      return (date: Date) =>
        date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });

    case 'day':
    case 'week':
      return (date: Date) => {
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        const time = date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
        return `${dayOfWeek} ${time}`;
      };

    case 'month':
      return (date: Date) => {
        const month = date.toLocaleDateString('en-US', { month: 'long' });
        const day = date.getDate();
        const time = date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
        return `${month} ${day}, ${time}`;
      };

    case 'year':
    case 'all':
      return (date: Date) =>
        date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
  }
}
