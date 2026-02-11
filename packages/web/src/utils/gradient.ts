import { resolveGradientPreset } from '@coinbase/cds-common/gradients/presets';
import { resolveDirection } from '@coinbase/cds-common/gradients/utils';
import type {
  Gradient,
  GradientColorInput,
  LinearGradientConfig,
} from '@coinbase/cds-common/types/Gradient';
import { isGradientColorStop, isGradientPreset } from '@coinbase/cds-common/types/Gradient';

import type { Theme } from '../core/theme';

type ThemeGradient = Theme['gradient'];

/**
 * Resolves a gradient color input to a CSS color stop object.
 */
function resolveColorStop(colorInput: GradientColorInput): {
  color: string;
  offset?: number;
  opacity?: number;
} {
  if (isGradientColorStop(colorInput)) {
    return {
      color: colorInput.color,
      offset: colorInput.offset,
      opacity: colorInput.opacity,
    };
  }
  return { color: colorInput };
}

/**
 * Applies opacity to a color value.
 * Handles hex, rgb, rgba, and other color formats.
 */
function applyOpacity(color: string, opacity: number): string {
  // For hex colors
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const alphaHex = Math.round(opacity * 255)
      .toString(16)
      .padStart(2, '0');
    if (hex.length === 3) {
      return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}${alphaHex}`;
    }
    if (hex.length === 6) {
      return `#${hex}${alphaHex}`;
    }
    if (hex.length === 8) {
      return `#${hex.slice(0, 6)}${alphaHex}`;
    }
  }
  // For rgb colors
  if (color.startsWith('rgb(')) {
    const match = color.match(/rgb\(([^)]+)\)/);
    if (match) {
      return `rgba(${match[1]}, ${opacity})`;
    }
  }
  // For rgba colors, replace the alpha
  if (color.startsWith('rgba(')) {
    const match = color.match(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/);
    if (match) {
      return `rgba(${match[1]},${match[2]},${match[3]}, ${opacity})`;
    }
  }
  return color;
}

/**
 * Converts a LinearGradientConfig to a CSS linear-gradient string.
 */
export function linearGradientToCSS(config: LinearGradientConfig): string {
  const angle = resolveDirection(config.direction);

  const colorStops = config.colors.map((colorInput) => {
    const stop = resolveColorStop(colorInput);
    let colorValue = stop.color;

    if (stop.opacity !== undefined) {
      colorValue = applyOpacity(colorValue, stop.opacity);
    }

    if (stop.offset !== undefined) {
      return `${colorValue} ${stop.offset * 100}%`;
    }

    // If no offset is specified, colors are evenly distributed
    return colorValue;
  });

  return `linear-gradient(${angle}deg, ${colorStops.join(', ')})`;
}

/**
 * Converts a Gradient prop value to a CSS linear-gradient string.
 */
export function gradientToCSS(gradient: Gradient, themeGradient: ThemeGradient): string {
  const config = isGradientPreset(gradient)
    ? resolveGradientPreset(gradient, themeGradient)
    : gradient;

  return linearGradientToCSS(config);
}
