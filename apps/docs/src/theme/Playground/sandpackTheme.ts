/**
 * Custom Sandpack themes that match the Prism nightOwl (dark) and github (light)
 * syntax highlighting colors previously used by react-live.
 *
 * These are mapped from the prism-react-renderer theme definitions to
 * Sandpack's CodeMirror theme format.
 *
 * Note: font.size and font.mono use fixed values here because Sandpack
 * applies these as inline styles. The CSS module (.sandpackEditor) further
 * overrides CodeMirror's content styles with CDS design tokens.
 */
import type { SandpackTheme } from '@codesandbox/sandpack-react';

export const sandpackNightOwl: SandpackTheme = {
  colors: {
    surface1: '#011627',
    surface2: '#011627',
    surface3: '#1d3b53',
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
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    mono: '"CoinbaseMono", "Courier New", monospace',
    size: '13px',
    lineHeight: '1.6',
  },
};

export const sandpackGithubLight: SandpackTheme = {
  colors: {
    surface1: '#f6f8fa',
    surface2: '#f6f8fa',
    surface3: '#e1e4e8',
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
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    mono: '"CoinbaseMono", "Courier New", monospace',
    size: '13px',
    lineHeight: '1.6',
  },
};
