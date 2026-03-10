import { useState } from 'react';

import { DotSymbol } from '../../dots';
import { Box } from '../../layout/Box';
import { RemoteImage } from '../../media';
import { Select } from '../../controls/Select';
import { SelectOption } from '../../controls/SelectOption';

const assets = [
  { value: 'btc', label: 'Bitcoin', imageUrl: '/btc.png' },
  { value: 'eth', label: 'Ethereum', imageUrl: '/eth.png' },
];

export function AssetExample() {
  const [value, setValue] = useState<string | undefined>('btc');
  const selectedAsset = assets.find((asset) => asset.value === value) ?? assets[0];

  return (
    <Select
      label="Select asset"
      onChange={setValue}
      startNode={
        <Box paddingX={2}>
          <DotSymbol overlap="circular" pin="bottom-end" size="s" source="/eth.png">
            <RemoteImage shape="circle" size="l" source={selectedAsset.imageUrl} />
          </DotSymbol>
        </Box>
      }
      value={value}
      valueLabel={selectedAsset.label}
    >
      {assets.map((asset) => (
        <SelectOption
          key={asset.value}
          description="Asset"
          media={<RemoteImage shape="circle" size="l" source={asset.imageUrl} />}
          title={asset.label}
          value={asset.value}
        />
      ))}
    </Select>
  );
}
