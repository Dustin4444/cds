import { act, render, screen, waitFor } from '@testing-library/react';

import { DefaultThemeProvider } from '../../../utils/test';
import { createThemeableIllustration } from '../createThemeableIllustration';

const MOCK_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 96 96"><path fill="var(--illustration-primary)" d="M0 0h96v96H0z"/></svg>';

const mockVersionMap = {
  testIllustration: 1,
  anotherIllustration: 2,
} as Record<string, number>;

function createMockImportMapLoader(content = MOCK_SVG) {
  return () =>
    Promise.resolve({
      default: {
        testIllustration: () => Promise.resolve({ content }),
        anotherIllustration: () => Promise.resolve({ content }),
      },
    });
}

function createFailingImportMapLoader() {
  return () =>
    Promise.resolve({
      default: {
        testIllustration: () => Promise.reject(new Error('load failed')),
      },
    });
}

describe('createThemeableIllustration', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders CDN img fallback initially while loading', () => {
    const Component = createThemeableIllustration(
      'spotSquare',
      mockVersionMap,
      createMockImportMapLoader(),
    );

    render(
      <DefaultThemeProvider activeColorScheme="light">
        <Component name={'testIllustration' as never} testID="test-illo" />
      </DefaultThemeProvider>,
    );

    const img = screen.getByTestId('test-illo');
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute(
      'src',
      'https://static-assets.coinbase.com/ui-infra/illustration/v1/spotSquare/svg/light/testIllustration-1.svg',
    );
  });

  it('switches to inline SVG after loading', async () => {
    const Component = createThemeableIllustration(
      'spotSquare',
      mockVersionMap,
      createMockImportMapLoader(),
    );

    render(
      <DefaultThemeProvider activeColorScheme="light">
        <Component name={'testIllustration' as never} testID="test-illo" />
      </DefaultThemeProvider>,
    );

    await waitFor(() => {
      const el = screen.getByTestId('test-illo');
      expect(el.tagName).toBe('SPAN');
      expect(el.innerHTML).toBe(MOCK_SVG);
    });
  });

  it('retains CSS variables in inline SVG markup', async () => {
    const Component = createThemeableIllustration(
      'spotSquare',
      mockVersionMap,
      createMockImportMapLoader(),
    );

    render(
      <DefaultThemeProvider activeColorScheme="light">
        <Component name={'testIllustration' as never} testID="test-illo" />
      </DefaultThemeProvider>,
    );

    await waitFor(() => {
      const el = screen.getByTestId('test-illo');
      expect(el.innerHTML).toContain('var(--illustration-primary)');
    });
  });

  it('passes alt text as aria-label', async () => {
    const Component = createThemeableIllustration(
      'spotSquare',
      mockVersionMap,
      createMockImportMapLoader(),
    );

    render(
      <DefaultThemeProvider activeColorScheme="light">
        <Component alt="Test illustration" name={'testIllustration' as never} testID="test-illo" />
      </DefaultThemeProvider>,
    );

    await waitFor(() => {
      const el = screen.getByTestId('test-illo');
      expect(el.tagName).toBe('SPAN');
    });

    const el = screen.getByTestId('test-illo');
    expect(el).toHaveAttribute('aria-label', 'Test illustration');
    expect(el).toHaveAttribute('role', 'img');
    expect(el).not.toHaveAttribute('aria-hidden');
  });

  it('marks decorative illustrations with aria-hidden', async () => {
    const Component = createThemeableIllustration(
      'spotSquare',
      mockVersionMap,
      createMockImportMapLoader(),
    );

    render(
      <DefaultThemeProvider activeColorScheme="light">
        <Component name={'testIllustration' as never} testID="test-illo" />
      </DefaultThemeProvider>,
    );

    await waitFor(() => {
      const el = screen.getByTestId('test-illo');
      expect(el.tagName).toBe('SPAN');
    });

    const el = screen.getByTestId('test-illo');
    expect(el).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies correct dimensions from the size system', async () => {
    const Component = createThemeableIllustration(
      'spotSquare',
      mockVersionMap,
      createMockImportMapLoader(),
    );

    render(
      <DefaultThemeProvider activeColorScheme="light">
        <Component name={'testIllustration' as never} testID="test-illo" />
      </DefaultThemeProvider>,
    );

    await waitFor(() => {
      const el = screen.getByTestId('test-illo');
      expect(el.tagName).toBe('SPAN');
    });

    const el = screen.getByTestId('test-illo');
    expect(el.style.width).toBe('96px');
    expect(el.style.height).toBe('96px');
  });

  it('keeps CDN img fallback when loading fails', async () => {
    const Component = createThemeableIllustration(
      'spotSquare',
      mockVersionMap,
      createFailingImportMapLoader(),
    );

    render(
      <DefaultThemeProvider activeColorScheme="light">
        <Component name={'testIllustration' as never} testID="test-illo" />
      </DefaultThemeProvider>,
    );

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    const el = screen.getByTestId('test-illo');
    expect(el.tagName).toBe('IMG');
  });

  it('renders fallback prop when name is not in version map', () => {
    const Component = createThemeableIllustration(
      'spotSquare',
      mockVersionMap,
      createMockImportMapLoader(),
    );

    render(
      <DefaultThemeProvider activeColorScheme="light">
        <Component
          fallback={<div data-testid="fallback">Fallback</div>}
          name={'unknown' as never}
          testID="test-illo"
        />
      </DefaultThemeProvider>,
    );

    expect(screen.getByTestId('fallback')).toBeTruthy();
  });

  it('uses dark CDN URL when dark theme is active', () => {
    const Component = createThemeableIllustration(
      'spotSquare',
      mockVersionMap,
      createMockImportMapLoader(),
    );

    render(
      <DefaultThemeProvider activeColorScheme="dark">
        <Component name={'testIllustration' as never} testID="test-illo" />
      </DefaultThemeProvider>,
    );

    const img = screen.getByTestId('test-illo');
    expect(img).toHaveAttribute(
      'src',
      'https://static-assets.coinbase.com/ui-infra/illustration/v1/spotSquare/svg/dark/testIllustration-1.svg',
    );
  });
});
