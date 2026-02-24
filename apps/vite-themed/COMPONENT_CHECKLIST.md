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

### Alert

Figma sources:
- Standard: [CDS Components](https://www.figma.com/design/k5CtyJccNQUGMI5bI4lJ2g/%E2%9C%A8-CDS-Components?node-id=35-698&m=dev)
- Advanced: [Advanced Product Library](https://www.figma.com/design/5jlcPo8JjEehlGkva1e6y2/Advanced-Product-Library?node-id=5991-53452&m=dev)

#### Content area (pictogram + title + body)

| Property | Standard | Advanced | Web | Mobile |
|---|---|---|---|---|
| `paddingTop` | `3` (24px) | `3` (24px) | `3` (24px) | `3` (24px) |
| `paddingX` | `3` (24px) | `3` (24px) | `3` (24px) | `3` (24px) |
| `paddingBottom` | `1` (8px) | **`2` (16px)** | `1` (8px) | `1` (8px) |

#### Actions area (buttons)

| Property | Standard | Advanced | Web | Mobile |
|---|---|---|---|---|
| `paddingTop` | `2` (16px) | `2` (16px) | **`3` (24px)** | `2` (16px) |
| `paddingBottom` | `3` (24px) | `3` (24px) | `3` (24px) | **`2` (16px)** |
| `paddingX` | `3` (24px) | `3` (24px) | **`2` (16px)** | `3` (24px) |
| Button gap | 8px | 8px | **`gap={2}` (16px)** | **`gap={2}` (16px)** |

#### Bugs (shared across themes)

**Web (`packages/web/src/overlays/Alert.tsx`):**
- Line 193: `gap={2}` → `gap={1}`
- Line 194: `paddingX={2}` → `paddingX={3}`
- Line 195: `paddingY={3}` → split to `paddingTop={2}` + `paddingBottom={3}`

**Mobile (`packages/mobile/src/overlays/Alert.tsx`):**
- Line 194: `gap={2}` → `gap={1}`
- Line 196: `paddingY={2}` → split to `paddingTop={2}` + `paddingBottom={3}`

#### Advanced theme differences (vs Standard)

The Advanced Alert is structurally identical to Standard except for one value:

| Property | Standard | Advanced |
|---|---|---|
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

### Checkbox (Priority)

### Chips (Priority)

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
