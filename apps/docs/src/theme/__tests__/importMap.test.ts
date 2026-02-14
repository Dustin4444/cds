import { generateImports, isDeclaredLocally } from '../importMap';

describe('isDeclaredLocally', () => {
  describe('const/let/var declarations', () => {
    it('detects const declaration', () => {
      expect(isDeclaredLocally('prices', 'const prices = [1, 2, 3];')).toBe(true);
    });

    it('detects let declaration', () => {
      expect(isDeclaredLocally('prices', 'let prices = [];')).toBe(true);
    });

    it('detects var declaration', () => {
      expect(isDeclaredLocally('prices', 'var prices = getData();')).toBe(true);
    });

    it('does not match partial variable names', () => {
      expect(isDeclaredLocally('prices', 'const formattedPrices = [];')).toBe(false);
    });

    it('detects reassignment-style declarations', () => {
      expect(isDeclaredLocally('prices', 'const prices = sparklineInteractiveData.hour;')).toBe(
        true,
      );
    });
  });

  describe('function declarations', () => {
    it('detects named function declaration', () => {
      expect(isDeclaredLocally('formatPrice', 'function formatPrice(price) {}')).toBe(true);
    });

    it('does not match function calls', () => {
      expect(isDeclaredLocally('formatPrice', 'const x = formatPrice(100);')).toBe(false);
    });
  });

  describe('destructuring in declarations', () => {
    it('detects destructured const', () => {
      expect(isDeclaredLocally('title', 'const { title, description } = props;')).toBe(true);
    });

    it('detects destructured let', () => {
      expect(isDeclaredLocally('name', 'let { name } = user;')).toBe(true);
    });
  });

  describe('destructuring in function parameters', () => {
    it('detects destructured function param', () => {
      const code = 'function DetailCell({ title, description }: Props) {}';
      expect(isDeclaredLocally('title', code)).toBe(true);
      expect(isDeclaredLocally('description', code)).toBe(true);
    });

    it('detects destructured arrow function param', () => {
      const code = 'const DetailCell = ({ title, description }: Props) => {}';
      expect(isDeclaredLocally('title', code)).toBe(true);
    });
  });

  describe('does NOT false-positive on JSX/function bodies', () => {
    it('does not match JSX component usage inside function body', () => {
      const code = `function App() {
        return (
          <VStack gap={1}>
            <Text font="title1">Hello</Text>
            <HStack>
              <LineChart series={[]} />
            </HStack>
          </VStack>
        );
      }`;
      expect(isDeclaredLocally('VStack', code)).toBe(false);
      expect(isDeclaredLocally('Text', code)).toBe(false);
      expect(isDeclaredLocally('HStack', code)).toBe(false);
      expect(isDeclaredLocally('LineChart', code)).toBe(false);
    });

    it('does not match identifiers used in JSX props', () => {
      const code = `function App() {
        return <LineChart height={{ base: 200 }} series={[{ id: 'btc', data: prices }]} />;
      }`;
      expect(isDeclaredLocally('LineChart', code)).toBe(false);
    });

    it('does not match identifiers in object literals', () => {
      const code = `const config = {
        series: [{ id: 'btc', data: prices, color: 'white' }],
      };`;
      // 'prices' is used inside an object literal, NOT declared
      expect(isDeclaredLocally('LineChart', code)).toBe(false);
    });

    it('does not match component names used as JSX tags even with object props', () => {
      const code = `function DynamicChart() {
        return (
          <VStack display={{ base: 'none', tablet: 'flex' }} gap={1}>
            <Text font="headline">BTC</Text>
          </VStack>
        );
      }`;
      expect(isDeclaredLocally('VStack', code)).toBe(false);
      expect(isDeclaredLocally('Text', code)).toBe(false);
    });
  });

  describe('mixed scenarios (the DynamicChartSizing case)', () => {
    const dynamicChartCode = `function DynamicChartSizing() {
  const candles = [...btcCandles].reverse();
  const prices = candles.map((candle) => parseFloat(candle.close));
  const highs = candles.map((candle) => parseFloat(candle.high));
  const lows = candles.map((candle) => parseFloat(candle.low));

  function DetailCell({ title, description }: { title: string; description: string }) {
    return (
      <VStack>
        <Text color="fgMuted" font="label2">{title}</Text>
        <Text font="headline">{description}</Text>
      </VStack>
    );
  }

  return (
    <HStack gap={3}>
      <Box flexGrow={1}>
        <LineChart series={[{ id: 'btc', data: prices, color: 'white' }]} />
      </Box>
      <VStack gap={1}>
        <Text font="title1">BTC</Text>
      </VStack>
    </HStack>
  );
}`;

    it('detects locally declared variables', () => {
      expect(isDeclaredLocally('candles', dynamicChartCode)).toBe(true);
      expect(isDeclaredLocally('prices', dynamicChartCode)).toBe(true);
      expect(isDeclaredLocally('highs', dynamicChartCode)).toBe(true);
      expect(isDeclaredLocally('lows', dynamicChartCode)).toBe(true);
    });

    it('detects locally declared functions', () => {
      expect(isDeclaredLocally('DetailCell', dynamicChartCode)).toBe(true);
    });

    it('detects destructured function params', () => {
      expect(isDeclaredLocally('title', dynamicChartCode)).toBe(true);
      expect(isDeclaredLocally('description', dynamicChartCode)).toBe(true);
    });

    it('does NOT falsely detect JSX components as local', () => {
      expect(isDeclaredLocally('VStack', dynamicChartCode)).toBe(false);
      expect(isDeclaredLocally('Text', dynamicChartCode)).toBe(false);
      expect(isDeclaredLocally('HStack', dynamicChartCode)).toBe(false);
      expect(isDeclaredLocally('Box', dynamicChartCode)).toBe(false);
      expect(isDeclaredLocally('LineChart', dynamicChartCode)).toBe(false);
    });

    it('does NOT falsely detect external data references as local', () => {
      expect(isDeclaredLocally('btcCandles', dynamicChartCode)).toBe(false);
    });
  });
});

