#!/usr/bin/env node
/**
 * Migration script: adds import statements to all _webExamples.mdx and _mobileExamples.mdx files.
 *
 * Web examples: adds imports from @coinbase/cds-web (and common/icons/etc.)
 * Mobile examples: adds imports from @coinbase/cds-mobile (and common), converts ```jsx to ```jsx live noPreview
 *
 * Usage: node scripts/add-example-imports.mjs [--dry-run]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.resolve(__dirname, '../apps/docs/docs/components');
const DRY_RUN = process.argv.includes('--dry-run');

// ─── Import Maps ───────────────────────────────────────────────

const webImportMap = {
  // React
  useState: 'react',
  useEffect: 'react',
  useCallback: 'react',
  useMemo: 'react',
  useRef: 'react',
  useId: 'react',
  Fragment: 'react',

  // CDS Common - Hooks
  useEventHandler: '@coinbase/cds-common/hooks/useEventHandler',
  useMergeRefs: '@coinbase/cds-common/hooks/useMergeRefs',
  usePreviousValue: '@coinbase/cds-common/hooks/usePreviousValue',
  useRefMap: '@coinbase/cds-common/hooks/useRefMap',
  useSort: '@coinbase/cds-common/hooks/useSort',
  useAlert: '@coinbase/cds-common/overlays/useAlert',
  useModal: '@coinbase/cds-common/overlays/useModal',
  OverlayContentContext: '@coinbase/cds-common/overlays/OverlayContentContext',
  useOverlayContentContext: '@coinbase/cds-common/overlays/OverlayContentContext',
  useMultiSelect: '@coinbase/cds-common/select/useMultiSelect',
  useStepper: '@coinbase/cds-common/stepper/useStepper',
  LocaleProvider: '@coinbase/cds-common/system/LocaleProvider',
  useTabsContext: '@coinbase/cds-common/tabs/TabsContext',
  useTourContext: '@coinbase/cds-common/tour/TourContext',
  DateInputValidationError: '@coinbase/cds-common/dates/DateInputValidationError',

  // CDS Common - Data
  loremIpsum: '@coinbase/cds-common/internal/data/loremIpsum',
  prices: '@coinbase/cds-common/internal/data/prices',
  product: '@coinbase/cds-common/internal/data/product',
  users: '@coinbase/cds-common/internal/data/users',
  sparklineInteractiveData: '@coinbase/cds-common/internal/visualizations/SparklineInteractiveData',
  sparklineInteractiveHoverData:
    '@coinbase/cds-common/internal/visualizations/SparklineInteractiveData',
  useSparklineArea: '@coinbase/cds-common/visualizations/useSparklineArea',
  useSparklinePath: '@coinbase/cds-common/visualizations/useSparklinePath',

  // CDS Web - Layout
  Box: '@coinbase/cds-web/layout',
  HStack: '@coinbase/cds-web/layout',
  VStack: '@coinbase/cds-web/layout',
  Divider: '@coinbase/cds-web/layout',
  Spacer: '@coinbase/cds-web/layout',
  Group: '@coinbase/cds-web/layout',

  // CDS Web - Accordion
  Accordion: '@coinbase/cds-web/accordion',
  AccordionItem: '@coinbase/cds-web/accordion',

  // CDS Web - Alpha
  Combobox: '@coinbase/cds-web/alpha/combobox/Combobox',
  DataCard: '@coinbase/cds-web/alpha/data-card',
  Select: '@coinbase/cds-web/alpha/select/Select',
  SelectChip: '@coinbase/cds-web/alpha/select-chip/SelectChip',
  TabbedChips: '@coinbase/cds-web/alpha/tabbed-chips/TabbedChips',

  // CDS Web - Animation
  Lottie: '@coinbase/cds-web/animation',
  LottieStatusAnimation: '@coinbase/cds-web/animation',

  // CDS Web - Banner
  Banner: '@coinbase/cds-web/banner',

  // CDS Web - Buttons
  Button: '@coinbase/cds-web/buttons',
  IconButton: '@coinbase/cds-web/buttons',
  ButtonGroup: '@coinbase/cds-web/buttons',

  // CDS Web - Cards
  Card: '@coinbase/cds-web/cards',
  ContainedAssetCard: '@coinbase/cds-web/cards',
  FloatingAssetCard: '@coinbase/cds-web/cards',
  MediaCard: '@coinbase/cds-web/cards',
  MessagingCard: '@coinbase/cds-web/cards',
  NudgeCard: '@coinbase/cds-web/cards',
  UpsellCard: '@coinbase/cds-web/cards',
  ContentCard: '@coinbase/cds-web/cards/ContentCard',
  ContentCardBody: '@coinbase/cds-web/cards/ContentCard',
  ContentCardFooter: '@coinbase/cds-web/cards/ContentCard',
  ContentCardHeader: '@coinbase/cds-web/cards/ContentCard',

  // CDS Web - Carousel
  Carousel: '@coinbase/cds-web/carousel',
  CarouselItem: '@coinbase/cds-web/carousel',
  DefaultCarouselNavigation: '@coinbase/cds-web/carousel',
  DefaultCarouselPagination: '@coinbase/cds-web/carousel',

  // CDS Web - Cells
  CellHelperText: '@coinbase/cds-web/cells',
  CellMedia: '@coinbase/cds-web/cells',
  ContentCell: '@coinbase/cds-web/cells',
  ListCell: '@coinbase/cds-web/cells',

  // CDS Web - Chips
  Chip: '@coinbase/cds-web/chips',
  InputChip: '@coinbase/cds-web/chips',
  MediaChip: '@coinbase/cds-web/chips',

  // CDS Web - Coachmark
  Coachmark: '@coinbase/cds-web/coachmark',

  // CDS Web - Collapsible
  Collapsible: '@coinbase/cds-web/collapsible',

  // CDS Web - Controls
  Checkbox: '@coinbase/cds-web/controls',
  CheckboxGroup: '@coinbase/cds-web/controls',
  Radio: '@coinbase/cds-web/controls',
  RadioGroup: '@coinbase/cds-web/controls',
  Switch: '@coinbase/cds-web/controls',
  TextInput: '@coinbase/cds-web/controls',
  InputLabel: '@coinbase/cds-web/controls/InputLabel',

  // CDS Web - Dates
  DatePicker: '@coinbase/cds-web/dates',
  DateInput: '@coinbase/cds-web/dates',

  // CDS Web - Dots
  DotCount: '@coinbase/cds-web/dots',
  DotStatusColor: '@coinbase/cds-web/dots',
  DotSymbol: '@coinbase/cds-web/dots',

  // CDS Web - Dropdown
  Dropdown: '@coinbase/cds-web/dropdown',
  MenuItem: '@coinbase/cds-web/dropdown',

  // CDS Web - Hooks
  useA11yControlledVisibility: '@coinbase/cds-web/hooks/useA11yControlledVisibility',
  useBreakpoints: '@coinbase/cds-web/hooks/useBreakpoints',
  useCheckboxGroupState: '@coinbase/cds-web/hooks/useCheckboxGroupState',
  useDimensions: '@coinbase/cds-web/hooks/useDimensions',
  useHasMounted: '@coinbase/cds-web/hooks/useHasMounted',
  useIsoEffect: '@coinbase/cds-web/hooks/useIsoEffect',
  useMediaQuery: '@coinbase/cds-web/hooks/useMediaQuery',
  useScrollBlocker: '@coinbase/cds-web/hooks/useScrollBlocker',
  useTheme: '@coinbase/cds-web/hooks/useTheme',

  // CDS Web - Icons
  Icon: '@coinbase/cds-web/icons',

  // CDS Web - Illustrations
  Pictogram: '@coinbase/cds-web/illustrations',
  SpotIcon: '@coinbase/cds-web/illustrations',
  SpotSquare: '@coinbase/cds-web/illustrations',
  SpotRectangle: '@coinbase/cds-web/illustrations',
  HeroSquare: '@coinbase/cds-web/illustrations',

  // CDS Web - Loaders
  Spinner: '@coinbase/cds-web/loaders',

  // CDS Web - Media
  Avatar: '@coinbase/cds-web/media',
  RemoteImage: '@coinbase/cds-web/media',
  RemoteImageGroup: '@coinbase/cds-web/media',

  // CDS Web - Multi Content Module
  MultiContentModule: '@coinbase/cds-web/multi-content-module',

  // CDS Web - Navigation
  Sidebar: '@coinbase/cds-web/navigation',
  SidebarItem: '@coinbase/cds-web/navigation',
  SidebarMoreMenu: '@coinbase/cds-web/navigation',
  NavigationBar: '@coinbase/cds-web/navigation',
  NavigationTitle: '@coinbase/cds-web/navigation',
  NavigationTitleSelect: '@coinbase/cds-web/navigation',

  // CDS Web - Numbers
  FormattedNumber: '@coinbase/cds-web/numbers',
  CurrencyText: '@coinbase/cds-web/numbers',
  PercentText: '@coinbase/cds-web/numbers',
  RollingNumber: '@coinbase/cds-web/numbers',

  // CDS Web - Overlays
  Modal: '@coinbase/cds-web/overlays',
  ModalHeader: '@coinbase/cds-web/overlays',
  ModalBody: '@coinbase/cds-web/overlays',
  ModalFooter: '@coinbase/cds-web/overlays',
  FullscreenModal: '@coinbase/cds-web/overlays',
  FullscreenAlert: '@coinbase/cds-web/overlays',
  Alert: '@coinbase/cds-web/overlays',
  Tray: '@coinbase/cds-web/overlays',
  Tooltip: '@coinbase/cds-web/overlays',
  Toast: '@coinbase/cds-web/overlays',
  FocusTrap: '@coinbase/cds-web/overlays',
  Overlay: '@coinbase/cds-web/overlays',
  useToast: '@coinbase/cds-web/overlays/useToast',

  // CDS Web - Page
  PageHeader: '@coinbase/cds-web/page',
  PageFooter: '@coinbase/cds-web/page',

  // CDS Web - Pagination
  Pagination: '@coinbase/cds-web/pagination',
  usePagination: '@coinbase/cds-web/pagination',

  // CDS Web - Section Header
  SectionHeader: '@coinbase/cds-web/section-header',

  // CDS Web - Stepper
  Stepper: '@coinbase/cds-web/stepper',

  // CDS Web - System
  Pressable: '@coinbase/cds-web/system',
  Interactable: '@coinbase/cds-web/system',
  ThemeProvider: '@coinbase/cds-web/system',
  MediaQueryProvider: '@coinbase/cds-web/system',

  // CDS Web - Tables
  Table: '@coinbase/cds-web/tables',
  TableBody: '@coinbase/cds-web/tables',
  TableCell: '@coinbase/cds-web/tables',
  TableCaption: '@coinbase/cds-web/tables',
  TableHead: '@coinbase/cds-web/tables',
  TableRow: '@coinbase/cds-web/tables',
  useSortableCell: '@coinbase/cds-web/tables/hooks/useSortableCell',

  // CDS Web - Tabs
  Tabs: '@coinbase/cds-web/tabs',
  TabNavigation: '@coinbase/cds-web/tabs',
  TabLabel: '@coinbase/cds-web/tabs',
  TabIndicator: '@coinbase/cds-web/tabs',
  SegmentedTabs: '@coinbase/cds-web/tabs',

  // CDS Web - Tag
  Tag: '@coinbase/cds-web/tag',

  // CDS Web - Tour
  Tour: '@coinbase/cds-web/tour',
  TourStep: '@coinbase/cds-web/tour',

  // CDS Web - Typography
  Text: '@coinbase/cds-web/typography',
  Link: '@coinbase/cds-web/typography',

  // CDS Web - Visualizations
  ProgressBar: '@coinbase/cds-web/visualizations',
  ProgressBarWithFixedLabels: '@coinbase/cds-web/visualizations',
  ProgressBarWithFloatLabel: '@coinbase/cds-web/visualizations',
  ProgressCircle: '@coinbase/cds-web/visualizations',

  // CDS Web - Themes
  defaultTheme: '@coinbase/cds-web/themes/defaultTheme',

  // Framer Motion
  AnimatePresence: 'framer-motion',
  motion: 'framer-motion',

  // CDS Web Visualization - Chart
  CartesianChart: '@coinbase/cds-web-visualization/chart',
  ChartProvider: '@coinbase/cds-web-visualization/chart',
  LineChart: '@coinbase/cds-web-visualization/chart',
  AreaChart: '@coinbase/cds-web-visualization/chart',
  BarChart: '@coinbase/cds-web-visualization/chart',
  Line: '@coinbase/cds-web-visualization/chart',
  DottedLine: '@coinbase/cds-web-visualization/chart',
  SolidLine: '@coinbase/cds-web-visualization/chart',
  Area: '@coinbase/cds-web-visualization/chart',
  DottedArea: '@coinbase/cds-web-visualization/chart',
  GradientArea: '@coinbase/cds-web-visualization/chart',
  SolidArea: '@coinbase/cds-web-visualization/chart',
  Bar: '@coinbase/cds-web-visualization/chart',
  BarPlot: '@coinbase/cds-web-visualization/chart',
  BarStack: '@coinbase/cds-web-visualization/chart',
  BarStackGroup: '@coinbase/cds-web-visualization/chart',
  Scrubber: '@coinbase/cds-web-visualization/chart',
  DefaultScrubberBeacon: '@coinbase/cds-web-visualization/chart',
  DefaultScrubberBeaconLabel: '@coinbase/cds-web-visualization/chart',
  DefaultScrubberLabel: '@coinbase/cds-web-visualization/chart',
  XAxis: '@coinbase/cds-web-visualization/chart',
  YAxis: '@coinbase/cds-web-visualization/chart',
  Axis: '@coinbase/cds-web-visualization/chart',
  DefaultAxisTickLabel: '@coinbase/cds-web-visualization/chart',
  Legend: '@coinbase/cds-web-visualization/chart',
  DefaultLegendEntry: '@coinbase/cds-web-visualization/chart',
  DefaultLegendShape: '@coinbase/cds-web-visualization/chart',
  Point: '@coinbase/cds-web-visualization/chart',
  DefaultPointLabel: '@coinbase/cds-web-visualization/chart',
  ReferenceLine: '@coinbase/cds-web-visualization/chart',
  DefaultReferenceLineLabel: '@coinbase/cds-web-visualization/chart',
  Gradient: '@coinbase/cds-web-visualization/chart',
  PeriodSelector: '@coinbase/cds-web-visualization/chart',
  PeriodSelectorActiveIndicator: '@coinbase/cds-web-visualization/chart',
  LiveTabLabel: '@coinbase/cds-web-visualization/chart',
  ChartText: '@coinbase/cds-web-visualization/chart',
  ChartTextGroup: '@coinbase/cds-web-visualization/chart',
  Path: '@coinbase/cds-web-visualization/chart',

  // CDS Web Visualization - Sparkline
  Sparkline: '@coinbase/cds-web-visualization/sparkline',
  SparklineArea: '@coinbase/cds-web-visualization/sparkline',
  SparklineGradient: '@coinbase/cds-web-visualization/sparkline',
  SparklineInteractive: '@coinbase/cds-web-visualization/sparkline',
  SparklineInteractiveContent: '@coinbase/cds-web-visualization/sparkline',
  SparklineInteractiveHeader: '@coinbase/cds-web-visualization/sparkline',
  SparklineInteractivePeriodSelector: '@coinbase/cds-web-visualization/sparkline',
  SparklineInteractivePaths: '@coinbase/cds-web-visualization/sparkline',
  SparklineInteractiveTimeseriesPaths: '@coinbase/cds-web-visualization/sparkline',
  SparklineInteractiveHoverPrice: '@coinbase/cds-web-visualization/sparkline',
  SparklineInteractiveHoverDate: '@coinbase/cds-web-visualization/sparkline',
  SparklineInteractiveMarkerDates: '@coinbase/cds-web-visualization/sparkline',
  SparklineInteractiveLineVertical: '@coinbase/cds-web-visualization/sparkline',
  SparklineInteractiveAnimatedPath: '@coinbase/cds-web-visualization/sparkline',

  // CDS Lottie
  successLottie: '@coinbase/cds-lottie-files',
  errorLottie: '@coinbase/cds-lottie-files',
  pendingLottie: '@coinbase/cds-lottie-files',
};

const mobileImportMap = {
  // React
  useState: 'react',
  useEffect: 'react',
  useCallback: 'react',
  useMemo: 'react',
  useRef: 'react',
  useId: 'react',
  Fragment: 'react',

  // CDS Common - Hooks
  useEventHandler: '@coinbase/cds-common/hooks/useEventHandler',
  useMergeRefs: '@coinbase/cds-common/hooks/useMergeRefs',
  usePreviousValue: '@coinbase/cds-common/hooks/usePreviousValue',
  useRefMap: '@coinbase/cds-common/hooks/useRefMap',
  useSort: '@coinbase/cds-common/hooks/useSort',
  useAlert: '@coinbase/cds-common/overlays/useAlert',
  useModal: '@coinbase/cds-common/overlays/useModal',
  useMultiSelect: '@coinbase/cds-common/select/useMultiSelect',
  useStepper: '@coinbase/cds-common/stepper/useStepper',
  useTabsContext: '@coinbase/cds-common/tabs/TabsContext',
  useTourContext: '@coinbase/cds-common/tour/TourContext',
  DateInputValidationError: '@coinbase/cds-common/dates/DateInputValidationError',

  // CDS Common - Data
  loremIpsum: '@coinbase/cds-common/internal/data/loremIpsum',
  prices: '@coinbase/cds-common/internal/data/prices',
  product: '@coinbase/cds-common/internal/data/product',
  users: '@coinbase/cds-common/internal/data/users',
  sparklineInteractiveData: '@coinbase/cds-common/internal/visualizations/SparklineInteractiveData',
  sparklineInteractiveHoverData:
    '@coinbase/cds-common/internal/visualizations/SparklineInteractiveData',
  useSparklineArea: '@coinbase/cds-common/visualizations/useSparklineArea',
  useSparklinePath: '@coinbase/cds-common/visualizations/useSparklinePath',

  // CDS Mobile - Layout
  Box: '@coinbase/cds-mobile/layout',
  HStack: '@coinbase/cds-mobile/layout',
  VStack: '@coinbase/cds-mobile/layout',
  Divider: '@coinbase/cds-mobile/layout',
  Spacer: '@coinbase/cds-mobile/layout',
  Group: '@coinbase/cds-mobile/layout',
  Fallback: '@coinbase/cds-mobile/layout',
  OverflowGradient: '@coinbase/cds-mobile/layout',

  // CDS Mobile - Accordion
  Accordion: '@coinbase/cds-mobile/accordion',
  AccordionItem: '@coinbase/cds-mobile/accordion',

  // CDS Mobile - Animation
  Lottie: '@coinbase/cds-mobile/animation',
  LottieStatusAnimation: '@coinbase/cds-mobile/animation',

  // CDS Mobile - Banner
  Banner: '@coinbase/cds-mobile/banner',

  // CDS Mobile - Buttons
  Button: '@coinbase/cds-mobile/buttons',
  AvatarButton: '@coinbase/cds-mobile/buttons',
  ButtonGroup: '@coinbase/cds-mobile/buttons',
  IconButton: '@coinbase/cds-mobile/buttons',
  IconCounterButton: '@coinbase/cds-mobile/buttons',
  SlideButton: '@coinbase/cds-mobile/buttons',

  // CDS Mobile - Cards
  Card: '@coinbase/cds-mobile/cards',
  ContainedAssetCard: '@coinbase/cds-mobile/cards',
  FloatingAssetCard: '@coinbase/cds-mobile/cards',
  MediaCard: '@coinbase/cds-mobile/cards',
  MessagingCard: '@coinbase/cds-mobile/cards',
  UpsellCard: '@coinbase/cds-mobile/cards',
  ContentCard: '@coinbase/cds-mobile/cards/ContentCard',
  ContentCardBody: '@coinbase/cds-mobile/cards/ContentCard',
  ContentCardFooter: '@coinbase/cds-mobile/cards/ContentCard',
  ContentCardHeader: '@coinbase/cds-mobile/cards/ContentCard',
  DataCard: '@coinbase/cds-mobile/cards',
  FeedCard: '@coinbase/cds-mobile/cards',
  AnnouncementCard: '@coinbase/cds-mobile/cards',
  FeatureEntryCard: '@coinbase/cds-mobile/cards',

  // CDS Mobile - Carousel
  Carousel: '@coinbase/cds-mobile/carousel',
  CarouselItem: '@coinbase/cds-mobile/carousel',
  DefaultCarouselNavigation: '@coinbase/cds-mobile/carousel',
  DefaultCarouselPagination: '@coinbase/cds-mobile/carousel',

  // CDS Mobile - Cells
  CellHelperText: '@coinbase/cds-mobile/cells',
  CellMedia: '@coinbase/cds-mobile/cells',
  ContentCell: '@coinbase/cds-mobile/cells',
  ListCell: '@coinbase/cds-mobile/cells',

  // CDS Mobile - Chips
  Chip: '@coinbase/cds-mobile/chips',
  InputChip: '@coinbase/cds-mobile/chips',
  MediaChip: '@coinbase/cds-mobile/chips',
  SelectChip: '@coinbase/cds-mobile/alpha/select-chip',
  TabbedChips: '@coinbase/cds-mobile/chips',

  // CDS Mobile - Coachmark
  Coachmark: '@coinbase/cds-mobile/coachmark',

  // CDS Mobile - Collapsible
  Collapsible: '@coinbase/cds-mobile/collapsible',

  // CDS Mobile - Controls
  Checkbox: '@coinbase/cds-mobile/controls',
  CheckboxGroup: '@coinbase/cds-mobile/controls',
  Radio: '@coinbase/cds-mobile/controls',
  RadioGroup: '@coinbase/cds-mobile/controls',
  Switch: '@coinbase/cds-mobile/controls',
  TextInput: '@coinbase/cds-mobile/controls',
  SearchInput: '@coinbase/cds-mobile/controls',
  Select: '@coinbase/cds-mobile/alpha/select',
  SelectOption: '@coinbase/cds-mobile/controls',
  Menu: '@coinbase/cds-mobile/controls',
  Numpad: '@coinbase/cds-mobile/controls',

  // CDS Mobile - Dates
  DatePicker: '@coinbase/cds-mobile/dates',
  DateInput: '@coinbase/cds-mobile/dates',

  // CDS Mobile - Dots
  DotCount: '@coinbase/cds-mobile/dots',
  DotStatusColor: '@coinbase/cds-mobile/dots',
  DotSymbol: '@coinbase/cds-mobile/dots',

  // CDS Mobile - Icons
  Icon: '@coinbase/cds-mobile/icons',

  // CDS Mobile - Illustrations
  Pictogram: '@coinbase/cds-mobile/illustrations',
  SpotIcon: '@coinbase/cds-mobile/illustrations',
  SpotSquare: '@coinbase/cds-mobile/illustrations',
  SpotRectangle: '@coinbase/cds-mobile/illustrations',
  HeroSquare: '@coinbase/cds-mobile/illustrations',

  // CDS Mobile - Loaders
  Spinner: '@coinbase/cds-mobile/loaders',

  // CDS Mobile - Media
  Avatar: '@coinbase/cds-mobile/media',
  RemoteImage: '@coinbase/cds-mobile/media',
  RemoteImageGroup: '@coinbase/cds-mobile/media',

  // CDS Mobile - Multi Content Module
  MultiContentModule: '@coinbase/cds-mobile/multi-content-module',

  // CDS Mobile - Navigation
  TopNavBar: '@coinbase/cds-mobile/navigation',
  NavigationTitle: '@coinbase/cds-mobile/navigation',
  NavigationTitleSelect: '@coinbase/cds-mobile/navigation',
  NavigationSubtitle: '@coinbase/cds-mobile/navigation',
  BrowserBar: '@coinbase/cds-mobile/navigation',
  NavBarIconButton: '@coinbase/cds-mobile/navigation',

  // CDS Mobile - Numbers
  RollingNumber: '@coinbase/cds-mobile/numbers',

  // CDS Mobile - Overlays
  Modal: '@coinbase/cds-mobile/overlays',
  ModalHeader: '@coinbase/cds-mobile/overlays',
  ModalBody: '@coinbase/cds-mobile/overlays',
  ModalFooter: '@coinbase/cds-mobile/overlays',
  Alert: '@coinbase/cds-mobile/overlays',
  Tray: '@coinbase/cds-mobile/overlays',
  Tooltip: '@coinbase/cds-mobile/overlays',
  Toast: '@coinbase/cds-mobile/overlays',
  Overlay: '@coinbase/cds-mobile/overlays',
  Drawer: '@coinbase/cds-mobile/overlays',
  useToast: '@coinbase/cds-mobile/overlays',

  // CDS Mobile - Page
  PageHeader: '@coinbase/cds-mobile/page',
  PageFooter: '@coinbase/cds-mobile/page',

  // CDS Mobile - Section Header
  SectionHeader: '@coinbase/cds-mobile/section-header',

  // CDS Mobile - Stepper
  Stepper: '@coinbase/cds-mobile/stepper',

  // CDS Mobile - System
  Pressable: '@coinbase/cds-mobile/system',
  PressableOpacity: '@coinbase/cds-mobile/system',
  Interactable: '@coinbase/cds-mobile/system',
  ThemeProvider: '@coinbase/cds-mobile/system',

  // CDS Mobile - Tabs
  Tabs: '@coinbase/cds-mobile/tabs',
  TabNavigation: '@coinbase/cds-mobile/tabs',
  TabLabel: '@coinbase/cds-mobile/tabs',
  TabIndicator: '@coinbase/cds-mobile/tabs',
  SegmentedTabs: '@coinbase/cds-mobile/tabs',

  // CDS Mobile - Tag
  Tag: '@coinbase/cds-mobile/tag',

  // CDS Mobile - Tour
  Tour: '@coinbase/cds-mobile/tour',
  TourStep: '@coinbase/cds-mobile/tour',

  // CDS Mobile - Typography
  Text: '@coinbase/cds-mobile/typography',
  Link: '@coinbase/cds-mobile/typography',

  // CDS Mobile - Visualizations
  ProgressBar: '@coinbase/cds-mobile/visualizations',
  ProgressBarWithFixedLabels: '@coinbase/cds-mobile/visualizations',
  ProgressBarWithFloatLabel: '@coinbase/cds-mobile/visualizations',
  ProgressCircle: '@coinbase/cds-mobile/visualizations',

  // CDS Mobile Visualization - Chart
  CartesianChart: '@coinbase/cds-mobile-visualization/chart',
  ChartProvider: '@coinbase/cds-mobile-visualization/chart',
  LineChart: '@coinbase/cds-mobile-visualization/chart',
  AreaChart: '@coinbase/cds-mobile-visualization/chart',
  BarChart: '@coinbase/cds-mobile-visualization/chart',
  Line: '@coinbase/cds-mobile-visualization/chart',
  DottedLine: '@coinbase/cds-mobile-visualization/chart',
  SolidLine: '@coinbase/cds-mobile-visualization/chart',
  Area: '@coinbase/cds-mobile-visualization/chart',
  DottedArea: '@coinbase/cds-mobile-visualization/chart',
  GradientArea: '@coinbase/cds-mobile-visualization/chart',
  SolidArea: '@coinbase/cds-mobile-visualization/chart',
  Bar: '@coinbase/cds-mobile-visualization/chart',
  BarPlot: '@coinbase/cds-mobile-visualization/chart',
  BarStack: '@coinbase/cds-mobile-visualization/chart',
  BarStackGroup: '@coinbase/cds-mobile-visualization/chart',
  Scrubber: '@coinbase/cds-mobile-visualization/chart',
  DefaultScrubberBeacon: '@coinbase/cds-mobile-visualization/chart',
  DefaultScrubberBeaconLabel: '@coinbase/cds-mobile-visualization/chart',
  DefaultScrubberLabel: '@coinbase/cds-mobile-visualization/chart',
  XAxis: '@coinbase/cds-mobile-visualization/chart',
  YAxis: '@coinbase/cds-mobile-visualization/chart',
  Axis: '@coinbase/cds-mobile-visualization/chart',
  DefaultAxisTickLabel: '@coinbase/cds-mobile-visualization/chart',
  Legend: '@coinbase/cds-mobile-visualization/chart',
  DefaultLegendEntry: '@coinbase/cds-mobile-visualization/chart',
  DefaultLegendShape: '@coinbase/cds-mobile-visualization/chart',
  Point: '@coinbase/cds-mobile-visualization/chart',
  DefaultPointLabel: '@coinbase/cds-mobile-visualization/chart',
  ReferenceLine: '@coinbase/cds-mobile-visualization/chart',
  DefaultReferenceLineLabel: '@coinbase/cds-mobile-visualization/chart',
  Gradient: '@coinbase/cds-mobile-visualization/chart',
  PeriodSelector: '@coinbase/cds-mobile-visualization/chart',
  PeriodSelectorActiveIndicator: '@coinbase/cds-mobile-visualization/chart',
  LiveTabLabel: '@coinbase/cds-mobile-visualization/chart',
  ChartText: '@coinbase/cds-mobile-visualization/chart',
  ChartTextGroup: '@coinbase/cds-mobile-visualization/chart',
  Path: '@coinbase/cds-mobile-visualization/chart',

  // CDS Mobile Visualization - Sparkline
  Sparkline: '@coinbase/cds-mobile-visualization/sparkline',
  SparklineArea: '@coinbase/cds-mobile-visualization/sparkline',
  SparklineGradient: '@coinbase/cds-mobile-visualization/sparkline',
  SparklineInteractive: '@coinbase/cds-mobile-visualization/sparkline',
  SparklineInteractiveContent: '@coinbase/cds-mobile-visualization/sparkline',
  SparklineInteractiveHeader: '@coinbase/cds-mobile-visualization/sparkline',
  SparklineInteractivePeriodSelector: '@coinbase/cds-mobile-visualization/sparkline',
  SparklineInteractivePaths: '@coinbase/cds-mobile-visualization/sparkline',
  SparklineInteractiveTimeseriesPaths: '@coinbase/cds-mobile-visualization/sparkline',
  SparklineInteractiveHoverPrice: '@coinbase/cds-mobile-visualization/sparkline',
  SparklineInteractiveHoverDate: '@coinbase/cds-mobile-visualization/sparkline',
  SparklineInteractiveMarkerDates: '@coinbase/cds-mobile-visualization/sparkline',
  SparklineInteractiveLineVertical: '@coinbase/cds-mobile-visualization/sparkline',
  SparklineInteractiveAnimatedPath: '@coinbase/cds-mobile-visualization/sparkline',
};

// Alias map: identifier -> { name, source } when the export name differs
const aliasMap = {
  btcCandles: { exportedAs: 'candles', source: '@coinbase/cds-common/internal/data/candles' },
};

// ─── Utilities ───────────────────────────────────────────────

function stripStringsAndComments(code) {
  return code
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/`(?:[^`\\]|\\.)*`/g, '``')
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/'(?:[^'\\]|\\.)*'/g, "''");
}

function isDeclaredLocally(name, code) {
  const patterns = [
    new RegExp(`\\b(?:const|let|var)\\s+${name}\\b`),
    new RegExp(`\\bfunction\\s+${name}\\b`),
    new RegExp(`\\b(?:const|let|var)\\s+\\{[^}]*\\b${name}\\b`),
    new RegExp(`\\(\\s*\\{[^)]*\\b${name}\\b[^)]*\\}\\s*\\)`),
    new RegExp(`\\(\\s*${name}\\s*[,):]`),
  ];
  return patterns.some((p) => p.test(code));
}

function isUsedIdentifier(name, strippedCode, rawCode) {
  const regex = new RegExp(`(?<!\\.)\\b${name}\\b`);
  return regex.test(strippedCode) && !isDeclaredLocally(name, rawCode);
}

function generateImportsForCode(code, importMap) {
  if (/^\s*import\s/m.test(code)) return null;

  const stripped = stripStringsAndComments(code);
  const importsBySource = {};

  for (const [name, source] of Object.entries(importMap)) {
    if (isUsedIdentifier(name, stripped, code)) {
      if (!importsBySource[source]) importsBySource[source] = [];
      importsBySource[source].push(name);
    }
  }

  for (const [alias, entry] of Object.entries(aliasMap)) {
    if (isUsedIdentifier(alias, stripped, code)) {
      if (!importsBySource[entry.source]) importsBySource[entry.source] = [];
      importsBySource[entry.source].push(`${entry.exportedAs} as ${alias}`);
    }
  }

  if (Object.keys(importsBySource).length === 0) return '';

  const lines = [];

  // Handle React specially
  const reactImports = importsBySource['react'];
  if (reactImports && reactImports.length > 0) {
    const names = reactImports.sort().join(', ');
    lines.push(`import React, { ${names} } from 'react';`);
    delete importsBySource['react'];
  }

  const sortedSources = Object.keys(importsBySource).sort();
  for (const source of sortedSources) {
    const specifiers = importsBySource[source].sort().join(', ');
    lines.push(`import { ${specifiers} } from '${source}';`);
  }

  return lines.join('\n');
}

// ─── MDX Processing ───────────────────────────────────────────

const CODE_BLOCK_RE =
  /^(```)(jsx|tsx)(\s+live)?(\s+noInline)?(\s+noPreview)?\s*\n([\s\S]*?)^```\s*$/gm;

function processWebFile(content) {
  let modified = false;

  const result = content.replace(
    CODE_BLOCK_RE,
    (match, ticks, lang, live, noInline, noPreview, code) => {
      if (!live) return match;
      if (/^\s*import\s/m.test(code)) return match;

      const imports = generateImportsForCode(code, webImportMap);
      if (!imports) return match;

      modified = true;
      const meta = [live?.trim(), noInline?.trim(), noPreview?.trim()].filter(Boolean).join(' ');
      return `${ticks}${lang} ${meta}\n${imports}\n\n${code}\`\`\``;
    },
  );

  return { result, modified };
}

function processMobileFile(content) {
  let modified = false;

  const result = content.replace(
    CODE_BLOCK_RE,
    (match, ticks, lang, live, noInline, noPreview, code) => {
      // Already processed (has imports or is already live noPreview)
      if (live && noPreview) return match;
      if (/^\s*import\s/m.test(code)) return match;

      // Skip code blocks that are already live (web-style) - shouldn't happen in mobile files
      if (live) return match;

      const imports = generateImportsForCode(code, mobileImportMap);
      if (!imports) {
        // No imports needed but still convert to live noPreview
        modified = true;
        return `${ticks}${lang} live noPreview\n${code}\`\`\``;
      }

      modified = true;
      return `${ticks}${lang} live noPreview\n${imports}\n\n${code}\`\`\``;
    },
  );

  return { result, modified };
}

// ─── File Discovery ───────────────────────────────────────────

function findFiles(dir, pattern) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFiles(fullPath, pattern));
    } else if (pattern.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

// ─── Main ───────────────────────────────────────────────

function main() {
  console.log(`Scanning ${DOCS_DIR} for example files...`);
  console.log(DRY_RUN ? '(DRY RUN - no files will be modified)\n' : '');

  const webFiles = findFiles(DOCS_DIR, /_webExamples\.mdx$/);
  const mobileFiles = findFiles(DOCS_DIR, /_mobileExamples\.mdx$/);

  console.log(`Found ${webFiles.length} web example files`);
  console.log(`Found ${mobileFiles.length} mobile example files\n`);

  let webModified = 0;
  let mobileModified = 0;

  for (const file of webFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const { result, modified } = processWebFile(content);
    if (modified) {
      const rel = path.relative(DOCS_DIR, file);
      console.log(`  [web] ${rel}`);
      if (!DRY_RUN) fs.writeFileSync(file, result, 'utf-8');
      webModified++;
    }
  }

  for (const file of mobileFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const { result, modified } = processMobileFile(content);
    if (modified) {
      const rel = path.relative(DOCS_DIR, file);
      console.log(`  [mobile] ${rel}`);
      if (!DRY_RUN) fs.writeFileSync(file, result, 'utf-8');
      mobileModified++;
    }
  }

  console.log(`\nDone! Modified ${webModified} web files and ${mobileModified} mobile files.`);
  if (DRY_RUN) console.log('(Dry run - no files were actually written)');
}

main();
