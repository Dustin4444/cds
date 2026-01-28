# Component Stories

Create or update Storybook stories for a CDS component.

**Usage:** `/component-stories <ComponentName> [task description]`

Examples:

- `/component-stories Button`
- `/component-stories LineChart update formatting to match current setup`
- `/component-stories Avatar add dark mode examples`

## Story Locations

- **Web:** `packages/web/src/**/__stories__/[ComponentName].stories.tsx`
- **Web Visualization:** `packages/web-visualization/src/**/__stories__/[ComponentName].stories.tsx`
- **Mobile:** `packages/mobile/src/**/__stories__/[ComponentName].stories.tsx`
- **Mobile Visualization:** `packages/mobile-visualization/src/**/__stories__/[ComponentName].stories.tsx`

## Web Story Format

```tsx
import { Example, ExampleScreen } from '@coinbase/cds-web/__stories__/storybook';
// ... other imports

export default {
  component: ComponentName,
  title: 'Components/[Category]/[ComponentName]',
};

export const All = () => {
  return (
    <ExampleScreen>
      <Example title="Basic">
        <ComponentName />
      </Example>
      <Example title="With Props">
        <ComponentName someProp="value" />
      </Example>
    </ExampleScreen>
  );
};
```

### Multiple Exports (Web Only)

Use additional exports for stories that should be excluded from visual regression (e.g., random/animated data):

```tsx
// Primary story
export const All = () => {
  /* ... */
};

// Excluded from Percy - add to .percy.js excludeStories
export const Transitions = () => {
  /* ... */
};
```

## Mobile Story Format

```tsx
import { Example, ExampleScreen } from '../../examples';
// ... other imports

const ComponentNameScreen = () => {
  return (
    <ExampleScreen>
      <Example title="Basic">
        <ComponentName />
      </Example>
    </ExampleScreen>
  );
};

export default ComponentNameScreen;
```

## Workflow

1. **Find component source** to understand available props
2. **Check for existing stories** - preserve all existing examples, add new ones at the bottom
3. **Check doc site examples** (`apps/docs/docs/components/**/_webExamples.mdx`) - include these in stories
4. **Create/update stories** using the format above
5. **Update webMetadata.json** (web only) with storybook link:

   ```json
   "storybook": "https://cds-storybook.coinbase.com/?path=/story/components-[category]-[componentname]--all"
   ```

   - All lowercase, hyphens between words in title
   - Story name in URL: `--all`, `--transitions`, etc.

6. **Update .percy.js** if adding stories with random/animated data that should be excluded
7. **Run checks:**
   ```bash
   yarn nx format:write && yarn nx run <project>:typecheck && yarn nx run <project>:lint --fix
   ```
   Projects: `web`, `mobile`, `web-visualization`, `mobile-visualization`

## Storybook Link Format

The link is derived from the `title` and export name:

- `title: 'Components/Chart/LineChart'` + `export const All` → `components-chart-linechart--all`
- `title: 'Components/Buttons/Button'` + `export const All` → `components-buttons-button--all`

## Notes

- Always use `<ExampleScreen>` and `<Example title="...">` wrappers
- Extract complex examples into named functions above the story
- Use `memo` for components defined inside the story file
- Use `useCallback`/`useMemo` for handlers and computed values
- Keep examples focused on visual states for regression testing
- New examples go at the bottom to avoid breaking existing Percy baselines
