import { useState } from 'react';

import { Select } from '../../controls/Select';
import { SelectOption } from '../../controls/SelectOption';

export function Example() {
  const [value, setValue] = useState<string | undefined>('');

  return (
    <Select
      helperText="You can only choose one option"
      label="How many would you like?"
      onChange={setValue}
      placeholder="Choose an amount"
      value={value}
    >
      <SelectOption description="BTC" title="Option 1" value="option-1" />
      <SelectOption description="ETH" title="Option 2" value="option-2" />
    </Select>
  );
}
