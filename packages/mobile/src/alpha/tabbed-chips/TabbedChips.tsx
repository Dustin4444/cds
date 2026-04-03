import React, { forwardRef, memo, useCallback, useMemo } from 'react';
import type { StyleProp, View, ViewStyle } from 'react-native';
import type { SharedAccessibilityProps, SharedProps, ThemeVars } from '@coinbase/cds-common';
import { useTabsContext } from '@coinbase/cds-common/tabs/TabsContext';
import type { TabValue } from '@coinbase/cds-common/tabs/useTabs';

import type { ChipProps } from '../../chips/ChipProps';
import { MediaChip } from '../../chips/MediaChip';
import { useComponentConfig } from '../../hooks/useComponentConfig';
import { type BoxProps } from '../../layout';
import { Tabs, type TabsBaseProps, type TabsProps, TabsScrollArea } from '../../tabs';

const DefaultTabComponent = <TabId extends string = string>({
  label = '',
  id,
  ...tabProps
}: TabbedChipProps<TabId>) => {
  const { activeTab, updateActiveTab } = useTabsContext();
  const isActive = useMemo(() => activeTab?.id === id, [activeTab, id]);
  const handlePress = useCallback(() => updateActiveTab(id), [id, updateActiveTab]);
  return (
    <MediaChip
      accessibilityState={{ selected: isActive }}
      invertColorScheme={isActive}
      onPress={handlePress}
      {...tabProps}
    >
      {label}
    </MediaChip>
  );
};

const DefaultTabsActiveIndicatorComponent = () => {
  return null;
};

export type TabbedChipProps<TabId extends string = string> = Omit<
  ChipProps,
  'children' | 'onPress'
> &
  TabValue<TabId> & {
    Component?: React.FC<Omit<ChipProps, 'children'> & TabValue<TabId>>;
  };

export type TabbedChipsBaseProps<TabId extends string = string> = Omit<
  TabsBaseProps<TabId>,
  | 'TabComponent'
  | 'TabsActiveIndicatorComponent'
  | 'tabs'
  | 'onActiveTabElementChange'
  | 'activeBackground'
> & {
  tabs: TabbedChipProps<TabId>[];
  TabComponent?: React.FC<TabbedChipProps<TabId>>;
  TabsActiveIndicatorComponent?: TabsProps<TabId>['TabsActiveIndicatorComponent'];
  /**
   * Turn on to use a compact Chip component for each tab.
   * @default false
   */
  compact?: boolean;
  /**
   * X position offset when auto-scrolling to active tab (to avoid active tab being covered by the overflow gradient on the left side, default: 30px)
   * @default 30
   */
  autoScrollOffset?: number;
};

export type TabbedChipsProps<TabId extends string = string> = TabbedChipsBaseProps<TabId> &
  SharedProps &
  SharedAccessibilityProps & {
    /**
     * The spacing between Tabs
     * @default 1
     */
    gap?: ThemeVars.Space;
    /**
     * The width of the scroll container, defaults to 100% of the parent container
     * If the tabs are wider than the width of the container, overflow gradients are shown at the edges.
     */
    width?: BoxProps['width'];
    styles?: {
      /** Root container element */
      root?: StyleProp<ViewStyle>;
      /** Horizontal scroll region wrapping the tab row (aligned with {@link TabsScrollArea}). */
      scrollContainer?: StyleProp<ViewStyle>;
      /** Single overflow affordance (gradient); applied to both edges (aligned with {@link TabsScrollArea}). */
      overflowIndicator?: StyleProp<ViewStyle>;
      /** Tabs root element */
      tabs?: StyleProp<ViewStyle>;
    };
  };

type TabbedChipsFC = <TabId extends string = string>(
  props: TabbedChipsProps<TabId> & { ref?: React.ForwardedRef<View> },
) => React.ReactElement;

const TabbedChipsComponent = memo(
  forwardRef(function TabbedChips<TabId extends string = string>(
    _props: TabbedChipsProps<TabId>,
    ref: React.ForwardedRef<View>,
  ) {
    const mergedProps = useComponentConfig('TabbedChips', _props);
    const {
      tabs,
      activeTab = tabs[0],
      testID = 'tabbed-chips',
      TabComponent = DefaultTabComponent,
      TabsActiveIndicatorComponent = DefaultTabsActiveIndicatorComponent,
      onChange,
      width,
      gap = 1,
      compact,
      styles,
      autoScrollOffset = 30,
      ...accessibilityProps
    } = mergedProps;

    const TabComponentWithCompact = useCallback(
      (props: TabValue<TabId>) => {
        return <TabComponent compact={compact} {...props} />;
      },
      [TabComponent, compact],
    );

    const tabsScrollAreaStyles = useMemo(
      () => ({
        root: styles?.root,
        scrollContainer: styles?.scrollContainer,
        overflowIndicator: styles?.overflowIndicator,
      }),
      [styles],
    );

    return (
      <TabsScrollArea
        ref={ref}
        autoScrollOffset={autoScrollOffset}
        styles={tabsScrollAreaStyles}
        testID={testID}
        width={width}
        {...accessibilityProps}
      >
        {(props) => (
          <Tabs
            TabComponent={TabComponentWithCompact}
            TabsActiveIndicatorComponent={TabsActiveIndicatorComponent}
            activeTab={activeTab || null}
            gap={gap}
            onChange={onChange}
            style={styles?.tabs}
            tabs={tabs}
            {...props}
          />
        )}
      </TabsScrollArea>
    );
  }),
);

TabbedChipsComponent.displayName = 'TabbedChips';

export const TabbedChips = TabbedChipsComponent as TabbedChipsFC;
