# React 18 Compatibility Test App

This app is used to validate that `@coinbase/cds-web` remains compatible with React 18 consumers after the CDS v9 upgrade.

## Purpose

When CDS v9 ships, `cds-mobile` will use React 19 (required by React Native 0.81), but `cds-web` needs to remain compatible with customers still on React 18. This app serves as a validation tool to ensure:

1. **TypeScript Compatibility**: The app compiles successfully with `@types/react@18`
2. **Runtime Compatibility**: CDS components work correctly with React 18 runtime
3. **API Compatibility**: Refs, contexts, and other React features work as expected

## How It Works

This app is **excluded from yarn constraints** that enforce consistent dependency versions across the monorepo. This allows it to:

- Stay on React 18 while other packages may upgrade to React 19
- Use `@types/react@18` while `cds-mobile` uses `@types/react@19`

## Usage

```bash
# Run the dev server
yarn nx run react18-compat-test:dev

# Type check (validates React 18 type compatibility)
yarn nx run react18-compat-test:typecheck

# Build (validates full compilation)
yarn nx run react18-compat-test:build
```

## CI Integration

This app should be included in CI to catch any accidental React 19-only constructs in `cds-web`:

```yaml
validate-react18-compat:
  steps:
    - run: yarn nx run react18-compat-test:typecheck
    - run: yarn nx run react18-compat-test:build
```

If typecheck or build fails, it indicates that `cds-web` has introduced something incompatible with React 18.

## What This Tests

The app imports and exercises:

- **Buttons**: `Button`, `ButtonGroup` with refs and event handlers
- **Form Controls**: `TextInput` with controlled state
- **Layout**: `Box`, `VStack`, `HStack` with style props
- **Typography**: `TextTitle`, `TextHeadline`, `TextBody`
- **Overlays**: `Modal` with portal rendering and focus trapping
- **Navigation**: `Tabs`, `TabNavigation`, `Tab`, `TabContent`
- **Data Display**: `Cell`, `CellGroup`, `Tag`, `Accordion`
- **Feedback**: `Spinner` loading states
- **Icons**: `Icon` component

## Maintenance

When adding new components to `cds-web`, consider adding them to this test app to ensure React 18 compatibility is validated.
