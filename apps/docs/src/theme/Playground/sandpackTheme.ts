import type { SandpackTheme } from '@codesandbox/sandpack-react';

const font: SandpackTheme['font'] = {
  body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  mono: 'Menlo, Consolas, monospace',
  size: '14px',
  lineHeight: '20.3px',
};

export const sandpackNightOwl: SandpackTheme = {
  colors: {
    surface1: 'var(--color-bg)',
    surface2: 'var(--color-bg)',
    surface3: 'var(--color-bg)',
    clickable: '#d6deeb',
    base: '#d6deeb',
    disabled: '#637777',
    hover: '#82aaff',
    accent: '#7fdbca',
    error: '#ff5874',
    errorSurface: '#011627',
  },
  syntax: {
    plain: '#d6deeb',
    comment: { color: '#637777', fontStyle: 'italic' },
    keyword: '#7fdbca',
    tag: '#7fdbca',
    punctuation: '#c792ea',
    definition: '#82aaff',
    property: '#80cbc4',
    static: '#f78c6c',
    string: '#addb67',
  },
  font,
};

export const sandpackGithubLight: SandpackTheme = {
  colors: {
    surface1: 'var(--color-bg)',
    surface2: 'var(--color-bg)',
    surface3: 'var(--color-bg)',
    clickable: '#393A34',
    base: '#393A34',
    disabled: '#999988',
    hover: '#00a4db',
    accent: '#00009f',
    error: '#d73a49',
    errorSurface: '#ffeef0',
  },
  syntax: {
    plain: '#393A34',
    comment: { color: '#999988', fontStyle: 'italic' },
    keyword: '#00009f',
    tag: '#00009f',
    punctuation: '#393A34',
    definition: '#d73a49',
    property: '#36acaa',
    static: '#36acaa',
    string: '#e3116c',
  },
  font,
};
