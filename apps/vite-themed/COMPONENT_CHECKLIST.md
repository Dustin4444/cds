# Theme-Level Component Config Checklist

Components that need theme-level prop configuration support in the vite-themed app.

| #   | Component                         | Priority | In Vite-Themed App? | Notes                                                    |
| --- | --------------------------------- | -------- | ------------------- | -------------------------------------------------------- |
| 1   | Button                            | Priority | Yes                 | Multiple variants, compact and default sizes             |
| 2   | IconButton                        | Priority | Yes                 | Multiple variants, compact and default sizes             |
| 3   | TextInput (incl. InputIconButton) | Priority | Yes                 | Via `TextInputExample`                                   |
| 4   | SelectInput                       | Priority | Yes                 | Via `SelectExample`                                      |
| 5   | SearchInput                       | Priority | Yes                 | Via `SearchExample`, compact and default                 |
| 6   | Checkbox                          | Priority | Yes                 | Via `ControlsExample`                                    |
| 7   | All Chips                         | Priority | Yes                 | `InputChip`, `SelectChip`, `MediaChip`, and base `Chip`  |
| 8   | Segmented Tab                     |          | Yes                 | Via `SegmentedTabsExample`                               |
| 9   | Date Picker                       |          | Yes                 | Via `DatePickerExample`                                  |
| 10  | Radio Button                      | Priority | Yes                 | Via `ControlsExample`                                    |
| 11  | Switch                            | Priority | Yes                 | Via `ControlsExample`                                    |
| 12  | Tabs                              |          | Yes                 | Via `TabsExample` (TabNavigation)                        |
| 13  | Nudge Card                        |          | Yes                 |                                                          |
| 14  | Upsell Card                       |          | Yes                 |                                                          |
| 15  | Table Cell                        |          | Yes                 | Via `TableExample` with TableHeader, TableBody, TableRow |
| 16  | Table Header                      |          | Yes                 | Via `TableExample`                                       |
| 17  | Dot Count                         | Priority | Yes                 | Three variants with different counts                     |
| 18  | Tag                               |          | Yes                 | Multiple color schemes shown                             |
| 19  | Alert                             |          | Yes                 | Via `AlertExample` (overlay dialog)                      |
| 20  | Coachmark                         |          | Yes                 | Inline coachmark with action                             |
| 21  | Dropdown                          | Priority | Yes                 | Via `DropdownExample` with MenuItems                     |
| 22  | Modal                             | Priority | Yes                 | Via `ModalExample` with Header, Body, Footer             |
| 23  | Sticky Footer (button)            |          | N/A                 | Only available in cds-mobile, not cds-web                |
| 24  | Toast                             |          | Yes                 | Via `ToastExample` with action                           |
| 25  | Tooltip                           |          | Yes                 | Wrapping FloatingAssetCards                              |
| 26  | List Cell                         | Priority | Yes                 | Three list cells with media, title, subtitle             |

## Component Audit

Space token reference: `0.5`=4px, `1`=8px, `1.5`=12px, `2`=16px, `3`=24px, `4`=32px

**General approach:** Prefer adding `styles`/`classNames` support to components over adding new tokens or one-off props. This limits the scope of CDS changes and gives themes maximum flexibility. No new tokens will be added.

### Alert

Figma sources:

