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
| Label font           | `body`      | `body` (same) | N/A — Advanced uses `body` too; no override needed       |

> **Note:** Label font was originally expected to change to `label2`, but Advanced will use `body` — same as Standard and consistent with Radio and Switch. Adding `styles`/`classNames` support to the shared `Control` component for label font overrides is still worthwhile for future flexibility, but is no longer blocking.

**Configured in `advancedComponents.ts`:** Functional config handles checked/unchecked color swap, `controlColor`, and `borderWidth`.

**PR needed:** Add `styles`/`classNames` support to Checkbox (and ideally to the shared `Control` component). This unblocks:

1. **Border radius 2px** — no token exists for 2px; `styles` lets Advanced set `borderRadius: 2` directly.

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

#### InputChip

Figma sources:

- Standard: [CDS Components](https://www.figma.com/design/k5CtyJccNQUGMI5bI4lJ2g/%E2%9C%A8-CDS-Components?node-id=10177-5161&m=dev)
- Advanced: [Advanced Product Library](https://www.figma.com/design/5jlcPo8JjEehlGkva1e6y2/Advanced-Product-Library?node-id=5761-332334&m=dev)

##### Advanced theme differences (vs Standard)

| Property       | Standard   | Advanced      | Configurable today?                                                    |
| -------------- | ---------- | ------------- | ---------------------------------------------------------------------- |
| `paddingX`     | `1.5`      | `2`           | **No** — `InputChip` not registered in `ComponentTheme`                |
| `paddingY`     | `1`        | `1.5`         | **No** — same                                                          |
| Border radius  | `700`      | `200`         | **No** — same                                                          |
| Background     | default    | `bgInverse`   | **No** — same                                                          |
| Color          | default    | `fgInverse`   | **No** — same                                                          |

Neither `InputChip` nor `MediaChip` are registered in `ComponentTheme` or use `useComponentConfig`. `InputChip` is a thin wrapper around `MediaChip` — padding and borderRadius props DO flow through via `{...props}`, but there's no theme-level override path.

**Separate PR needed:** Register `InputChip` (or `MediaChip`) in `ComponentTheme` and wire up `useComponentConfig`. Once done:

```ts
InputChip: {
  paddingX: 2,
  paddingY: 1.5,
  borderRadius: 200,
  background: 'bgInverse',
  color: 'fgInverse',
},
```

> **Note:** MediaChip and base Chip are not used in the Advanced designs and have been dropped from the audit.

### Coachmark

Figma sources:

- Standard: _TODO — add link_
- Advanced: _TODO — add link_

#### Advanced theme differences (vs Standard)

| Property           | Standard                           | Advanced      | Configurable today?                                                                                    |
| ------------------ | ---------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------ |
| Color scheme       | Inverted (`InvertedThemeProvider`) | Not inverted  | **No** — `InvertedThemeProvider` is hardcoded (line 72); no `invertColorScheme` prop exists            |
| Content padding    | `2` (16px)                         | `3` (24px)    | **No** — hardcoded on inner `<VStack>` (line 93); config props only reach the outer wrapper via spread |
| Content background | `bg` (resolves to inverted bg)     | `bgSecondary` | **No** — hardcoded on inner `<VStack>` (line 93)                                                       |

> **Note:** `useComponentConfig('Coachmark', _props)` IS wired up and `Coachmark` IS registered in `ComponentTheme`, but config props spread onto the **outer** `<VStack>` via `{...props}`. The inner content `<VStack>` (line 93) has its own hardcoded `background="bg"` and `padding={2}`, and the `InvertedThemeProvider` wrapper (line 72) is unconditional — so none of the desired overrides can be applied via config today.

**PR needed:**

1. **Add `invertColorScheme` prop** to `CoachmarkBaseProps` (default `true`), conditionally wrap with `InvertedThemeProvider` — follows the same pattern as `Tooltip`.
2. **Plumb `padding` and `background` to the inner content `<VStack>`** — destructure them from the merged config props and apply to the inner VStack instead of hardcoding `padding={2}` and `background="bg"`.

Once those changes land, `advancedComponents.ts` would be:

```ts
Coachmark: {
  invertColorScheme: false,
  padding: 3,
  background: 'bgSecondary',
},
```

### Date Picker

Needs further research

### Dot Count (Priority)

No Advanced theme changes needed — being modified elsewhere.

### Dropdown (Priority)

#### Advanced theme differences (vs Standard)

| Property   | Standard | Advanced    | Configurable today?                          |
| ---------- | -------- | ----------- | -------------------------------------------- |
| `paddingX` | present  | removed (0) | **N/A** — set by users in the `content` prop |
| `paddingY` | present  | keep as-is  | **N/A** — set by users in the `content` prop |

**No CDS changes needed.** Dropdown content padding is controlled by the consumer — users wrap their menu items in an `HStack` (or similar) with explicit `paddingX`/`paddingY` in the `content` prop. For the Advanced theme, users simply drop `paddingX` from their content wrapper and keep `paddingY`.

### IconButton (Priority)

#### Advanced theme differences (vs Standard)

| Property      | Standard | Advanced      | Configurable today?                            |
| ------------- | -------- | ------------- | ---------------------------------------------- |
| Border radius | default  | `200` (pill)  | **Yes** — `borderRadius` prop                  |
| Border width  | default  | `0` (none)    | **Yes** — `borderWidth` prop                   |
| Padding       | default  | compact-aware | **Yes** — `padding` prop via functional config |

**Already configured in `advancedComponents.ts`:**

```ts
IconButton: (props) => ({
  borderRadius: 200,
  borderWidth: 0,
  padding: props.compact ? 1.5 : 2,
}),
```

No CDS changes needed.

### List Cell (Priority)

Styling matches between Standard and Advanced. However, the CDS `ListCell` component has a hardcoded `minHeight` (computed from `spacingVariant` — `compactListHeight` or `listHeight` tokens) that may need to be overridden or set to `0` for the Advanced layout.

`ListCell` IS registered in `ComponentTheme` and uses `useComponentConfig('ListCell', _props)`, but `minHeight` is computed internally and not a configurable prop.

**Separate PR needed:** Expose `minHeight` as an overridable prop on `ListCellBaseProps`, or allow the config to override it. Once done:

```ts
ListCell: {
  minHeight: 0,
},
```

### Modal (Priority)

Figma sources:

- Standard: [CDS Components](https://www.figma.com/design/k5CtyJccNQUGMI5bI4lJ2g/%E2%9C%A8-CDS-Components?node-id=68-1065&m=dev)
- Advanced: [Advanced Product Library](https://www.figma.com/design/5jlcPo8JjEehlGkva1e6y2/Advanced-Product-Library?node-id=5629-15033&m=dev)

#### Advanced theme differences (vs Standard)

**Header (`ModalHeader`):**

| Property   | Standard   | Advanced   | Configurable today?                                               |
| ---------- | ---------- | ---------- | ----------------------------------------------------------------- |
| `paddingX` | `3` (24px) | `4` (32px) | **Yes** — via `ComponentConfigProvider` / `advancedComponents.ts` |
| `paddingY` | `2` (16px) | `3` (24px) | **Yes** — via `ComponentConfigProvider` / `advancedComponents.ts` |

**Body (`ModalBody`):** No differences — same as Standard.

**Footer (`ModalFooter`):**

| Property   | Standard   | Advanced   | Configurable today?                                               |
| ---------- | ---------- | ---------- | ----------------------------------------------------------------- |
| `paddingX` | `3` (24px) | `4` (32px) | **Yes** — via `ComponentConfigProvider` / `advancedComponents.ts` |
| `paddingY` | `2` (16px) | `4` (32px) | **Yes** — via `ComponentConfigProvider` / `advancedComponents.ts` |

Buttons in the footer use default `Button` styling — already handled by the global `Button` config.

Both `ModalHeader` and `ModalFooter` are registered in `ComponentTheme` (web and mobile) and wired up via `useComponentConfig`.

### Nudge Card

Dropped — outdated, replaced by newer card components.

### Radio Button (Priority)

Figma sources:

- Standard: [CDS Components](https://www.figma.com/design/k5CtyJccNQUGMI5bI4lJ2g/%E2%9C%A8-CDS-Components?node-id=155-9979&m=dev)
- Advanced: [Advanced Product Library](https://www.figma.com/design/5jlcPo8JjEehlGkva1e6y2/Advanced-Product-Library?node-id=5761-1542&m=dev)

#### Advanced theme differences (vs Standard)

| Property     | Standard      | Advanced              | Configurable today?                                                                        |
| ------------ | ------------- | --------------------- | ------------------------------------------------------------------------------------------ |
| Border color | `bgLineHeavy` | `bgLinePrimarySubtle` | **Yes** — `borderColor` prop, functional config with `props.checked`                       |
| Border width | `100` (1px)   | `200` (2px)           | **No** — hardcoded as `var(--borderWidth-100)` in CSS; Radio doesn't forward `borderWidth` |

Everything else (dot color, checked color, size, etc.) is the same between Standard and Advanced.

**Configured in `advancedComponents.ts`:** `borderColor` override for unchecked state (`bgLinePrimarySubtle`).

**PR needed:** Forward `borderWidth` to the inner `Box` in `Radio.tsx`, matching the pattern Checkbox already uses (Checkbox destructures `borderWidth` with a default of `100` and passes it to its inner Box on line 114). Specifically:

1. Add `borderWidth` to `RadioProps` type (like `CheckboxProps` line 52).
2. Destructure `borderWidth` from `mergedProps` with default `100`.
3. Pass `borderWidth={borderWidth}` to the inner `<Box>`.
4. Remove `border-width: var(--borderWidth-100)` from the `baseCss` CSS class (let the prop handle it).

Once that lands, update `advancedComponents.ts` to add `borderWidth: 200`.

### SearchInput (Priority)

Figma sources:

- Standard: [CDS Components](https://www.figma.com/design/k5CtyJccNQUGMI5bI4lJ2g/%E2%9C%A8-CDS-Components?node-id=67-767&m=dev)
- Advanced: [Advanced Product Library](https://www.figma.com/design/5jlcPo8JjEehlGkva1e6y2/Advanced-Product-Library?node-id=5429-7257&m=dev)

#### Advanced theme differences (vs Standard)

| Property         | Standard (default) | Standard (compact) | Advanced (default) | Advanced (compact) | Configurable today?                                                            |
| ---------------- | ------------------ | ------------------ | ------------------ | ------------------ | ------------------------------------------------------------------------------ |
| Border radius    | `1000` (pill)      | `1000` (pill)      | `200` (8px)        | `200` (8px)        | **No** — hardcoded as `borderRadius={1000}` in `SearchInput.tsx` line 159      |
| Icon-to-text gap | `0.5` (4px)        | `0.5` (4px)        | `2` (16px)         | `0.5` (4px)        | **No** — hardcoded in `nativeInputContainerCss` in `TextInput.tsx` line 54     |
| Height           | 56px               | 40px               | 32px               | 24px               | **No** — hardcoded via CSS `scales` constants in `SearchInput.tsx` lines 15–17 |

**PRs needed:**

1. **Add `borderRadius` to `SearchInputBaseProps`** and remove the hardcoded `1000` in `SearchInput.tsx`. Instead, read from the config/props with `1000` as the default. The prop spread order (`{...props}` after `borderRadius={1000}`) means a runtime override would work today, but the type doesn't expose it.
2. **Add a `gap` or `iconGap` prop to `SearchInput`** (or add `styles`/`classNames` support on `TextInput`) to control `padding-inline-start` between the start icon and input text. Currently hardcoded to `var(--space-0_5)` via `nativeInputContainerCss` `[data-start='true']`.
3. **Make height configurable** — either expose `height` in `SearchInputBaseProps` (InputStack already supports it under the hood), or allow overriding the `scales` values. The current hardcoded CSS classes (56px / 40px) would need to be replaced or overridable.

Once those changes land, `advancedComponents.ts` would be:

```ts
SearchInput: (props) => ({
  borderRadius: 200,
  height: props.compact ? 24 : 32,
  ...(props.compact ? {} : { iconGap: 2 }), // prop name TBD
}),
```

### Segmented Tab

Figma sources:

- Standard: [CDS Components](https://www.figma.com/design/k5CtyJccNQUGMI5bI4lJ2g/%E2%9C%A8-CDS-Components?node-id=20859-2979&m=dev)
- Advanced: [Advanced Product Library](https://www.figma.com/design/5jlcPo8JjEehlGkva1e6y2/Advanced-Product-Library?node-id=6238-121979&m=dev)

#### Advanced theme differences (vs Standard)

| Property                       | Standard      | Advanced      | Configurable today?                                                                |
| ------------------------------ | ------------- | ------------- | ---------------------------------------------------------------------------------- |
| Active label color             | `fgInverse`   | `fg`          | **Yes** — `activeColor` via `useComponentConfig('SegmentedTab', ...)`              |
| Inactive label color           | `fg`          | `fg` (same)   | N/A — already matches                                                              |
| Active indicator background    | `bgInverse`   | `bgSecondary` | **Yes** — `activeBackground` via `useComponentConfig('SegmentedTabs', ...)`        |
| Inactive tabs background       | `bgSecondary` | `bgAlternate` | **Yes** — `background` via `useComponentConfig('SegmentedTabs', ...)`              |
| Container border radius        | `1000` (pill) | `200` (8px)   | **Yes** — `borderRadius` via `useComponentConfig('SegmentedTabs', ...)`            |
| Active indicator border radius | `1000` (pill) | `200` (8px)   | **Yes** — `activeBorderRadius` forwarded from `SegmentedTabs` → `Tabs` → indicator |
| Individual tab border radius   | `1000` (pill) | `200` (8px)   | **Yes** — `borderRadius` prop overrides CSS via inline style                       |

**Configured in `advancedComponents.ts`:**

```ts
SegmentedTabs: {
  activeBackground: 'bgSecondary',
  background: 'bgAlternate',
  borderRadius: 200,
},
SegmentedTab: {
  activeColor: 'fg',
  borderRadius: 200,
},
```

**Cleanup PR needed:** The `buttonCss` class in web `SegmentedTab.tsx` still contains `border-radius: var(--borderRadius-1000)`. This is overridden by the inline style from the `borderRadius` prop, so it has no functional effect, but should be removed for clarity in a follow-up.

### SelectInput (Priority)

### Sticky Footer

### Switch (Priority)

Figma sources:

- Standard: [CDS Components](https://www.figma.com/design/k5CtyJccNQUGMI5bI4lJ2g/%E2%9C%A8-CDS-Components?node-id=155-9924&m=dev)
- Advanced: [Advanced Product Library](https://www.figma.com/design/5jlcPo8JjEehlGkva1e6y2/Advanced-Product-Library?node-id=5761-331375&m=dev)

#### Advanced theme differences (vs Standard)

| Property               | Standard (unchecked) | Standard (checked) | Advanced (unchecked) | Advanced (checked) | Configurable today?                              |
| ---------------------- | -------------------- | ------------------ | -------------------- | ------------------ | ------------------------------------------------ |
| Track (`background`)   | `bgTertiary`         | `bgPrimary`        | `bgTertiary`         | `bgSecondary`      | **Yes** — functional config with `props.checked` |
| Thumb (`controlColor`) | default (white)      | default (white)    | default (white)      | `fg` (dark)        | **Yes** — functional config with `props.checked` |

The Advanced switch flips the checked state: instead of a primary-colored track with a white thumb, it uses a neutral light track (`bgSecondary`) with a dark thumb (`fg`). The unchecked state is the same as Standard.

**Configured in `advancedComponents.ts`:** Functional config handles the checked/unchecked track and thumb color swap:

```ts
Switch: (props) => ({
  background: props.checked ? 'bgSecondary' : 'bgTertiary',
  ...(props.checked && { controlColor: 'fg' }),
}),
```

No CDS changes needed — all props are already supported.

### Table (Container)

`Table` is registered in `ComponentTheme` and wired up with `useComponentConfig('Table', _props)`.

| Property      | Standard    | Configurable today?                |
| ------------- | ----------- | ---------------------------------- |
| `variant`     | `'default'` | **Yes** — via `useComponentConfig` |
| `bordered`    | `false`     | **Yes** — via `useComponentConfig` |
| `compact`     | `false`     | **Yes** — via `useComponentConfig` |
| `cellSpacing` | (default)   | **Yes** — via `useComponentConfig` |
| `tableLayout` | `'auto'`    | **Yes** — via `useComponentConfig` |

#### Advanced theme differences (vs Standard)

The bottom border visible in CDS Standard tables comes from `Table`'s `variant` prop — `variant="ruled"` adds bottom borders between rows. Advanced tables have no row borders.

**Configured in `advancedComponents.ts`:** `Table: { variant: 'default' }` removes row borders. Note: if the vite-themed example explicitly passes `variant="ruled"`, that explicit prop will override the config — the example would need to omit the variant and let the config handle it.

### Table Cell

Figma sources:

- Standard: [CDS Components](https://www.figma.com/design/k5CtyJccNQUGMI5bI4lJ2g/%E2%9C%A8-CDS-Components?node-id=8298-12299&m=dev)
- Advanced: [Advanced Product Library](https://www.figma.com/design/5jlcPo8JjEehlGkva1e6y2/Advanced-Product-Library?node-id=5360-22149&m=dev)

`TableCell` is registered in `ComponentTheme` and wired up with `useComponentConfig('TableCell', _props)`.

| Property       | Standard       | Configurable today?                |
| -------------- | -------------- | ---------------------------------- |
| `direction`    | `'vertical'`   | **Yes** — via `useComponentConfig` |
| `innerSpacing` | (default)      | **Yes** — via `useComponentConfig` |
| `outerSpacing` | (default)      | **Yes** — via `useComponentConfig` |
| `color`        | `currentColor` | **Yes** — via `useComponentConfig` |
| `overflow`     | (none)         | **Yes** — via `useComponentConfig` |

#### Advanced theme differences (vs Standard)

| Property      | Standard                                | Advanced | Configurable today?                           |
| ------------- | --------------------------------------- | -------- | --------------------------------------------- |
| Bottom border | Present (via `Table` `variant="ruled"`) | None     | **Yes** — set `Table: { variant: 'default' }` |

No CDS changes needed — the border is controlled by the parent `Table` component's `variant` prop, which is already configurable.

### Table Header

Figma sources:

- Standard: [CDS Components](https://www.figma.com/design/k5CtyJccNQUGMI5bI4lJ2g/%E2%9C%A8-CDS-Components?node-id=8298-12088&m=dev)
- Advanced: [Advanced Product Library](https://www.figma.com/design/5jlcPo8JjEehlGkva1e6y2/Advanced-Product-Library?node-id=5360-24456&m=dev)

`TableHeader` is registered in `ComponentTheme` and wired up with `useComponentConfig('TableHeader', _props)`.

| Property | Standard | Configurable today?                |
| -------- | -------- | ---------------------------------- |
| `sticky` | `false`  | **Yes** — via `useComponentConfig` |

#### Advanced theme differences (vs Standard)

Structurally identical. Advanced shows header subtitles — this is already supported via `TableCell`'s `subtitle` prop (cells inside `<TableHeader>` are just `TableCell` components). No CDS changes needed.

### Table Row

`TableRow` is now registered in `ComponentTheme` and wired up with `useComponentConfig('TableRow', _props)`.

| Property                | Standard | Configurable today?                |
| ----------------------- | -------- | ---------------------------------- |
| `disableHoverIndicator` | `false`  | **Yes** — via `useComponentConfig` |
| `backgroundColor`       | (none)   | **Yes** — via `useComponentConfig` |
| `color`                 | (none)   | **Yes** — via `useComponentConfig` |

> **Note:** Table components are web-only — no mobile equivalents exist.

### Tabs

Figma sources:

- Standard: [CDS Components](https://www.figma.com/design/k5CtyJccNQUGMI5bI4lJ2g/%E2%9C%A8-CDS-Components?node-id=240-8930&m=dev)
- Advanced: [Advanced Product Library](https://www.figma.com/design/5jlcPo8JjEehlGkva1e6y2/Advanced-Product-Library?node-id=5432-16261&m=dev)

**Done:** Migrated vite-themed example from deprecated `TabNavigation` to `Tabs` with a custom `NavigationTab` component and underline-style `NavigationIndicator`.

#### Advanced theme differences (vs Standard)

| Property                   | Standard    | Advanced   | Configurable today?                                                                                  |
| -------------------------- | ----------- | ---------- | ---------------------------------------------------------------------------------------------------- |
| Gap between tabs           | `4` (32px)  | `4` (same) | N/A — already matches                                                                                |
| Label-to-indicator padding | `2` (16px)  | `3` (24px) | **No** — set on the custom `NavigationTab` component in the example; not reachable via `Tabs` config |
| Inactive tab color         | `fg`        | `fgMuted`  | **No** — set on the custom `NavigationTab` component; not reachable via `Tabs` config                |
| Active tab color           | `fgPrimary` | `fg`       | **No** — same; set on `NavigationTab`                                                                |

#### Analysis

`Tabs` (the base component) uses `useComponentConfig('Tabs', _props)` and controls layout-level props (gap, width, position, activeBackground, etc.). However, individual **tab styling** (color, padding, font) is the responsibility of the `TabComponent` — in this case `NavigationTab`, a custom component defined in the example.

Since `NavigationTab` is not registered in `ComponentTheme`, its props (colors, padding) cannot be overridden via `advancedComponents.ts`. The current implementation uses Standard defaults (`fgPrimary` active, `fg` inactive, `paddingY: 2`).

**Separate PR needed:** To make tab-level styling configurable for Advanced, either:

1. **Create and register a `NavigationTab` component** in CDS (similar to `SegmentedTab`) with `useComponentConfig`, exposing `activeColor`, `color`, and `paddingY` as configurable props.
2. **Or add tab-level styling props to `TabsBaseProps`** (e.g. `tabActiveColor`, `tabColor`, `tabPaddingY`) that `Tabs` forwards to the `TabComponent`.

Once available, `advancedComponents.ts` would include:

```ts
NavigationTab: {
  activeColor: 'fg',
  color: 'fgMuted',
  paddingY: 3,
},
```

### Tag

Figma sources:

- Standard: [CDS Components](https://www.figma.com/design/k5CtyJccNQUGMI5bI4lJ2g/%E2%9C%A8-CDS-Components?node-id=68-996&m=dev)
- Advanced: [Advanced Product Library](https://www.figma.com/design/5jlcPo8JjEehlGkva1e6y2/Advanced-Product-Library?node-id=5873-70819&m=dev)

#### Advanced theme differences (vs Standard)

| Property   | Standard                                  | Advanced | Configurable today?                                                                                  |
| ---------- | ----------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `paddingX` | `0.5` (informational) / `1` (promotional) | `0.5`    | **No** — hardcoded via `tagHorizontalSpacing[intent]` in `Tag.tsx`; `paddingX` not in `TagBaseProps` |

Other differences (emphasis, intent, colorScheme) are consumer-controlled via props — not styling changes.

#### Analysis

`Tag` is registered in `ComponentTheme` and uses `useComponentConfig('Tag', _props)`. The spread order in the render (`{...props}` after `paddingX={...}`) means a config value **would override at runtime**, but `paddingX` is not in `TagBaseProps` so TypeScript blocks it from the config.

**Separate PR needed:** Add `paddingX` to `TagBaseProps` (or widen the config resolver type). This is a minimal change — the runtime override already works via spread order. Once done:

```ts
Tag: {
  paddingX: 0.5,
},
```

### TextInput (Priority)

### Toast

Figma sources:

- Standard: [CDS Components](https://www.figma.com/design/k5CtyJccNQUGMI5bI4lJ2g/%E2%9C%A8-CDS-Components?node-id=8500-674&m=dev)
- Advanced: [Advanced Product Library](https://www.figma.com/design/5jlcPo8JjEehlGkva1e6y2/Advanced-Product-Library?node-id=6041-15071&m=dev)

No Advanced theme differences. No CDS changes needed.

### Tooltip

Figma sources:

- Standard: [CDS Components](https://www.figma.com/design/k5CtyJccNQUGMI5bI4lJ2g/%E2%9C%A8-CDS-Components?node-id=715-14162&m=dev)
- Advanced: [Advanced Product Library](https://www.figma.com/design/5jlcPo8JjEehlGkva1e6y2/Advanced-Product-Library?node-id=10955-80971&m=dev)

#### Advanced theme differences (vs Standard)

| Property           | Standard    | Advanced      | Configurable today?                          |
| ------------------ | ----------- | ------------- | -------------------------------------------- |
| Color scheme       | Inverted    | Not inverted  | **Yes** — `invertColorScheme` prop           |
| Content background | `bgInverse` | `bgSecondary` | **Yes** — `TooltipContent` `background` prop |

**Already configured in `advancedComponents.ts`:**

```ts
Tooltip: {
  invertColorScheme: false,
},
TooltipContent: {
  background: 'bgSecondary',
},
```

No CDS changes needed.

### Upsell Card

Dropped — outdated, replaced by newer card components.

---

## Summary

- **Total components:** 26
- **In app:** 25 (Sticky Footer is mobile-only, not applicable)
- **Priority items:** 14
- **Priority items in app:** 14/14
