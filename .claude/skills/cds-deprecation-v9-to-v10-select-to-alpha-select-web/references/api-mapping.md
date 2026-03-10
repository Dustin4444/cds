# API Mapping

This reference supports the `cds-deprecation-v9-to-v10-select-to-alpha-select-web` skill.

## Component Model

Legacy web `Select`:

- Import path is in the old `controls` area.
- Renders options as `children`.
- Commonly uses `SelectOption` elements.
- Stores the displayed string on the control with `value` and sometimes `valueLabel`.

Alpha web `Select`:

- Import path is in `alpha/select`.
- Renders from an `options` array.
- Supports single and multi select.
- Derives selected display content from the selected option and the default control renderer.

## Prop Mapping

| Legacy                                  | Alpha                                          | Notes                                                           |
| --------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------- |
| `children`                              | `options`                                      | Convert `SelectOption` nodes to plain objects                   |
| `value?: string`                        | `value: string \| null`                        | Prefer `null` for empty value                                   |
| `onChange?: (newValue: string) => void` | `onChange: (newValue: string \| null) => void` | Widen state when empty selection is possible                    |
| `valueLabel`                            | remove                                         | Usually redundant once `options` has the correct `label`        |
| `label`                                 | `label`                                        | Same concept                                                    |
| `helperText`                            | `helperText`                                   | Same concept                                                    |
| `placeholder`                           | `placeholder`                                  | Same concept                                                    |
| `compact`                               | `compact`                                      | Same concept                                                    |
| `labelVariant`                          | `labelVariant`                                 | Same concept                                                    |
| `startNode`                             | `startNode`                                    | Same concept                                                    |
| `variant`                               | `variant`                                      | Same concept                                                    |
| `disabled`                              | `disabled`                                     | Same concept                                                    |
| `width`                                 | `style` or parent layout                       | Alpha `Select` does not expose `width` directly                 |
| `disablePortal`                         | remove                                         | No direct alpha equivalent                                      |
| `onClick`                               | `open` / `setOpen` if needed                   | Only keep if product logic actually needs controlled open state |
| `accessibilityLabel`                    | `accessibilityLabel`                           | Still supported                                                 |
| `accessibilityLabelledBy`               | manual review                                  | No direct alpha prop                                            |
| `accessibilityHint`                     | manual review                                  | No direct alpha prop                                            |

## SelectOption Mapping

| Legacy `SelectOption` prop | Alpha option field |
| -------------------------- | ------------------ |
| `title`                    | `label`            |
| `description`              | `description`      |
| `value`                    | `value`            |
| `disabled`                 | `disabled`         |
| `media`                    | `media`            |
| `accessory`                | `accessory`        |
| `end`                      | `end`              |

Ignore old option-only behavior that was tied to legacy dropdown internals unless the product still needs it.

## Common Rewrite Pattern

Before:

```tsx
<Select value={value} onChange={setValue}>
  <SelectOption title="Option 1" value="1" />
  <SelectOption description="BTC" title="Option 2" value="2" />
</Select>
```

After:

```tsx
const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2', description: 'BTC' },
];

<Select onChange={setValue} options={options} value={value} />;
```

## Review Traps

- Old code may have used `valueLabel` to display a human-readable label while storing an opaque ID.
- Old code may initialize state with `''` instead of `null`.
- Old code may rely on `width="100%"`; alpha uses standard root styling instead.
- Old code may contain conditionally rendered options that should become a `useMemo`-generated `options` array.
