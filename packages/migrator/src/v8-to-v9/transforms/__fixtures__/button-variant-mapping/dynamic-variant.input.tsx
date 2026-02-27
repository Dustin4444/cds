import React from 'react';
// @ts-expect-error -- Fixture import mirrors codemod target imports; fixture files are not validating package export typings.
import { Button } from '@coinbase/cds-web';

// @ts-expect-error -- Fixture uses unresolved helper to represent a dynamic runtime variant source.
const variant = getVariant();

export function Example() {
  return <Button variant={variant}>Save</Button>;
}
