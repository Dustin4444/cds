import { memo, useState } from 'react';
import { TabNavigation } from '@coinbase/cds-web/tabs/TabNavigation';

const tabs = [
  { id: 'assets', label: 'Assets' },
  { id: 'activity', label: 'Activity' },
  { id: 'staking', label: 'Staking' },
];

export const TabsExample = memo(() => {
  const [value, setValue] = useState(tabs[0].id);
  return <TabNavigation onChange={setValue} tabs={tabs} value={value} />;
});
