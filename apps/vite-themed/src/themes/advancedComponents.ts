import type { ComponentsConfig } from '@coinbase/cds-web/core/theme';

export const advancedComponents: ComponentsConfig = {
  Button: (props) => ({
    borderRadius: 200,
    ...(props.compact
      ? {
          paddingX: 2,
          paddingY: props.loading ? 1 : 1.5,
          font: props.loading ? 'headline' : 'label1',
        }
      : {
          paddingX: 4,
          paddingY: 2,
          font: 'headline',
        }),
  }),

  IconButton: (props) => ({
    borderRadius: 200,
    borderWidth: 0,
    padding: props.compact ? 1.5 : 2,
  }),

  TextInput: {
    inputBackground: 'bgAlternate',
    bordered: false,
  },

  Switch: (props) => ({
    background: props.checked ? 'bgPrimary' : 'bgTertiary',
    ...(props.checked && { controlColor: 'bgAlternate' }),
  }),

  Tooltip: {
    invertColorScheme: false,
  },

  TooltipContent: {
    background: 'bgSecondary',
  },
  Radio: (props) => ({
    borderColor: props.checked ? 'bgPrimary' : 'bgLinePrimarySubtle',
    // todo: borderWidth: 200 — needs PR, Radio doesn't forward borderWidth to inner Box like Checkbox does
  }),

  Checkbox: (props) => ({
    borderRadius: 100, // 4px — need 2px but need styles/classNames first
    borderWidth: 200,
    controlColor: 'fg',
    background: props.checked || props.indeterminate ? 'bgSecondary' : 'bg',
    borderColor: props.checked || props.indeterminate ? 'bgSecondary' : 'bgLinePrimarySubtle',
  }),

  ModalHeader: {
    paddingX: 4,
    paddingY: 3,
  },

  ModalFooter: {
    paddingX: 4,
    paddingY: 4,
  },

  Table: {
    variant: 'default',
  },

  SegmentedTabs: {
    activeBackground: 'bgSecondary',
    background: 'bgAlternate',
    borderRadius: 200,
  },

  SegmentedTab: {
    activeColor: 'fg',
    borderRadius: 200,
  },
};