describe('generateImports', () => {
  it('generates imports for React hooks', () => {
    const code = `function App() {
      const [count, setCount] = useState(0);
      const handler = useCallback(() => {}, []);
      return <div>{count}</div>;
    }`;
    const result = generateImports(code);
    expect(result).toContain("import { useCallback, useState } from 'react';");
  });

  it('generates imports for CDS web components', () => {
    const code = `function App() {
      return (
        <VStack>
          <Button>Click</Button>
          <Text font="body">Hello</Text>
        </VStack>
      );
    }`;
    const result = generateImports(code);
    expect(result).toContain("import { Button } from '@coinbase/cds-web/buttons';");
    expect(result).toContain("import { Text } from '@coinbase/cds-web/typography/Text';");
    expect(result).toContain("import { VStack } from '@coinbase/cds-web/layout/VStack';");
  });

  it('generates imports for visualization chart components', () => {
    const code = `function App() {
      return (
        <LineChart series={[]}>
          <Scrubber accessibilityLabel={() => ''} />
        </LineChart>
      );
    }`;
    const result = generateImports(code);
    expect(result).toContain(
      "import { LineChart, Scrubber } from '@coinbase/cds-web-visualization/chart';",
    );
  });

  it('skips identifiers that are declared locally as variables', () => {
    const code = `function App() {
      const prices = sparklineInteractiveData.hour;
      return <LineChart series={[{ data: prices.map(p => p.value) }]} />;
    }`;
    const result = generateImports(code);
    // prices is declared locally — should NOT be imported
    expect(result).not.toContain("'@coinbase/cds-common/internal/data/prices'");
    // sparklineInteractiveData is NOT declared locally — should be imported
    expect(result).toContain(
      "import { sparklineInteractiveData } from '@coinbase/cds-common/internal/visualizations/SparklineInteractiveData';",
    );
    // LineChart is NOT declared locally — should be imported
    expect(result).toContain("'@coinbase/cds-web-visualization/chart'");
  });

  it('generates aliased imports for btcCandles', () => {
    const code = `function App() {
      const data = [...btcCandles].reverse();
      return <LineChart series={[{ data }]} />;
    }`;
    const result = generateImports(code);
    expect(result).toContain(
      "import { candles as btcCandles } from '@coinbase/cds-common/internal/data/candles';",
    );
  });

  it('handles the full DynamicChartSizing example correctly', () => {
    const code = `function DynamicChartSizing() {
  const candles = [...btcCandles].reverse();
  const prices = candles.map((candle) => parseFloat(candle.close));

  function DetailCell({ title, description }: { title: string; description: string }) {
    return (
      <VStack>
        <Text color="fgMuted" font="label2">{title}</Text>
      </VStack>
    );
  }

  const formatPrice = useCallback((price: number) => {
    return price.toLocaleString();
  }, []);

  return (
    <HStack gap={3}>
      <Box flexGrow={1}>
        <LineChart series={[{ id: 'btc', data: prices, color: 'white' }]} />
      </Box>
      <VStack gap={1}>
        <Text font="title1">BTC</Text>
      </VStack>
    </HStack>
  );
}`;
    const result = generateImports(code);

    // Should import these components/hooks (NOT declared locally)
    expect(result).toContain("import { Box } from '@coinbase/cds-web/layout';");
    expect(result).toContain("import { HStack } from '@coinbase/cds-web/layout/HStack';");
    expect(result).toContain("import { VStack } from '@coinbase/cds-web/layout/VStack';");
    expect(result).toContain("import { Text } from '@coinbase/cds-web/typography/Text';");
    expect(result).toContain("import { LineChart } from '@coinbase/cds-web-visualization/chart';");
    expect(result).toContain("import { useCallback } from 'react';");
    expect(result).toContain(
      "import { candles as btcCandles } from '@coinbase/cds-common/internal/data/candles';",
    );

    // Should NOT import these (declared locally)
    expect(result).not.toContain("'@coinbase/cds-common/internal/data/prices'");
  });

  it('handles the MonotoneAssetPrice example correctly', () => {
    const code = `function MonotoneAssetPrice() {
  const prices = sparklineInteractiveData.hour;

  const formatPrice = useCallback(
    (price: number) => priceFormatter.format(price),
    [priceFormatter],
  );

  return (
    <LineChart enableScrubbing showYAxis series={[]}>
      <Scrubber hideOverlay BeaconComponent={InvertedBeacon} LineComponent={SolidLine} />
    </LineChart>
  );
}`;
    const result = generateImports(code);

    // Should import visualization components
    expect(result).toContain(
      "import { LineChart, Scrubber, SolidLine } from '@coinbase/cds-web-visualization/chart';",
    );
    expect(result).toContain(
      "import { sparklineInteractiveData } from '@coinbase/cds-common/internal/visualizations/SparklineInteractiveData';",
    );
    expect(result).toContain("import { useCallback } from 'react';");

    // Should NOT import 'prices' (locally declared)
    expect(result).not.toContain("'@coinbase/cds-common/internal/data/prices'");
  });
});
