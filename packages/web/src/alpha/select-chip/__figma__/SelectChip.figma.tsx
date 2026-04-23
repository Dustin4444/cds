import { SelectChip } from '@coinbase/cds-web/alpha/select-chip';
import { figma } from '@figma/code-connect';

const selectOptions = [
  { value: 'usd', label: 'USD' },
  { value: 'cad', label: 'CAD' },
  { value: 'gbp', label: 'GBP' },
  { value: 'jpy', label: 'JPY' },
];

figma.connect(
  SelectChip,
  'https://www.figma.com/design/k5CtyJccNQUGMI5bI4lJ2g/✨-CDS-Components?node-id=10177-5222&m=dev',
  {
    imports: ["import { SelectChip } from '@coinbase/cds-web/alpha/select-chip'"],
    props: {
      disabled: figma.enum('state', {
        disabled: true,
      }),
      compact: figma.boolean('compact'),
      startNode: figma.boolean('show start', {
        true: figma.instance('start'),
        false: undefined,
      }),
      label: figma.boolean('show label', {
        true: figma.string('value'),
        false: undefined,
      }),
    },
    example: ({ ...props }) => (
      <SelectChip {...props} onChange={() => {}} options={selectOptions} value="usd" />
    ),
  },
);
