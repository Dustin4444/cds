# Component Changes for Theme-Level Props

This document tracks modifications made to CDS web components to support theme-level prop customization.

---

## Button (`packages/web/src/buttons/Button.tsx`)

### Changes

- **Theme-level props**: Added `mergeComponentProps` pattern — Button now reads defaults from `components.Button` in the `ThemeProvider`.
- **Intrinsic height**: Removed hardcoded `height` default (was `compact ? 40 : 56`). Button height is now driven by `paddingY` + content, making it intrinsic by default.
- **`justifyContent` prop**: New prop, defaults to `'space-between'`.
  - `'space-between'` (default): Start/end icons sit at the edges, text centered. This is the new default behavior.
  - `'center'`: Start icon, text, and end icon cluster together in the center.
  - Removed the old `iconCss` class that conditionally set `justify-content: space-between` only when icons were present.
- **Start/end node layout**: Removed `flex-grow: 1` from `startNodeCss` and `endNodeCss` so they no longer push to edges on their own — positioning is now fully controlled by `justifyContent`.
- **`justify-content: center` removed from `baseCss`**: No longer hardcoded in CSS; driven by the `justifyContent` prop instead.

### Breaking Behavior

- **Height in flex containers**: Since Button no longer has a fixed height, it may stretch to match siblings in an `HStack` or other flex container. Consumers who relied on the implicit 56px/40px height should set `height` explicitly or via `components.Button.height` in the theme.
- **`justifyContent` default changed**: Buttons with start/end icons will now have `space-between` layout by default (previously only applied when icons were present via `iconCss`). Buttons without icons are unaffected since there's nothing to space out.

---

## IconButton (`packages/web/src/buttons/IconButton.tsx`)

### Changes

- **Theme-level props**: Already had `mergeComponentProps` pattern.
- **Intrinsic sizing**: Removed hardcoded `height` and `width` defaults (were `compact ? 40 : 56`). IconButton size is now driven by padding + icon content.

### Breaking Behavior

- **Size in flex containers**: Like Button, IconButton may now stretch in flex containers. Consumers who relied on the implicit 56px/40px square should set `height`/`width` explicitly or via `components.IconButton` in the theme.

---

## Vite Config (`apps/vite-themed/vite.config.ts`)

### Changes

- **Source resolution**: Added `resolve.alias` entries to map `@coinbase/cds-*` package imports directly to `packages/*/src/` source files. This enables hot reload when editing component source — no rebuild needed.

---

## All Other Components

The following components had the `mergeComponentProps` pattern added (theme-level prop support) with **no other behavioral changes**:

- TextInput, InputIconButton, SearchInput, Checkbox, Radio, Switch
- Chip (base — InputChip, SelectChip, MediaChip inherit)
- Select (alpha only)
- Dropdown
- Modal, Alert, Toast, Tooltip
- ListCell, DotCount
- Tag, Tabs (SegmentedTabs inherits)
- DatePicker
- NudgeCard, UpsellCard
- TableCell, TableHeader
- Coachmark

These components now accept default props via `ThemeProvider`'s `components` config but are otherwise unchanged.
