/**
 * Temporary file to test @coinbase/cds/no-dangerously-set-background in the docs app.
 * Run: yarn eslint apps/docs/src/test-no-dangerously-set-background.tsx
 * You should see a warning on the Button line. Delete this file when done.
 */
import { Button } from '@coinbase/cds-web/buttons';
import { MessagingCard as MessagingCardComponent } from '@coinbase/cds-web/cards/MessagingCard';
import { Interactable } from '@coinbase/cds-web/system/Interactable';

export function TestComponent() {
  return (
    <>
      <Interactable dangerouslySetBackground="red">This should trigger the rule</Interactable>
      <MessagingCardComponent
        renderAsPressable
        dangerouslySetBackground="red"
        mediaPlacement="end"
        type="upsell"
      >
        This should trigger the rule
      </MessagingCardComponent>
    </>
  );
}
