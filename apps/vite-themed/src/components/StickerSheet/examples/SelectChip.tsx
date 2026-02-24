import { memo, useState } from 'react';
import { SelectChip } from '@coinbase/cds-web/chips/SelectChip';
import { SelectOption } from '@coinbase/cds-web/controls/SelectOption';
import { VStack } from '@coinbase/cds-web/layout/VStack';

const selectChipOptions = ['USD', 'CAD', 'GBP', 'JPY'];

export const SelectChipExample = memo(() => {
  const [selectChipValue, setSelectChipValue] = useState<string | undefined>('USD');
  return (
    <SelectChip
      content={
        <VStack>
          {selectChipOptions.map((option) => (
            <SelectOption key={option} title={option} value={option} />
          ))}
        </VStack>
      }
      onChange={setSelectChipValue}
      placeholder="Select a currency"
      value={selectChipValue}
    />
  );
});
