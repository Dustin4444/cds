import React from 'react';
// @ts-expect-error -- Fixture import mirrors codemod target imports; fixture files are not validating package export typings.
import { IconButton } from '@coinbase/cds-web';

const iconProps = {
  variant: 'foregroundMuted' as const,
  compact: true,
};

export function Example() {
  return <IconButton {...iconProps} name="close" />;
}
