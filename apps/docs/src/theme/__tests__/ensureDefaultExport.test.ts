import { ensureDefaultExport } from '../Playground/CodePlaygroundExport';

describe('ensureDefaultExport', () => {
  describe('already has export default', () => {
    it('leaves code with export default function untouched', () => {
      const code = `export default function App() {
  return <div>Hello</div>;
}`;
      expect(ensureDefaultExport(code)).toBe(code);
    });

    it('leaves code with export default const untouched', () => {
      const code = `const App = () => <div />;
export default App;`;
      expect(ensureDefaultExport(code)).toBe(code);
    });

    it('leaves code with inline export default untouched', () => {
      const code = `export default () => <div>Hello</div>;`;
      expect(ensureDefaultExport(code)).toBe(code);
    });
  });

  describe('named function without export default', () => {
    it('adds export default to a named function', () => {
      const code = `function MonotoneAssetPrice() {
  return <div>Chart</div>;
}`;
      const result = ensureDefaultExport(code);
      expect(result).toContain('export default function MonotoneAssetPrice()');
      expect(result).not.toMatch(/^function\s/);
    });

    it('adds export default to a function with parameters', () => {
      const code = `function DynamicChartSizing() {
  const prices = [1, 2, 3];
  return <LineChart series={[{ data: prices }]} />;
}`;
      const result = ensureDefaultExport(code);
      expect(result).toContain('export default function DynamicChartSizing()');
    });

    it('does not add export default to lowercase function names', () => {
      // lowercase functions are helpers, not components
      const code = `function formatPrice(price) { return price.toFixed(2); }`;
      const result = ensureDefaultExport(code);
      // Should fall through to the bare expression handler since it doesn't
      // match the `^function\s+([A-Z]` pattern
      expect(result).not.toContain('export default function formatPrice');
    });
  });

  describe('named const component without export default', () => {
    it('appends export default for const component', () => {
      const code = `const MyComponent = () => {
  return <div>Hello</div>;
};`;
      const result = ensureDefaultExport(code);
      expect(result).toContain('export default MyComponent;');
      // Original code should still be there
      expect(result).toContain('const MyComponent = () => {');
    });

    it('appends export default for const with memo', () => {
      const code = `const MyChart = memo(function MyChart() {
  return <LineChart />;
});`;
      const result = ensureDefaultExport(code);
      expect(result).toContain('export default MyChart;');
    });
  });

  describe('bare JSX expressions', () => {
    it('wraps bare JSX in an export default function', () => {
      const code = `<Button>Click Me</Button>`;
      const result = ensureDefaultExport(code);
      expect(result).toContain('export default function App()');
      expect(result).toContain('return (');
      expect(result).toContain('<Button>Click Me</Button>');
    });

    it('wraps multi-line bare JSX', () => {
      const code = `<VStack>
  <Text>Hello</Text>
  <Button>Click</Button>
</VStack>`;
      const result = ensureDefaultExport(code);
      expect(result).toContain('export default function App()');
      expect(result).toContain('<VStack>');
    });
  });

  describe('code with existing imports', () => {
    it('leaves code with import + export default untouched', () => {
      const code = `import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}`;
      expect(ensureDefaultExport(code)).toBe(code);
    });
  });
});
