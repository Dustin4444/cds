import type { TextStyle, ViewStyle } from 'react-native';
import type { ColorScheme, ThemeVars } from '@coinbase/cds-common/core/theme';

import type { SelectBaseProps as AlphaSelectBaseProps } from '../alpha/select/types';
import type { SelectChipBaseProps } from '../alpha/select-chip/SelectChip';
import type { TabbedChipsBaseProps } from '../alpha/tabbed-chips/TabbedChips';
import type { ButtonBaseProps } from '../buttons/Button';
import type { IconButtonBaseProps } from '../buttons/IconButton';
import type { NudgeCardBaseProps } from '../cards/NudgeCard';
import type { UpsellCardBaseProps } from '../cards/UpsellCard';
import type { ListCellBaseProps } from '../cells/ListCell';
import type { ChipBaseProps } from '../chips/ChipProps';
import type { CoachmarkBaseProps } from '../coachmark/Coachmark';
import type { CheckboxProps } from '../controls/Checkbox';
import type { CheckboxCellBaseProps } from '../controls/CheckboxCell';
import type { InputIconButtonProps } from '../controls/InputIconButton';
import type { RadioProps } from '../controls/Radio';
import type { RadioCellBaseProps } from '../controls/RadioCell';
import type { SearchInputBaseProps } from '../controls/SearchInput';
import type { SwitchProps } from '../controls/Switch';
import type { TextInputBaseProps } from '../controls/TextInput';
import type { DatePickerProps } from '../dates/DatePicker';
import type { DotCountBaseProps } from '../dots/DotCount';
import type { AvatarBaseProps } from '../media/Avatar';
import type { AlertBaseProps } from '../overlays/Alert';
import type { ModalBaseProps } from '../overlays/modal/Modal';
import type { ModalFooterProps } from '../overlays/modal/ModalFooter';
import type { ModalHeaderBaseProps } from '../overlays/modal/ModalHeader';
import type { ToastBaseProps } from '../overlays/Toast';
import type { TooltipBaseProps } from '../overlays/tooltip/TooltipProps';
import type { SegmentedTabProps } from '../tabs/SegmentedTab';
import type { SegmentedTabsProps } from '../tabs/SegmentedTabs';
import type { TabsBaseProps } from '../tabs/Tabs';
import type { TagBaseProps } from '../tag/Tag';

type Shadow = {
  shadowColor?: ViewStyle['shadowColor'];
  shadowOpacity?: ViewStyle['shadowOpacity'];
  shadowOffset?: ViewStyle['shadowOffset'];
  shadowRadius?: ViewStyle['shadowRadius'];
};

/** A config resolver is either a static partial props object or a function that receives the component's props and returns partial props. */
export type ConfigResolver<P> = Partial<P> | ((props: P) => Partial<P>);

export type ComponentTheme = {
  // Buttons
  Button: ConfigResolver<ButtonBaseProps>;
  IconButton: ConfigResolver<IconButtonBaseProps>;
  // Controls
  TextInput: ConfigResolver<TextInputBaseProps>;
  InputIconButton: ConfigResolver<InputIconButtonProps>;
  SearchInput: ConfigResolver<SearchInputBaseProps>;
  Checkbox: ConfigResolver<CheckboxProps<string>>;
  CheckboxCell: ConfigResolver<CheckboxCellBaseProps<string>>;
  Radio: ConfigResolver<RadioProps<string>>;
  RadioCell: ConfigResolver<RadioCellBaseProps<string>>;
  Switch: ConfigResolver<SwitchProps<string>>;
  // Chips
  Chip: ConfigResolver<ChipBaseProps>;
  TabbedChips: ConfigResolver<TabbedChipsBaseProps>;
  // Select (alpha)
  Select: ConfigResolver<AlphaSelectBaseProps>;
  SelectChip: ConfigResolver<SelectChipBaseProps>;
  // Overlays
  Modal: ConfigResolver<ModalBaseProps>;
  ModalHeader: ConfigResolver<ModalHeaderBaseProps>;
  ModalFooter: ConfigResolver<ModalFooterProps>;
  Alert: ConfigResolver<AlertBaseProps>;
  Toast: ConfigResolver<ToastBaseProps>;
  Tooltip: ConfigResolver<TooltipBaseProps>;
  // Cells
  ListCell: ConfigResolver<ListCellBaseProps>;
  // Media
  Avatar: ConfigResolver<AvatarBaseProps>;
  // Dots
  DotCount: ConfigResolver<DotCountBaseProps>;
  // Tag
  Tag: ConfigResolver<TagBaseProps>;
  // Tabs
  Tabs: ConfigResolver<TabsBaseProps>;
  SegmentedTab: ConfigResolver<SegmentedTabProps>;
  SegmentedTabs: ConfigResolver<SegmentedTabsProps>;
  // Dates
  DatePicker: ConfigResolver<DatePickerProps>;
  // Cards
  NudgeCard: ConfigResolver<NudgeCardBaseProps>;
  UpsellCard: ConfigResolver<UpsellCardBaseProps>;
  // Coachmark
  Coachmark: ConfigResolver<CoachmarkBaseProps>;
};
export type ComponentsConfig<Components = ComponentTheme> = {
  [Key in keyof Components]?: Components[Key];
};

export type ThemeConfig = {
  /** A unique identifier for the theme. */
  id?: string;
  /** The light spectrum color values. */
  lightSpectrum?: { [key in ThemeVars.SpectrumColor]: string };
  /** The dark spectrum color values. */
  darkSpectrum?: { [key in ThemeVars.SpectrumColor]: string };
  /** The light color palette. */
  lightColor?: { [key in ThemeVars.Color]: string };
  /** The dark color palette. */
  darkColor?: { [key in ThemeVars.Color]: string };
  /** The space values, used for margin and padding. */
  space: { [key in ThemeVars.Space]: number };
  /** The icon size values. */
  iconSize: { [key in ThemeVars.IconSize]: number };
  /** The avatar size values. */
  avatarSize: { [key in ThemeVars.AvatarSize]: number };
  /** The border width values. */
  borderWidth: { [key in ThemeVars.BorderWidth]: number };
  /** The border radius values. */
  borderRadius: { [key in ThemeVars.BorderRadius]: number };
  /** The font family values. */
  fontFamily: { [key in ThemeVars.FontFamily]: string };
  /** The font family values for monospace fonts. */
  fontFamilyMono?: { [key in ThemeVars.FontFamily]: string };
  /** The font size values. */
  fontSize: { [key in ThemeVars.FontSize]: number };
  /** The font weight values. On react-native, font weights are determined by the fontFamily, so this is just metadata. */
  fontWeight: { [key in ThemeVars.FontWeight]: TextStyle['fontWeight'] };
  /** The line height values. */
  lineHeight: { [key in ThemeVars.LineHeight]: number };
  /** The text transform values. */
  textTransform: { [key in ThemeVars.TextTransform]: TextStyle['textTransform'] };
  /** The shadow values. */
  shadow: { [key in ThemeVars.Shadow]: Shadow };
  /** The control size values. */
  controlSize: { [key in ThemeVars.ControlSize]: number };
};

export type Theme = ThemeConfig & {
  /** The currently active color scheme for the parent ThemeProvider, either "light" or "dark". */
  activeColorScheme: ColorScheme;
  /** The light or dark spectrum color values, as appropriate based on the activeColorScheme. */
  spectrum: { [key in ThemeVars.SpectrumColor]: string };
  /** The light or dark color palette, as appropriate based on the activeColorScheme. */
  color: { [key in ThemeVars.Color]: string };
};
