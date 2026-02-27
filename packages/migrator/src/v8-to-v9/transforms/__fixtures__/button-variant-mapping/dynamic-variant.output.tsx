import React from 'react';
// @ts-expect-error -- Fixture import mirrors codemod target imports; fixture files are not validating package export typings.
import { Button } from '@coinbase/cds-web';

// @ts-expect-error -- Fixture uses unresolved helper to represent a dynamic runtime variant source.
const variant = getVariant();

export function Example() {
  return (
    // TODO(cds-migration): Button variant requires manual migration
    // Found dynamic or non-literal variant value. Verify mapping to v9 variants and update manually if needed.
    <Button variant={variant}>Save</Button>
  );
}
