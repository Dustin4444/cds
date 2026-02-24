# Required CDS Changes for Advanced Theme

Tracks the component-level changes needed in `packages/web` before they can be fully configured via `advancedComponents.ts`. Updated as each component is analyzed.

> Full audit details for each component live in [`COMPONENT_CHECKLIST.md`](./COMPONENT_CHECKLIST.md). This file is the quick-reference for what's blocked and what's ready.

**Scope for this PR:** Theme-level config changes — adding entries to `advancedComponents.ts`, registering new components in `ComponentTheme` — are in scope. Component source changes in `packages/web` are **not** in scope and are tracked here for follow-up PRs.

## Legend

- **Configurable** — can be set in `advancedComponents.ts` today, no CDS changes needed
- **Done** — theme-level config is in place
- **Separate PR** — requires a change in the CDS component source (`packages/web`) before config works

---

## Alert

| Change                                                                                        | Status    |
| --------------------------------------------------------------------------------------------- | --------- |
| Add `styles`/`classNames` support with named slots (`content`, `actions`) to `AlertBaseProps` | PR needed |

**Why:** Content `paddingBottom` needs to change from `1` → `2`, but layout values are hardcoded with no override path.

---

## Checkbox

| Change                                                                                                | Status       |
| ----------------------------------------------------------------------------------------------------- | ------------ |
| Checked/unchecked background, border color, `controlColor`, `borderWidth`                             | Configurable |
| Add `styles`/`classNames` to `Control` (shared by Checkbox, Radio, Switch) for border radius override | PR needed    |

**Why:** No 2px border-radius token exists (smallest is `100` = 4px). Label font no longer needs to change — Advanced uses `body` (same as Standard).

---

## Coachmark

| Change                                                                                         | Status    |
| ---------------------------------------------------------------------------------------------- | --------- |
| Add `invertColorScheme` prop (default `true`), conditionally wrap with `InvertedThemeProvider` | PR needed |
| Plumb `padding` and `background` from config to the inner content `<VStack>`                   | PR needed |

**Why:** All three desired overrides — disable color inversion, `padding: 3`, `background: 'bgSecondary'` — are hardcoded on inner elements. Config props only reach the outer wrapper today.

**Target config once unblocked:**

```ts
Coachmark: {
  invertColorScheme: false,
  padding: 3,
  background: 'bgSecondary',
},
```

---

## SelectChip (alpha)

| Change                                                                               | Status    |
| ------------------------------------------------------------------------------------ | --------- |
| Wire up `useComponentConfig('SelectChip', _props)` in `SelectChip.tsx`               | PR needed |
| Forward `padding` props through wrapper → `SelectChipControl` → `MediaChip`          | PR needed |
| Add `borderRadius` and `background` to `SelectChipBaseProps`, forward to `MediaChip` | PR needed |

**Why:** Config hook is missing entirely; padding props exist in the type but aren't plumbed; background is hardcoded in `SelectChipControl.tsx`.

**Target config once unblocked:**

```ts
SelectChip: {
  padding: 2,
  borderRadius: 200,
  background: 'bgAlternate',
},
```

---

## Dropdown

| Change                                                  | Status                          |
| ------------------------------------------------------- | ------------------------------- |
| Remove `paddingX` from content wrapper; keep `paddingY` | No CDS change — user-controlled |

