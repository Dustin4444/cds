# Advanced Theme Component Audit

This document tracks the analysis of each CDS component against the Advanced Product Library Figma file (`5jlcPo8JjEehlGkva1e6y2`), identifying which component-level prop overrides are needed in `advancedComponents.ts`.

> **Important distinction**: The advanced theme in `advanced.ts` already defines significantly different **design tokens** that apply globally. The `advancedComponents.ts` config is only needed when a component should use a **different token index or prop value** than its CDS default.

## Token-Level Changes (handled by `advanced.ts`)

These token changes apply globally and affect ALL components automatically:

| Token                      | CDS Default | Advanced Theme | Impact                    |
| -------------------------- | ----------- | -------------- | ------------------------- |
| `iconSize.xs`              | 12          | 8              | All xs icons smaller      |
| `iconSize.s`               | 16          | 12             | All s icons smaller       |
| `iconSize.m`               | 24          | 16             | All m icons smaller       |
| `iconSize.l`               | 32          | 20             | All l icons smaller       |
| `controlSize.checkboxSize` | 20          | 16             | Checkboxes smaller        |
| `controlSize.radioSize`    | 20          | 16             | Radios smaller            |
| `borderRadius.200`         | 8px         | 6px            | All "200" borders tighter |
| `borderRadius.700`         | 32px        | 32px           | Unchanged                 |
| `borderRadius.900`         | 999px       | 48px           | "900" radius much smaller |
| `borderRadius.1000`        | 999px       | 999px          | Full circle unchanged     |
| `space.1`                  | 8           | 4              | All spacing tighter       |
| `avatarSize.*`             | larger      | smaller        | All avatars smaller       |

---

## Component-Level Prop Overrides (in `advancedComponents.ts`)

### Button (Figma: 5002:15828)

- **borderRadius**: `200` (CDS default: `compact ? 700 : 900`) -- Advanced uses squared buttons instead of pill-shaped

### IconButton (Figma: 5820:3340)

- **borderRadius**: `200` (CDS default: `1000`) -- Advanced uses squared icon buttons instead of circular

### TextInput (Figma: 5072:16524)

- **labelVariant**: `'inside'` (CDS default: `'outside'`) -- Advanced uses floating inside labels. Confirmed across all Figma sizes: L (64px), M (52px), S (38px) all show label inside the input field.

### Switch (Figma: 5072:17360)

- **background**: `'bgTertiary'` -- Advanced uses tertiary background for unchecked state

### Tooltip (Figma: 5857:10576)

- **invertColorScheme**: `false` (CDS default: `true`) -- Advanced tooltips do NOT invert the color scheme. Confirmed by Figma development annotation: _"Pass `invertColorScheme={false}` to change bg color."_ Tooltip variables show it uses `bgSecondary` background matching the page's color scheme.

---

## Components with Hardcoded Values (need code changes to override)

These components have visual differences in the Figma but their styling is **hardcoded** in the component source, not configurable via `ComponentTheme`:

### Toast (Figma: 5857:10530)

- `borderRadius={200}` hardcoded on inner HStack (line 144 of Toast.tsx)
- `background="bgAlternate"` hardcoded on inner HStack
- Figma toast variables show `border radius/700: 32`, suggesting the toast may want more rounding than 6px
- **Action needed**: Make `borderRadius` a destructured prop to enable theme override

### SearchInput (Figma: 5072:15859)

- `borderRadius={1000}` hardcoded when rendering TextInput (line 165 of SearchInput.tsx)
- Cannot override via theme config
- Figma shows pill shape which matches `1000`, so likely no change needed

### Modal (Figma: 5072:18745)

- `borderRadius={200}` hardcoded on inner VStack (line 228 of Modal.tsx)
- With advanced tokens, this gives 6px corners which appears to match Figma

### Coachmark (Figma: 5857:10438)

