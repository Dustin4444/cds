# Component Theme Config

Add theme-level component prop configuration (ComponentConfig) to a CDS component so its props can be overridden per-theme via `ComponentConfigProvider`.

**Usage:** `/component-theme-config <ComponentName> [additional context]`

Examples:

- `/component-theme-config SelectChip`
- `/component-theme-config Checkbox wire up useComponentConfig and register in ComponentTheme`
- `/component-theme-config Alert add styles/classNames support for theme overrides`

If no component name is provided, ask the user which component they want to configure.

## General Principles

- **Prefer `styles`/`classNames`** over new tokens or one-off props. This limits CDS changes and gives themes maximum flexibility.
- **No new tokens will be added** — use `styles`/`classNames` escape hatches when token values don't exist (e.g., `borderRadius: 2px`).
- **Register on both platforms** — add the component to `ComponentTheme` on both web and mobile (skip types that don't exist on mobile).
- **Alpha components only** — if a component has an alpha version (e.g., `alpha/select`), apply the pattern only to the alpha, not the legacy one.

## Step 1: Register the Component in ComponentTheme

### Web — `packages/web/src/core/theme.ts`

Import the component's `*BaseProps` type and add an entry to `ComponentTheme`:

```ts
import type { MyComponentBaseProps } from '../path/MyComponent';

export type ComponentTheme = {
  // ... existing entries
  MyComponent: ConfigResolver<MyComponentBaseProps>;
};
```

### Mobile — `packages/mobile/src/core/theme.ts`

Do the same for mobile. Skip types that don't exist on mobile (e.g., `NativeTextArea`, `Dropdown`, `TableCell`, `TableHeader`, `NavLink`, `TooltipContent`).

```ts
import type { MyComponentBaseProps } from '../path/MyComponent';

export type ComponentTheme = {
  // ... existing entries
  MyComponent: ConfigResolver<MyComponentBaseProps>;
};
```

`ConfigResolver<P>` accepts either `Partial<P>` (static) or `(props: P) => Partial<P>` (functional).

## Step 2: Wire Up useComponentConfig in the Component

In the component file, import `useComponentConfig`, then merge config defaults with local props **before** any destructuring.

### Web

```ts
import { useComponentConfig } from '../hooks/useComponentConfig';

export const MyComponent = memo(
  forwardRef((_props: MyComponentProps, ref) => {
    const mergedProps = useComponentConfig('MyComponent', _props);
    const {
      variant = 'primary',
      compact,
      borderRadius,
      // ... destructure from mergedProps, NOT _props
      ...rest
    } = mergedProps;
    // render using destructured values
  }),
);
```

### Mobile

```ts
import { useComponentConfig } from '../hooks/useComponentConfig';

// Same pattern — identical API on both platforms
const mergedProps = useComponentConfig('MyComponent', _props);
```

### Key Rules

- **Source wins**: Local props (passed directly to the component) always override config defaults. The merge is `{ ...configDefaults, ...localProps }`.
- **Destructure from `mergedProps`**: All prop destructuring with defaults must happen on `mergedProps`, not `_props`.
- **Use `_props` naming**: Prefix the raw props parameter with `_` to signal it should not be used directly after merging.
- **One line**: The entire merge is a single `useComponentConfig()` call — no manual `mergeComponentProps` needed.

## Step 3: Verify Props Are Actually Forwarded (Critical)

> **This is the most common source of bugs.** A prop can exist in `BaseProps`, be registered in `ComponentTheme`, and still have zero effect if it never reaches the rendered element.

Check these in order:

### 3.1 Props exist in the type

Are all the props you want to configure actually part of `MyComponentBaseProps`? If `borderRadius` or `background` isn't in the type, it won't be accepted by the config.

### 3.2 Props are destructured from mergedProps

Are they pulled from `mergedProps`? If they're not destructured, they may fall into `...rest` and get swallowed or passed to a parent component that ignores them.

### 3.3 Props reach the rendered element

In compound components (e.g., `SelectChip` → wrapper → `SelectChipControl` → `MediaChip`), props must be forwarded through **every layer**. Just being in the type is not enough.

### 3.4 Hardcoded values prevent override

Check if the prop is hardcoded in the JSX. Hardcoded values must be replaced with destructured defaults:

Before (hardcoded, config has no effect):

```tsx
<Box background="bgSecondary" padding={3}>
```

After (configurable via component config):

```tsx
const { background = 'bgSecondary', padding = 3 } = mergedProps;
// ...
<Box background={background} padding={padding}>
```

## Step 4: Test in vite-themed App

Add or update the config in `apps/vite-themed/src/themes/advancedComponents.ts`:

```ts
// Static config
MyComponent: {
  borderRadius: 200,
  background: 'bgAlternate',
},

// Functional config (dynamic based on props)
MyComponent: (props) => ({
  background: props.checked ? 'bgSecondary' : 'bg',
  controlColor: props.checked ? 'fg' : 'fgMuted',
}),
```

## Step 5: Document in Component Checklist

Update `apps/vite-themed/COMPONENT_CHECKLIST.md` under the component's heading:

1. Add a table of Advanced theme differences vs Standard
2. Note which props are configurable today vs which need a PR
3. For PRs needed, specify: `styles`/`classNames` support preferred over new props/tokens

## Reference Implementation

See `packages/web/src/buttons/Button.tsx` for a well-wired example:

```ts
export const Button = memo(
  forwardRef((_props: ButtonProps<AsComponent>, ref?: Polymorphic.Ref<AsComponent>) => {
    const mergedProps = useComponentConfig('Button', _props);
    const {
      variant = 'primary',
      compact,
      height = compact ? 40 : 56,
      borderRadius = compact ? 700 : 900,
      paddingX = padding ?? (compact ? 2 : 4),
      // ...
    } = mergedProps;
  }),
);
```

## Consumer Usage Examples

```tsx
import { ComponentConfigProvider } from '@coinbase/cds-web/system';

// Static config
<ComponentConfigProvider value={{ Button: { variant: 'secondary' } }}>
  <App />
</ComponentConfigProvider>

// Functional config (conditional on props)
<ComponentConfigProvider value={{
  Checkbox: (props) => ({
    controlColor: 'fg',
    background: props.checked ? 'bgSecondary' : 'bg',
    borderColor: props.checked ? 'bgSecondary' : 'bgLineHeavy',
  }),
}}>
  <App />
</ComponentConfigProvider>

// With className/style merging enabled
<ComponentConfigProvider mergeClassNameAndStyle value={config}>
  <App />
</ComponentConfigProvider>
```

## Utility Reference

### Web

- `useComponentConfig` — `packages/web/src/hooks/useComponentConfig.ts`
- `mergeComponentProps` — `packages/web/src/utils/mergeComponentProps.ts` (internal)
- `ComponentConfigProvider` — `packages/web/src/system/ComponentConfigProvider.tsx`
- `ComponentTheme` / `ComponentsConfig` / `ConfigResolver` — `packages/web/src/core/theme.ts`

### Mobile

- `useComponentConfig` — `packages/mobile/src/hooks/useComponentConfig.ts`
- `ComponentConfigProvider` — `packages/mobile/src/system/ComponentConfigProvider.tsx`
- `ComponentTheme` / `ComponentsConfig` / `ConfigResolver` — `packages/mobile/src/core/theme.ts`
