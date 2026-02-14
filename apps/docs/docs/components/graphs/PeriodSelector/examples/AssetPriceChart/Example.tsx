import { useCallback, useEffect, useMemo, useState } from 'react';

import { AssetPriceChart } from './AssetPriceChart';
import type { DataPoint, TabItem } from './data';
import { createTimestampFormatter, fetchDataForPeriod, tabs } from './data';

export default function Example() {
  const [activeTab, setActiveTab] = useState<TabItem>(tabs[0]);
  const [data, setData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetchDataForPeriod(activeTab.id).then((result) => {
      if (!cancelled) {
        setData(result);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [activeTab.id]);

  const currentPrice = useMemo(() => {
    if (data.length === 0) return 0;
    return data[data.length - 1].value;
  }, [data]);

  const formatTimestamp = useMemo(() => createTimestampFormatter(activeTab.id), [activeTab.id]);

  const onTimeChange = useCallback((_date: Date | undefined, _price: number | undefined) => {
    // Handle scrubber time changes if needed
  }, []);

  return (
    <AssetPriceChart
      activeTab={activeTab}
      currentPrice={currentPrice}
      data={data}
      formatTimestamp={formatTimestamp}
      isLoading={isLoading}
      onTimeChange={onTimeChange}
      setActiveTab={setActiveTab}
      tabs={tabs}
    />
  );
}
