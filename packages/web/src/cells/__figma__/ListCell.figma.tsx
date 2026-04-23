import { figma } from '@figma/code-connect';

import { ListCell } from '../ListCell';

figma.connect(
  ListCell,
  'https://www.figma.com/design/k5CtyJccNQUGMI5bI4lJ2g/%E2%9C%A8-CDS-Components?node-id=62311-39845&m=dev',
  {
    imports: ["import { ListCell } from '@coinbase/cds-web/cells/ListCell'"],
    props: {
      disabled: figma.enum('state', {
        disabled: true,
      }),
      selected: figma.enum('state', {
        selected: true,
      }),
      subtitle: figma.boolean('show subtitle', {
        true: 'Subtitle',
        false: undefined,
      }),
      media: figma.boolean('show start', {
        true: figma.instance('media'),
        false: undefined,
      }),
      end: figma.boolean('show end', {
        true: figma.instance('end'),
        false: undefined,
      }),
      description: figma.boolean('show description', {
        true: 'Description',
        false: undefined,
      }),
      action: figma.boolean('show end', {
        true: figma.instance('end'),
        false: undefined,
      }),
      accessory: figma.boolean('show accessory', {
        true: figma.instance('accessory'),
        false: undefined,
      }),
      bottomContent: figma.boolean('show helper text', {
        true: 'Helper text',
        false: undefined,
      }),
    },
    example: (props) => <ListCell {...props} />,
  },
);