- Standard: [CDS Components](https://www.figma.com/design/k5CtyJccNQUGMI5bI4lJ2g/%E2%9C%A8-CDS-Components?node-id=35-698&m=dev)
- Advanced: [Advanced Product Library](https://www.figma.com/design/5jlcPo8JjEehlGkva1e6y2/Advanced-Product-Library?node-id=5991-53452&m=dev)

#### Advanced theme differences (vs Standard)

The Advanced Alert is structurally identical to Standard except for one value:

| Property                | Standard  | Advanced   |
| ----------------------- | --------- | ---------- |
| Content `paddingBottom` | `1` (8px) | `2` (16px) |

Button appearance differences are already handled by the global `Button` config in `advancedComponents.ts`.

**PR needed:** The Alert component currently has no `styles`/`classNames` support — all layout values are hardcoded. To allow Advanced to customize the content area padding, we need to add `styles`/`classNames` with named slots (e.g. `content`, `actions`) to `AlertBaseProps`. Then `advancedComponents.ts` can override it:

```ts
Alert: {
  styles: {
    content: { paddingBottom: theme.space[2] },
  },
},
```

### Button (Priority)

Already handled

### Checkbox (Priority)

#### Advanced theme differences (vs Standard)

| Property             | Standard    | Advanced      | Configurable today?                                      |
| -------------------- | ----------- | ------------- | -------------------------------------------------------- |
| Checked background   | `bgPrimary` | `bgSecondary` | **Yes** — functional config with `props.checked`         |
| Checked border color | `bgPrimary` | `bgSecondary` | **Yes** — functional config with `props.checked`         |
| Check icon color     | `fgInverse` | `fg`          | **Yes** — `controlColor` prop                            |
| Border width         | `100` (1px) | `200` (2px)   | **Yes** — `borderWidth` prop                             |
| Border radius        | `100` (4px) | 2px           | **No** — smallest token `100` = 4px, no 2px token exists |
| Label font           | `body`      | `label2`      | **No** — hardcoded to `"body"` in `Control.tsx` line 206 |

**Configured in `advancedComponents.ts`:** Functional config handles checked/unchecked color swap, `controlColor`, and `borderWidth`.

**PR needed:** Add `styles`/`classNames` support to Checkbox (and ideally to the shared `Control` component). This unblocks:

1. **Border radius 2px** — no token exists for 2px; `styles` lets Advanced set `borderRadius: 2` directly.
2. **Label font** — `Control.tsx` hardcodes `font="body"` on the label `<Text>` (line 206). A `classNames.label` or `styles.label` slot would allow overriding the font without adding a new prop. Since `Control` is shared, this also benefits Radio and Switch.

### Chips (Priority)

#### SelectChip (alpha)

Switched vite-themed example to use `@coinbase/cds-web/alpha/select-chip/SelectChip`. Added `SelectChip` to `ComponentTheme` in both web and mobile `core/theme.ts`.

##### Advanced theme differences (vs Standard)

| Property              | Standard             | Advanced      | Configurable today?                                                                                                                              |
| --------------------- | -------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Padding (all)         | default chip padding | `2` (16px)    | **No** — `useComponentConfig` not wired up; padding props exist in `SelectChipBaseProps` but aren't forwarded through the wrapper to `MediaChip` |
| Border radius         | default chip radius  | `200` (8px)   | **No** — `borderRadius` not in `SelectChipBaseProps`                                                                                             |
| Unselected background | `bgSecondary`        | `bgAlternate` | **No** — hardcoded in `SelectChipControl.tsx` line 150                                                                                           |

**Done:**

- Registered `SelectChip` in `ComponentTheme` on both web (`packages/web/src/core/theme.ts`) and mobile (`packages/mobile/src/core/theme.ts`).

**PRs needed for SelectChip:**

1. **Wire up `useComponentConfig('SelectChip', _props)`** in `SelectChip.tsx` — currently missing, so no config values are read.
2. **Forward padding props** through `createSelectChipControlWrapper` → `SelectChipControl` → `MediaChip`. The props exist in the type but are never plumbed through.
3. **Add `borderRadius` and `background` to `SelectChipBaseProps`** and forward them to `MediaChip`. Currently `background` is hardcoded to `hasValue ? 'bgInverse' : 'bgSecondary'` in `SelectChipControl.tsx` — needs to accept an override for the unselected state.

Once those changes land, `advancedComponents.ts` would be:

```ts
SelectChip: {
  padding: 2,
  borderRadius: 200,
  background: 'bgAlternate', // unselected state
},
```

### Coachmark

### Date Picker

### Dot Count (Priority)

### Dropdown (Priority)

### IconButton (Priority)

### List Cell (Priority)

### Modal (Priority)

### Nudge Card

### Radio Button (Priority)

### SearchInput (Priority)

### Segmented Tab

### SelectInput (Priority)

### Sticky Footer

### Switch (Priority)

### Table Cell

### Table Header

### Tabs

### Tag

### TextInput (Priority)

### Toast

### Tooltip

### Upsell Card

---

## Summary

- **Total components:** 26
- **In app:** 25 (Sticky Footer is mobile-only, not applicable)
- **Priority items:** 14
- **Priority items in app:** 14/14