Dropdown content padding is set by users in the `content` prop, not by the component. See [Dropdown audit](./COMPONENT_CHECKLIST.md#dropdown-priority) for details.

---

## IconButton

| Change                                                   | Status       |
| -------------------------------------------------------- | ------------ |
| `borderRadius`, `borderWidth`, `padding` (compact-aware) | Configurable |

No CDS changes needed — already configured in `advancedComponents.ts`. See [IconButton audit](./COMPONENT_CHECKLIST.md#iconbutton-priority) for details.

---

## Modal

| Change                                                                                    | Status |
| ----------------------------------------------------------------------------------------- | ------ |
| Register `ModalHeader` / `ModalFooter` in `ComponentTheme` + wire up `useComponentConfig` | Done   |
| `ModalHeader` padding config (`paddingX: 4`, `paddingY: 3`)                               | Done   |
| `ModalFooter` padding config (`paddingX: 4`, `paddingY: 4`)                               | Done   |

Theme-level config is in place in `advancedComponents.ts`. See [Modal audit](./COMPONENT_CHECKLIST.md#modal-priority) for details.

---

## Radio

| Change                                          | Status       |
| ----------------------------------------------- | ------------ |
| Unchecked `borderColor` → `bgLinePrimarySubtle` | Configurable |
| `borderWidth` `100` → `200` (1px → 2px)         | PR needed    |

`borderColor` is already configured in `advancedComponents.ts`. `borderWidth` is hardcoded in CSS — Radio needs to forward it to the inner Box like Checkbox does. See [Radio audit](./COMPONENT_CHECKLIST.md#radio-button-priority) for details.

---

## SearchInput

| Change                                                                | Status    |
| --------------------------------------------------------------------- | --------- |
| Add `borderRadius` to `SearchInputBaseProps`; remove hardcoded `1000` | PR needed |
| Add icon-to-text gap prop (or `styles`/`classNames` on `TextInput`)   | PR needed |
| Make height configurable (expose `height` or allow `scales` override) | PR needed |

All three Advanced differences (border radius `200`, icon gap `2` when not compact, height `32px`/`24px`) are hardcoded. See [SearchInput audit](./COMPONENT_CHECKLIST.md#searchinput-priority) for details.

---

## Segmented Tab

| Change                                                                             | Status                            |
| ---------------------------------------------------------------------------------- | --------------------------------- |
| Register `SegmentedTabs` + `SegmentedTab` in `ComponentTheme` (web + mobile)       | Done                              |
| Wire up `useComponentConfig` in `SegmentedTabs.tsx` (web + mobile)                 | Done                              |
| Wire up `useComponentConfig` in `SegmentedTab.tsx` (web + mobile)                  | Done                              |
| Add `activeBorderRadius` to `TabsBaseProps`, forward to indicator (web + mobile)   | Done                              |
| `activeBackground`, `background`, `borderRadius` (container) config                | Done                              |
| `activeColor` config on individual tabs                                            | Done                              |
| Individual tab `borderRadius` config                                               | Done (inline style overrides CSS) |
| Remove redundant `border-radius: var(--borderRadius-1000)` from `SegmentedTab` CSS | Cleanup PR                        |

All Advanced differences are now configurable via `advancedComponents.ts`. The hardcoded CSS `border-radius` in `SegmentedTab`'s `buttonCss` class is still present but has no effect because the `borderRadius` prop generates an inline style that takes precedence. Removing it is a cleanup task for a follow-up PR. See [Segmented Tab audit](./COMPONENT_CHECKLIST.md#segmented-tab) for details.

---

## Table Components

| Change                                                                 | Status |
| ---------------------------------------------------------------------- | ------ |
| Register `Table` in `ComponentTheme` + wire up `useComponentConfig`    | Done   |
| Register `TableRow` in `ComponentTheme` + wire up `useComponentConfig` | Done   |
| `TableCell` — already registered and wired up                          | Done   |
| `TableHeader` — already registered and wired up                        | Done   |

All four table components (`Table`, `TableCell`, `TableHeader`, `TableRow`) are now registered in `ComponentTheme` and wired up with `useComponentConfig`. Config values in `advancedComponents.ts` can be added once the Advanced Figma specs for tables are audited. Table components are web-only — no mobile equivalents exist. See [Table audit](./COMPONENT_CHECKLIST.md#table-container) for details.

---

## Tabs

| Change | Status |
| --- | --- |
| Migrate vite-themed example from `TabNavigation` to `Tabs` | Done |
| Inactive tab color `fg` → `fgMuted`, active `fgPrimary` → `fg` | Separate PR (tab styling is on custom `NavigationTab`, not in `Tabs` config) |
| Label-to-indicator padding `2` → `3` | Separate PR (same — custom component, not configurable) |

Migrated to `Tabs` with a custom `NavigationTab` + underline indicator. Tab-level styling (colors, padding) lives on the custom component, not reachable via `Tabs` config. Needs a registered CDS component to be theme-configurable. See [Tabs audit](./COMPONENT_CHECKLIST.md#tabs) for details.

---

## Tag

| Change | Status |
| --- | --- |
| `paddingX` `1` (promotional) → `0.5` for all tags | Separate PR (add `paddingX` to `TagBaseProps`) |

Minimal change — `paddingX` not in `TagBaseProps` type, but the spread order in `Tag.tsx` already supports override at runtime. Just needs the type addition. See [Tag audit](./COMPONENT_CHECKLIST.md#tag) for details.

---

## InputChip

| Change | Status |
| --- | --- |
| Register `InputChip` (or `MediaChip`) in `ComponentTheme` + wire up `useComponentConfig` | Separate PR |
| `paddingX: 2`, `paddingY: 1.5`, `borderRadius: 200`, `background: 'bgInverse'` | Separate PR (blocked on registration) |

Neither `InputChip` nor `MediaChip` are in `ComponentTheme`. See [InputChip audit](./COMPONENT_CHECKLIST.md#inputchip) for details.

---

## ListCell

| Change | Status |
| --- | --- |
| Expose `minHeight` as overridable prop on `ListCellBaseProps` | Separate PR |

Styling matches Standard, but the hardcoded `minHeight` needs to be overridable (set to `0`) for Advanced layout. See [ListCell audit](./COMPONENT_CHECKLIST.md#list-cell-priority) for details.

---

## Component Audit Status

- [x] Button _(configurable — done)_
- [x] IconButton _(configurable — done)_
- [ ] TextInput / InputIconButton _(needs deeper input work)_
- [ ] SelectInput _(needs deeper input work)_
- [x] SearchInput _(all three changes need separate PRs)_
- [x] InputChip _(separate PR — not registered)_
- [x] SelectChip _(separate PR — not wired up)_
- [x] Segmented Tab _(done — config in place)_
- [ ] Date Picker _(needs deeper input work)_
- [x] Radio Button _(borderColor configurable; borderWidth separate PR)_
- [x] Switch _(configurable — done)_
- [x] Tabs _(migrated; tab styling needs separate PR)_
- [x] Table Cell _(configurable — border via Table variant)_
- [x] Table Header _(no differences)_
- [x] Dot Count _(no changes needed — modified elsewhere)_
- [x] Tag _(paddingX needs type addition — minimal PR)_
- [x] Dropdown _(user-controlled — no CDS change needed)_
- [x] Modal _(done — config in place)_
- [x] Toast _(no differences)_
- [x] Tooltip _(configurable — already done)_
- [x] ListCell _(matches; minHeight override needs separate PR)_
- ~~Nudge Card~~ _(dropped — outdated)_
- ~~Upsell Card~~ _(dropped — outdated)_
- ~~MediaChip~~ _(dropped — not in Advanced designs)_
- ~~base Chip~~ _(dropped — not in Advanced designs)_
