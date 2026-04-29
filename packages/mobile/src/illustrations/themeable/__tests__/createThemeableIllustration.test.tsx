import { render, screen } from '@testing-library/react-native';

import { DefaultThemeProvider } from '../../../utils/testHelpers';
import type { ThemeableIllustrationConfigShape } from '../createThemeableIllustration';
import { createThemeableIllustration } from '../createThemeableIllustration';

const LIGHT_SVG = '<svg><path fill="#0052FF" /></svg>';
const DARK_SVG = '<svg><path fill="#588AF5" /></svg>';
const THEMEABLE_SVG =
  '<svg><path fill="var(--illustration-primary)" /><path fill="var(--illustration-accent-1)" /></svg>';

const TEST_ID = 'themeable-illo-test';

const mockConfig: ThemeableIllustrationConfigShape = {
  testIllustration: {
    light: () => LIGHT_SVG,
    dark: () => DARK_SVG,
    themeable: () => THEMEABLE_SVG,
  },
};

const mockConfigWithoutThemeable: ThemeableIllustrationConfigShape = {
  testIllustration: {
    light: () => LIGHT_SVG,
    dark: () => DARK_SVG,
  },
};

describe('createThemeableIllustration', () => {
  it('renders with theme variable substitution when illustrationColor is available', () => {
    const Component = createThemeableIllustration('spotSquare', mockConfig);

    render(
      <DefaultThemeProvider activeColorScheme="light">
        <Component name={'testIllustration' as never} testID={TEST_ID} />
      </DefaultThemeProvider>,
    );

    const el = screen.getByTestId(TEST_ID);
    expect(el).toBeTruthy();

    const xml = el.props.xml as string;
    expect(xml).not.toContain('var(--illustration-primary)');
    expect(xml).not.toContain('var(--illustration-accent-1)');
  });

  it('falls back to light/dark XML when illustrationColor is absent', () => {
    const configWithFallbackOnly: ThemeableIllustrationConfigShape = {
      testIllustration: {
        light: () => LIGHT_SVG,
        dark: () => DARK_SVG,
        themeable: () => THEMEABLE_SVG,
      },
    };
    const Component = createThemeableIllustration('spotSquare', configWithFallbackOnly);

    const themeWithoutIllustrationColor = {
      lightIllustrationColor: undefined,
      darkIllustrationColor: undefined,
    };

    render(
      <DefaultThemeProvider
        activeColorScheme="light"
        theme={themeWithoutIllustrationColor as never}
      >
        <Component name={'testIllustration' as never} testID={TEST_ID} />
      </DefaultThemeProvider>,
    );

    const el = screen.getByTestId(TEST_ID);
    expect(el.props.xml).toBe(LIGHT_SVG);
  });

  it('falls back to light/dark when themeable getter is not available', () => {
    const Component = createThemeableIllustration('spotSquare', mockConfigWithoutThemeable);

    render(
      <DefaultThemeProvider activeColorScheme="light">
        <Component name={'testIllustration' as never} testID={TEST_ID} />
      </DefaultThemeProvider>,
    );

    const el = screen.getByTestId(TEST_ID);
    expect(el.props.xml).toBe(LIGHT_SVG);
  });

  it('uses dark scheme XML when activeColorScheme is dark and no illustrationColor', () => {
    const Component = createThemeableIllustration('spotSquare', mockConfigWithoutThemeable);

    render(
      <DefaultThemeProvider activeColorScheme="dark">
        <Component name={'testIllustration' as never} testID={TEST_ID} />
      </DefaultThemeProvider>,
    );

    const el = screen.getByTestId(TEST_ID);
    expect(el.props.xml).toBe(DARK_SVG);
  });

  it('passes accessibility props through to SvgXml', () => {
    const Component = createThemeableIllustration('spotSquare', mockConfig);

    render(
      <DefaultThemeProvider activeColorScheme="light">
        <Component
          accessibilityHint="Hint text"
          accessibilityLabel="Label text"
          name={'testIllustration' as never}
          testID={TEST_ID}
        />
      </DefaultThemeProvider>,
    );

    const el = screen.getByTestId(TEST_ID);
    expect(el).toHaveProp('accessibilityLabel', 'Label text');
    expect(el).toHaveProp('accessibilityHint', 'Hint text');
    expect(el).toHaveProp('accessibilityRole', 'image');
    expect(el).toHaveProp('accessible', true);
  });

  it('sets accessible to false when no accessibilityLabel is provided', () => {
    const Component = createThemeableIllustration('spotSquare', mockConfig);

    render(
      <DefaultThemeProvider activeColorScheme="light">
        <Component name={'testIllustration' as never} testID={TEST_ID} />
      </DefaultThemeProvider>,
    );

    const el = screen.getByTestId(TEST_ID);
    expect(el).toHaveProp('accessible', false);
  });

  it('renders fallback when name is not found in config', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const Component = createThemeableIllustration('spotSquare', mockConfig);
    const FallbackComponent = () => <></>;

    render(
      <DefaultThemeProvider activeColorScheme="light">
        <Component
          fallback={<FallbackComponent />}
          name={'unknownName' as never}
          testID={TEST_ID}
        />
      </DefaultThemeProvider>,
    );

    expect(screen.queryByTestId(TEST_ID)).toBeNull();
    jest.restoreAllMocks();
  });
});
