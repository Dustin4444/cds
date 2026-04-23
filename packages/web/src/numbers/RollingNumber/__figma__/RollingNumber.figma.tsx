import { RollingNumber } from '@coinbase/cds-web/numbers/RollingNumber';
import { figma } from '@figma/code-connect';

figma.connect(
  RollingNumber,
  'https://www.figma.com/design/k5CtyJccNQUGMI5bI4lJ2g/%E2%9C%A8-CDS-Components?node-id=70552-507&m=dev',
  {
    imports: ["import { RollingNumber } from '@coinbase/cds-web/numbers/RollingNumber'"],
    example: () => (
      <RollingNumber
        font="display1"
        format={{ style: 'currency', currency: 'USD' }}
        value={12345.67}
      />
    ),
  },
);
