import { useState } from 'react';

import { Select } from '../../alpha/select';

const options = [
  { value: 'option-1', label: 'Option 1', description: 'BTC' },
  { value: 'option-2', label: 'Option 2', description: 'ETH' },
];

export function Example() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <Select
      helperText="You can only choose one option"
      label="How many would you like?"
      onChange={setValue}
      options={options}
      placeholder="Choose an amount"
      value={value}
    />
  );
}
