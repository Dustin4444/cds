import React from 'react';
// @ts-expect-error -- Fixture import mirrors codemod target imports; fixture files are not validating package export typings.
import { IconButton } from '@coinbase/cds-web';

const iconProps = {
  variant: 'secondary' as const,
  compact: true,
};

export function Example() {
  return (
    // TODO(cds-migration): IconButton spread props need manual review
    // Found spread props on IconButton. Spread values may still contain legacy variant values. Review spread source and flatten/update variant explicitly. An obvious local object-literal variant was auto-updated, but full spread safety still requires manual verification.
    <IconButton {...iconProps} name="close" />
  );
}
