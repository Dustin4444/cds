import { DefaultThemeProvider } from '@coinbase/cds-mobile/utils/testHelpers';
import { render, screen } from '@testing-library/react-native';
import React from 'react';

import { CartesianChart } from '../CartesianChart';

jest.mock('@shopify/react-native-skia', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Canvas: ({
      children,
      style,
      accessible,
      accessibilityLabel,
      accessibilityLiveRegion,
    }: {
      children?: React.ReactNode;
      style?: unknown;
      accessible?: boolean;
      accessibilityLabel?: string;
      accessibilityLiveRegion?: string;
    }) =>
      React.createElement(
        View,
        { style, testID: 'skia-canvas', accessible, accessibilityLabel, accessibilityLiveRegion },
        children,
      ),
    Group: ({ children }: { children?: React.ReactNode }) => children ?? null,
    Path: () => null,
    ClipOp: { Intersect: 0 },
    Skia: {
      Path: {
        Make: jest.fn(() => ({
          type: 'SkPath',
          addRect: jest.fn(),
          addRRect: jest.fn(),
          interpolate: jest.fn(),
          toSVGString: jest.fn(() => ''),
          copy: jest.fn(),
        })),
        MakeFromSVGString: jest.fn(),
      },
      TypefaceFontProvider: { Make: jest.fn(() => ({})) },
    },
    usePathInterpolation: jest.fn(() => null),
    notifyChange: jest.fn(),
  };
});

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated/mock'),
  useSharedValue: jest.fn((v: number) => ({ value: v })),
}));

jest.mock('../ChartContextBridge', () => {
  const React = require('react');
  return {
    ChartBridgeProvider: ({ children }: { children: React.ReactNode }) => children,
    useChartContextBridge:
      () =>
      ({ children }: { children: React.ReactNode }) =>
        children,
  };
});

jest.mock('@coinbase/cds-mobile/hooks/useLayout', () => ({
  useLayout: jest.fn(() => [{ width: 400, height: 300, x: 0, y: 0 }, jest.fn()]),
}));

const renderChart = (overrides: Partial<React.ComponentProps<typeof CartesianChart>> = {}) =>
  render(
    <DefaultThemeProvider>
      <CartesianChart
        accessibilityLabel="Test chart"
        series={[{ id: 'a', data: [1, 2, 3], color: 'blue' }]}
        xAxis={{ data: [1, 2, 3] }}
        {...overrides}
      />
    </DefaultThemeProvider>,
  );

describe('CartesianChart (mobile)', () => {
  describe('accessibilityLiveRegion', () => {
    it('defaults accessibilityLiveRegion to "none" on the canvas', () => {
      renderChart();
      expect(screen.getByTestId('skia-canvas').props.accessibilityLiveRegion).toBe('none');
    });

    it('respects an explicit accessibilityLiveRegion="polite" prop', () => {
      renderChart({ accessibilityLiveRegion: 'polite' });
      expect(screen.getByTestId('skia-canvas').props.accessibilityLiveRegion).toBe('polite');
    });
  });
});
