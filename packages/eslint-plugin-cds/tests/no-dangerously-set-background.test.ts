import { RuleTester } from '@typescript-eslint/rule-tester';

import { noDangerouslySetBackground } from '../src/rules/no-dangerously-set-background';

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

ruleTester.run(
  'no-dangerously-set-background',
  noDangerouslySetBackground as unknown as Parameters<typeof ruleTester.run>[1],
  {
    valid: [
      {
        code: '<Box backgroundColor="bgPrimary" />',
      },
      {
        code: '<Box dangerouslySetBackground="red" />',
      },
      {
        code: '<MessagingCard blendStyles={{ background: "red" }} />',
      },
      {
        code: '<MessagingCard styles={{ root: { backgroundColor: "red" } }} />',
      },
      {
        code: '<MessagingCard renderAsPressable={false} dangerouslySetBackground="red" />',
      },
      {
        code: '<MessagingCard dangerouslySetBackground="rgb(var(--blue80))" />',
      },
      {
        code: '<DataCard dangerouslySetBackground="#ccc" />',
      },
      {
        code: '<UpsellCard dangerouslySetBackground="#ccc" />',
      },
      {
        code: '<CardRoot dangerouslySetBackground="red">...</CardRoot>',
      },
      {
        code: '<Button>Submit</Button>',
      },
      {
        code: 'import { Button } from \'./my-button\'; const x = <Button dangerouslySetBackground="red">Submit</Button>;',
      },
    ],
    invalid: [
      {
        code: 'import { Button as SubmitButton } from \'@coinbase/cds-web\'; const x = <SubmitButton dangerouslySetBackground="red">Submit</SubmitButton>;',
        errors: [{ messageId: 'usePreferredApi' }],
      },
      {
        code: 'import { Interactable } from \'@coinbase/cds-web\'; const x = <Interactable dangerouslySetBackground="red" />;',
        errors: [{ messageId: 'usePreferredApi' }],
      },
      {
        code: 'import { Pressable } from \'@coinbase/cds-web\'; const x = <Pressable dangerouslySetBackground="red" />;',
        errors: [{ messageId: 'usePreferredApi' }],
      },
      {
        code: 'import { Button } from \'@coinbase/cds-web\'; const x = <Button dangerouslySetBackground="red">Submit</Button>;',
        errors: [{ messageId: 'usePreferredApi' }],
      },
      {
        code: 'import { MessagingCard } from \'@coinbase/cds-web\'; const x = <MessagingCard renderAsPressable dangerouslySetBackground="rgb(var(--blue80))" />;',
        errors: [{ messageId: 'usePreferredApi' }],
      },
      {
        code: 'import { MessagingCard } from \'@coinbase/cds-web\'; const x = <MessagingCard renderAsPressable={true} dangerouslySetBackground="red" />;',
        errors: [{ messageId: 'usePreferredApi' }],
      },
      {
        code: 'import { MediaCard } from \'@coinbase/cds-web\'; const x = <MediaCard renderAsPressable dangerouslySetBackground="red" />;',
        errors: [{ messageId: 'usePreferredApi' }],
      },
      {
        code: 'import { DataCard } from \'@coinbase/cds-web\'; const x = <DataCard renderAsPressable={true} dangerouslySetBackground="#ccc" />;',
        errors: [{ messageId: 'usePreferredApi' }],
      },
      {
        code: 'import { Button } from \'@coinbase/cds-mobile\'; const x = <Button dangerouslySetBackground="red">Submit</Button>;',
        errors: [{ messageId: 'usePreferredApi' }],
      },
      {
        code: 'import { MessagingCard } from \'@coinbase/cds-web/cards\'; const x = <MessagingCard renderAsPressable dangerouslySetBackground="red" />;',
        errors: [{ messageId: 'usePreferredApi' }],
      },
    ],
  },
);
