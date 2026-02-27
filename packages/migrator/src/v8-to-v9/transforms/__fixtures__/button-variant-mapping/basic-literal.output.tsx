import React from 'react';
// @ts-expect-error -- Fixture import mirrors codemod target imports; fixture files are not validating package export typings.
import { Button, IconButton } from '@coinbase/cds-web';

export function Example() {
  return (
    <>
      <Button variant="inverse">Save</Button>
      <IconButton name="close" variant="secondary" />
    </>
  );
}