- `borderRadius={400}` hardcoded on inner VStack (line 86 of Coachmark.tsx)
- With advanced tokens, this gives 12px corners

### NudgeCard (Figma: 5857:9698)

- `borderRadius={500}` hardcoded on inner Box
- With advanced tokens, this gives 16px corners

### Radio (Figma: 5761:1527)

- `border-radius: var(--borderRadius-1000)` hardcoded in CSS (stays circular)
- `border-width: var(--borderWidth-100)` hardcoded in CSS
- `borderColor` prop has conditional default: `checked ? controlColor : 'bgLineHeavy'`
- Figma variables show `bgLinePrimarySubtle` (#32353d) used in the radio node, which differs from `bgLineHeavy` (#8a919ea8). However, setting `borderColor` at theme level would override BOTH checked and unchecked states (breaking checked styling).
- **Action needed**: To change only the unchecked border color, the Radio component would need a dedicated `uncheckedBorderColor` prop or the `bgLineHeavy` palette value would need adjustment.

---

## Components Analyzed -- No Component-Level Overrides Needed

### Checkbox (Figma: 5072:16968)

- `borderRadius` defaults to `undefined` (square corners). Advanced Figma shows square checkboxes. Match.
- Size handled by `controlSize.checkboxSize` token (16px).
- Border color uses `bgLineHeavy` when unchecked, `bgPrimary` when checked. Same conditional as Radio.

### SearchInput (Figma: 5072:15859)

- Pill shape (borderRadius 1000) matches Figma. No override needed (also can't override since hardcoded).

### Tabs (Figma: 5072:35260)

- Standard underline active indicator. No prop differences.

### SegmentedTabs (Figma: 5147:258436)

- CDS default `borderRadius: 1000`, `background: 'bgSecondary'`, `activeBackground: 'bgInverse'`.
- Does NOT use `mergeComponentProps` -- cannot override via theme config.

### Tag (Figma: 5072:17122)

- Standard tag appearance. Token-level changes sufficient.

### Dropdown (Figma: 5072:17529)

- Standard dropdown appearance. Token-level changes sufficient.

### Alert (Figma: 5857:10102)

- Standard alert dialogs. Buttons inside inherit Button config.

### ListCell (Figma: 5072:35429)

- Standard cell layout. No prop differences identified.

### DotCount (Figma: 5065:210)

- Standard dot count appearance. No override needed.

### UpsellCard (Figma: 5857:9726)

- Similar to NudgeCard structure. No prop-level overrides available.

### TableCell (Figma: 5360:22149)

- Standard table cell layout. No override needed.

### TableHeader (Figma: 5360:24456)

- Standard table header. No override needed.

---

## Figma Variable Reference

Key variables extracted from the Advanced Product Library Figma:

**From Radio node (5761:1547):**

```
border width/200: 2
sizing/control/control-checkboxSize: 16
palette/background/background: #0a0b0d
palette/background/linePrimarySubtle: #32353d
palette/foreground/foregroundMuted: #8a919e
font/size/body: 12
font/line-height/body: 16
spacing/padding/1: 4
```

**From TextInput node (5820:30879):**

```
border radius/200: 6
border width/0: 0
sizing/icon/s: 12
sizing/icon/xs: 8
spacing/padding/½: 2
spacing/padding/1: 4
spacing/padding/2: 8
palette/background/alternate: #141519
palette/background/lineHeavy: #8a919ea8
```

**From Toast node (6041:15070):**

```
border radius/200: 6
border radius/700: 32
border radius/900: 48
spacing/padding/1: 4
spacing/padding/2: 8
spacing/padding/3: 12
spacing/padding/4: 16
sizing/icon/m: 16
border width/100: 1
palette/background/alternate: #141519
```

**From Tooltip node (10955:80971):**

```
border radius/200: 6
spacing/padding/1: 4
palette/background/secondary: #282b31
palette/foreground/foreground: #ffffff
```
