import { useMemo, useState } from 'react';

import { DotSymbol } from '../../dots';
import { Box } from '../../layout/Box';
import { RemoteImage } from '../../media';
import { Select } from '../../alpha/select';

const assets = [
  { value: 'btc', label: 'Bitcoin', imageUrl: '/btc.png' },
  { value: 'eth', label: 'Ethereum', imageUrl: '/eth.png' },
];

export function AssetExample() {
  const [value, setValue] = useState<string | null>('btc');
  const selectedAsset = assets.find((asset) => asset.value === value) ?? assets[0];

  const options = useMemo(
    () =>
      assets.map((asset) => ({
        value: asset.value,
        label: asset.label,
        description: 'Asset',
        media: <RemoteImage shape="circle" size="l" source={asset.imageUrl} />,
      })),
    [],
  );

  return (
    <Select
      label="Select asset"
      onChange={setValue}
      options={options}
      startNode={
        <Box paddingX={2}>
          <DotSymbol overlap="circular" pin="bottom-end" size="s" source="/eth.png">
            <RemoteImage shape="circle" size="l" source={selectedAsset.imageUrl} />
          </DotSymbol>
        </Box>
      }
      value={value}
    />
  );
}
