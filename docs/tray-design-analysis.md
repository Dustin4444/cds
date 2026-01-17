# Tray Component Design Analysis: Web vs Mobile

This document outlines the design discrepancies between the Web and Mobile `Tray` components, implementation notes for the HandleBar feature, and recommendations for achieving design parity while maintaining backward compatibility.

---

## Table of Contents

1. [Overview](#overview)
2. [Design Discrepancies](#design-discrepancies)
3. [HandleBar Implementation](#handlebar-implementation)
4. [Image/Header Swap Variant](#imageheader-swap-variant)
5. [Relevant Props Comparison](#relevant-props-comparison)
6. [Recommendations](#recommendations)

---

## Overview

The `Tray` component exists on both platforms with different implementations:

| Aspect                   | Web                                       | Mobile                                       |
| ------------------------ | ----------------------------------------- | -------------------------------------------- |
| **File**                 | `packages/web/src/overlays/tray/Tray.tsx` | `packages/mobile/src/overlays/tray/Tray.tsx` |
| **Animation**            | `framer-motion`                           | React Native `Animated` API                  |
| **Close Mechanism**      | `IconButton` (X icon)                     | `HandleBar` + swipe gestures                 |
| **HandleBar**            | ❌ Not implemented                        | ✅ Fully implemented                         |
| **Underlying Component** | Self-contained                            | Wraps `Drawer` component                     |

---

## Design Discrepancies

### 1. Close Mechanism

**Web (Current)**

- Uses an `IconButton` with an "X" close icon
- Located in the header section (top-right)
- Always visible when `preventDismiss` is `false` and `hideHeader` is `false`

**Mobile (Current)**

- Uses a `HandleBar` at the top of the tray
- Supports swipe-to-dismiss gestures via `PanResponder`
- HandleBar can be positioned inside or outside the drawer

### 2. HandleBar Variants (Mobile Only)

Mobile supports two `handleBarVariant` options:

| Variant               | Description                                                                              | Visual                   |
| --------------------- | ---------------------------------------------------------------------------------------- | ------------------------ |
| `'outside'` (default) | HandleBar floats above the drawer, full width (64px), `bgSecondary` color                | Standard CDS drawer look |
| `'inside'`            | HandleBar rendered inside the drawer, smaller width (32px), semi-transparent `bgInverse` | Modern/sleek appearance  |

**Code Reference:**

```typescript
// packages/mobile/src/overlays/drawer/Drawer.tsx
const showHandleBar = !hideHandleBar && pin === 'bottom';
const showHandleBarOutside = showHandleBar && handleBarVariant === 'outside';
const showHandleBarInside = showHandleBar && handleBarVariant === 'inside';
```

### 3. Header Structure

**Web:**

- Uses `HStack` with title on left, close button on right
- Header has `position: sticky` and `top: 0` for scroll behavior
- Background: `bgElevation2`

**Mobile:**

- Uses `VStack` with `Box` for title container
- Title padding: `paddingTop={3}`, `paddingBottom={2}`, `paddingX={3}`
- No close button in header area (relies on HandleBar)

### 4. Type Differences for `verticalDrawerPercentageOfView`

| Platform | Type     | Default | Example |
| -------- | -------- | ------- | ------- |
| Web      | `string` | `'85%'` | `"50%"` |
| Mobile   | `number` | `0.75`  | `0.5`   |

This is a breaking inconsistency that should be noted for consumers.

---

## HandleBar Implementation

### Current State

- **Web:** HandleBar is not implemented (comment in code: `// Web never had handle implemented, is this fine?`)
- **Mobile:** Fully functional with both 'inside' and 'outside' variants

### Proposal: Add HandleBar to Web

To support the "inside" handlebar variant on web while maintaining backward compatibility:

#### New Props to Add to Web `Tray`:

```typescript
// Proposed addition to TrayBaseProps (web)
{
  /**
   * Whether to show a handlebar for visual affordance
   * @default false (maintains backward compatibility)
   */
  showHandleBar?: boolean;

  /**
   * The HandleBar variant - only applicable when showHandleBar is true
   * - 'inside': HandleBar rendered inside the drawer, smaller and semi-transparent
   * - 'outside': HandleBar floats above the drawer (future support)
   * @default 'inside'
   */
  handleBarVariant?: 'inside' | 'outside';

  /**
   * Accessibility label for the handlebar
   * @default 'Dismiss'
   */
  handleBarAccessibilityLabel?: string;
}
```

#### Web HandleBar Component (New):

Create `packages/web/src/overlays/handlebar/HandleBar.tsx`:

```tsx
import { memo, useMemo } from 'react';
import type { ThemeVars } from '@coinbase/cds-common/core/theme';
import { handleBarHeight } from '@coinbase/cds-common/tokens/drawer';
import { useTheme } from '../../hooks/useTheme';
import { Box } from '../../layout/Box';

export type HandleBarProps = {
  variant?: 'inside' | 'outside';
  onClick?: () => void;
  accessibilityLabel?: string;
  className?: string;
  style?: React.CSSProperties;
};

export const HandleBar = memo(function HandleBar({
  variant = 'inside',
  onClick,
  accessibilityLabel = 'Dismiss',
  className,
  style,
}: HandleBarProps) {
  const theme = useTheme();

  const handleBarStyle = useMemo(
    () => ({
      width: variant === 'inside' ? 32 : 64,
      height: handleBarHeight,
      backgroundColor: variant === 'inside' ? theme.color.bgInverse : theme.color.bgSecondary,
      borderRadius: 4,
      opacity: variant === 'inside' ? 0.4 : 1,
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }),
    [variant, theme, onClick, style],
  );

  return (
    <Box
      alignItems="center"
      aria-label={accessibilityLabel}
      className={className}
      onClick={onClick}
      paddingY={2}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <Box style={handleBarStyle} />
    </Box>
  );
});
```

---

## Image/Header Swap Variant

Based on the design comparison between web and mobile (including mobile-specific examples):

### Observed Design Patterns

#### Mobile Tray with Hero Image

From the mobile examples provided:

- **Hero Image Area:** Full-width image/illustration at the top of the tray
- **Content Layout:** Title text appears below the hero image
- **HandleBar Placement:** HandleBar still appears at the very top (above or below the hero image depending on variant)
- **Use Cases:** Onboarding flows, promotional content, feature explanations, crypto selection screens

**Key Observations from Mobile Examples:**

1. Hero images span the full width of the tray container
2. Images have rounded corners matching the tray's border radius
3. No close button visible (relies on handlebar/swipe gestures)
4. Content flows naturally below the hero image
5. Images appear decorative/illustrative (not actionable)

#### Web Tray (Standard)

- Uses traditional header with title + close button
- No native support for hero image area
- Close button (X icon) positioned top-right

### Visual Comparison

| Feature             | Mobile (Standard) | Mobile (Hero Image) | Web (Current) |
| ------------------- | ----------------- | ------------------- | ------------- |
| **Close Mechanism** | HandleBar         | HandleBar           | X Button      |
| **Hero Image**      | ❌                | ✅ Full-width       | ❌            |
| **Title Position**  | Top               | Below hero image    | Top-left      |
| **Border Radius**   | Top corners       | Top corners + image | Top corners   |

### Proposed Implementation Strategy

#### 1. Hero Image Support

Add a new prop to support hero/banner images at the top of the tray:

```typescript
// Add to TrayBaseProps (both web and mobile)
{
  /**
   * Hero image/illustration to display at the top of the tray
   * Renders full-width with matching border radius
   */
  heroImage?: React.ReactNode;

  /**
   * Height of the hero image area
   * @default 'auto' (intrinsic height of content)
   */
  heroImageHeight?: number | 'auto';

  /**
   * Style overrides for the hero image container
   */
  heroImageStyle?: CSSProperties | StyleProp<ViewStyle>;
}
```

#### 2. Close Affordance Unification

Create a unified prop that controls the close mechanism display:

```typescript
/**
 * Controls how the tray close affordance is displayed
 * - 'button': Shows an X close button in the header (web default)
 * - 'handlebar': Shows a handlebar indicator at the top (mobile default)
 * - 'both': Shows both handlebar and close button
 * - 'none': Hides both (use with preventDismiss)
 */
closeAffordance?: 'button' | 'handlebar' | 'both' | 'none';
```

#### 3. Header Layout Modes

Support different header configurations:

```typescript
/**
 * Controls the header layout style
 * - 'standard': Title + close button (web default)
 * - 'hero': Full-width hero image with title below
 * - 'minimal': HandleBar only, no title area (mobile default)
 */
headerLayout?: 'standard' | 'hero' | 'minimal';
```

### Benefits of This Approach

1. **Web gains mobile features:**
   - Can optionally use handlebar for touch-friendly experiences
   - Can display hero images like mobile
2. **Mobile maintains backward compatibility:**
   - Existing `handleBarVariant` continues to work
   - New features are additive
3. **Mobile web alignment:**
   - Web can detect touch capability and adjust defaults
   - Responsive experiences can match native mobile behavior
4. **Unified API:**
   - Consistent props across platforms where possible
   - Clear migration path for cross-platform usage

---

## Relevant Props Comparison

### Shared Props (Both Platforms)

| Prop                             | Web         | Mobile                            | Notes                                |
| -------------------------------- | ----------- | --------------------------------- | ------------------------------------ |
| `children`                       | ✅          | ✅                                | Both support render function pattern |
| `header`                         | ✅          | ✅                                | ReactNode for custom header          |
| `footer`                         | ✅          | ✅                                | ReactNode for custom footer          |
| `title`                          | ✅          | ✅                                | String or ReactNode                  |
| `pin`                            | ✅          | ✅                                | PinningDirection                     |
| `onBlur`                         | ✅          | ✅                                | Called when overlay pressed          |
| `onCloseComplete`                | ✅          | ✅                                | Called when close animation finishes |
| `onVisibilityChange`             | ✅          | ✅                                | Visibility callback                  |
| `preventDismiss`                 | ✅ (web)    | `preventDismissGestures` (mobile) | Name differs                         |
| `verticalDrawerPercentageOfView` | ✅ (string) | ✅ (number)                       | Type differs                         |

### Web-Only Props

| Prop                      | Description                           |
| ------------------------- | ------------------------------------- |
| `id`                      | HTML ID for the tray                  |
| `hideHeader`              | Hide the header section entirely      |
| `role`                    | ARIA role ('dialog' or 'alertdialog') |
| `zIndex`                  | z-index for the tray overlay          |
| `focusTabIndexElements`   | Allow tabIndex elements in FocusTrap  |
| `restoreFocusOnUnmount`   | Restore focus when unmounted          |
| `closeAccessibilityLabel` | Accessibility label for close button  |
| `closeAccessibilityHint`  | Accessibility hint for close button   |
| `styles`                  | Style objects for various parts       |
| `classNames`              | Class names for various parts         |

### Mobile-Only Props

| Prop                                 | Description                            |
| ------------------------------------ | -------------------------------------- |
| `handleBarVariant`                   | 'inside' or 'outside' positioning      |
| `hideHandleBar`                      | Hide the handlebar                     |
| `handleBarAccessibilityLabel`        | Accessibility label for handlebar      |
| `preventHardwareBackBehaviorAndroid` | Prevent Android back button dismiss    |
| `disableCapturePanGestureToDismiss`  | Disable swipe capture (for ScrollView) |
| `stickyFooter`                       | ⚠️ Deprecated - use TrayStickyFooter   |

---

## Recommendations

### 1. HandleBar on Web (Priority: High)

Add handlebar support to web with the following approach:

1. **Create Web HandleBar Component**
   - Implement as a simple visual component
   - Support 'inside' variant initially
   - Add click-to-dismiss support for accessibility

2. **Add Props to Web Tray**

   ```typescript
   showHandleBar?: boolean;        // default: false (backward compat)
   handleBarVariant?: 'inside';    // start with 'inside' only
   hideCloseButton?: boolean;      // allow hiding the X button
   ```

3. **Backward Compatibility**
   - Default behavior remains unchanged (X button, no handlebar)
   - New prop opts into handlebar display

### 2. Hero Image Support (Priority: High)

Based on mobile examples showing hero images in trays:

1. **Add `heroImage` Prop to Both Platforms**

   ```typescript
   // Web
   heroImage?: React.ReactNode;
   heroImageHeight?: number | 'auto';
   heroImageClassName?: string;
   heroImageStyle?: React.CSSProperties;

   // Mobile
   heroImage?: React.ReactNode;
   heroImageHeight?: number | 'auto';
   heroImageStyle?: StyleProp<ViewStyle>;
   ```

2. **Rendering Logic**
   - Hero image renders at the top of the tray content
   - Title moves below the hero image when present
   - HandleBar (mobile) or close button (web) remains at the very top
   - Image container respects tray's border radius

3. **Example Usage**

   ```tsx
   // Mobile
   <Tray
     heroImage={<Image source={require('./crypto-illustration.png')} />}
     title="Choose crypto to receive"
   >
     {/* Tray content */}
   </Tray>

   // Web
   <Tray
     heroImage={<img src="/illustrations/onboarding.svg" alt="" />}
     title="Welcome to Coinbase"
   >
     {/* Tray content */}
   </Tray>
   ```

### 3. Align `verticalDrawerPercentageOfView` Types (Priority: Medium)

Consider aligning the types:

- **Option A:** Web accepts both string and number (breaking change: none)
- **Option B:** Create a shared utility for conversion
- **Option C:** Document the discrepancy clearly

### 4. Add `hideHeader` to Mobile (Priority: Low)

Mobile currently doesn't have a direct `hideHeader` prop equivalent. Consider adding for parity.

### 5. Unify Close Affordance API (Priority: Medium)

Consider a unified API for controlling close mechanisms:

```typescript
// Could be added to both platforms
closeAffordance?: 'button' | 'handlebar' | 'both' | 'none';
```

This provides flexibility for different scenarios:

- **`'button'`** - Web default, traditional X icon
- **`'handlebar'`** - Mobile default, swipe-friendly
- **`'both'`** - Hero image trays where accessibility needs both
- **`'none'`** - Controlled trays (with `preventDismiss`)

### 6. Mobile Web Considerations

For mobile web (responsive web in mobile viewport):

- Consider defaulting to handlebar behavior
- Detect touch capability and adjust defaults
- Allow explicit override via props
- Hero images should follow mobile patterns on touch devices

---

## Shared Tokens Reference

From `packages/common/src/tokens/drawer.ts`:

```typescript
verticalDrawerPercentageOfView = 0.75; // 75% of viewport height
horizontalDrawerPercentageOfView = 0.85; // 85% of viewport width
drawerHeightThreshold = 0.4; // Large drawer threshold
handleBarOffset = 60;
handleBarHeight = 4;
normalizeDrawerPanDistanceMultiplier = 1.1;
```

---

## Implementation Checklist

### HandleBar on Web

- [ ] Create `packages/web/src/overlays/handlebar/HandleBar.tsx`
- [ ] Add `showHandleBar`, `handleBarVariant` props to web `Tray`
- [ ] Add `hideCloseButton` prop to web `Tray`
- [ ] Update web `Tray` to conditionally render handlebar
- [ ] Add Storybook examples for handlebar variants
- [ ] Add unit tests for handlebar functionality

### Hero Image Support

- [ ] Add `heroImage`, `heroImageHeight`, `heroImageStyle` props to web `Tray`
- [ ] Add `heroImage`, `heroImageHeight`, `heroImageStyle` props to mobile `Tray`
- [ ] Update rendering logic to position title below hero image
- [ ] Ensure hero image respects tray border radius
- [ ] Add Storybook examples for hero image variants
- [ ] Add unit tests for hero image functionality

### Unified Close Affordance (Future)

- [ ] Design unified `closeAffordance` API
- [ ] Implement on web
- [ ] Implement on mobile (deprecation path for existing props)
- [ ] Document migration guide

### Documentation & Cleanup

- [ ] Document prop differences in component docs
- [ ] Consider adding `hideHeader` to mobile `Tray`
- [ ] Update Figma bindings if applicable
- [ ] Align `verticalDrawerPercentageOfView` types or document discrepancy

---

_Last updated: January 16, 2026_
