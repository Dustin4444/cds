---
name: cds-deprecation-v9-to-v10-select-to-alpha-select-web
description: Migrate deprecated web Select usage from `packages/web/src/controls/Select.tsx` to the alpha Select in `packages/web/src/alpha/select/Select.tsx`. Use this whenever a repo is cleaning up CDS v9 deprecations before v10 and the code imports the old web Select or `SelectOption`, uses child-based Select options, or needs help converting `valueLabel`, `SelectOption` children, and legacy Select props into the alpha options-array API.
---

# Web Select To Alpha Select

Use this skill when migrating deprecated web `Select` usage to the alpha web `Select`.

This migration is not just an import rename. The old component is a trigger plus `SelectOption` children model. The alpha component is an options-driven API with richer customization and slightly different value semantics.

## What Changed

- Old web `Select` takes `children` and usually renders many `SelectOption` elements.
- Alpha web `Select` takes an `options` array.
- Old `SelectOption.title` becomes alpha option `label`.
- Old `SelectOption.description`, `media`, `accessory`, `end`, and `disabled` map naturally onto alpha option objects.
- Old `valueLabel` usually disappears because alpha `Select` can derive the displayed label from the selected option object.
- Old `value` is commonly `string | undefined`; alpha `Select` prefers `string | null` for single select.
- Old `width` and `disablePortal` are not alpha `Select` props.

If you need exact mappings or examples, read `references/api-mapping.md` and the files in `examples/`.

## Migration Workflow

1. Find imports of the deprecated web `Select` and `SelectOption`.
2. Replace them with the alpha `Select` import.
3. Convert child `SelectOption` nodes into an `options` array.
4. Normalize state from `string | undefined` to `string | null` when needed.
5. Remove props that no longer exist, especially `valueLabel`, `width`, `disablePortal`, and `onClick`.
6. Preserve supported props that still exist, such as `label`, `helperText`, `placeholder`, `compact`, `labelVariant`, `startNode`, `endNode`, `variant`, and `disabled`.
7. If layout depended on `width`, move that concern to `style`, `className`, or a parent layout component.
8. Re-check behavior for empty selection, focus/open behavior, and accessibility labels.

## Import Rewrite

Old pattern:

```tsx
import { Select } from '@coinbase/cds-web/controls';
import { SelectOption } from '@coinbase/cds-web/controls';
```

Preferred new pattern:

```tsx
import { Select } from '@coinbase/cds-web/alpha/select';
```

If the local import style is relative, keep it consistent with the surrounding file.

## Core Rewrite Rule

Convert this:

```tsx
<Select value={value} onChange={setValue}>
  <SelectOption title="Option 1" value="1" />
  <SelectOption description="BTC" title="Option 2" value="2" />
</Select>
```

Into this:

```tsx
const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2', description: 'BTC' },
];

<Select onChange={setValue} options={options} value={value} />;
```

## Mapping Rules

- `SelectOption.title` -> `option.label`
- `SelectOption.description` -> `option.description`
- `SelectOption.media` -> `option.media`
- `SelectOption.accessory` -> `option.accessory`
- `SelectOption.end` -> `option.end`
- `SelectOption.disabled` -> `option.disabled`
- `SelectOption.value` -> `option.value`
- `SelectOption.Component` does not exist on the old API; if custom option rendering existed through wrappers, model it with alpha option `Component` or `SelectOptionComponent`

## State Rules

- Prefer `const [value, setValue] = useState<string | null>(null)` for single select.
- If old code uses `''` or `undefined` for "no selection", migrate carefully to `null`.
- If the old options intentionally supported clearing the selection, include a nullable option like `{ value: null, label: 'Remove selection' }`.

## Props To Remove Or Rework

- Remove `valueLabel`. Alpha `Select` displays the selected option label from `options`.
- Remove `width`. Use `style`, `className`, or a parent layout wrapper instead.
- Remove `disablePortal`. Alpha `Select` does not expose that prop.
- Remove `onClick` on the old root `Select`. If custom open behavior is required, use alpha `open` and `setOpen`.
- Old accessibility props like `accessibilityLabelledBy` and `accessibilityHint` do not map directly. Keep `accessibilityLabel` and add `controlAccessibilityLabel` when the visible label is not enough.

## When To Pause And Be Careful

Pause and reason more carefully if any of these are true:

- `Select` children are not a flat list of `SelectOption` elements.
- Options are conditionally rendered or built from nested React trees.
- The old component relies on `valueLabel` to show text that does not match the option label.
- The file depended on `disableCloseOnOptionChange` behavior from old option internals.
- The migration should become multi-select. This is not a one-to-one rewrite and needs alpha `type="multi"` plus array state.

## Output Expectations

When performing this migration, produce:

- The rewritten import(s)
- A local `options` array or memoized options list
- Updated single-select state typed as `string | null` when appropriate
- Removal or adaptation of unsupported old props
- A short note calling out anything that still needs manual product review

## Validation Checklist

- The file no longer imports the deprecated web `Select` or `SelectOption`.
- The alpha `Select` receives an `options` prop.
- The selected value type matches alpha expectations.
- The displayed selected label still matches product intent.
- Placeholder, helper text, and start/end visuals still render correctly.
- Layout still looks correct without the old `width` prop.

## Examples

- Basic child-to-options rewrite: `examples/basic.before.tsx` -> `examples/basic.after.tsx`
- Asset-style example with `valueLabel` removal and media mapping: `examples/asset.before.tsx` -> `examples/asset.after.tsx`
