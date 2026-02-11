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
 * Applies opacity to a color by converting to rgba.
 */
function applyOpacity(color: string, opacity: number): string {
  // For hex colors
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    let r: number, g: number, b: number;

    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6 || hex.length === 8) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    } else {
      return color;
    }

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
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
 * Props for the LinearGradient component.
 */
export type LinearGradientProps = {
  angle: number;
  colors: string[];
  stops: number[];
};

/**
 * Converts a LinearGradientConfig to props for the LinearGradient component.
 */
export function linearGradientToProps(config: LinearGradientConfig): LinearGradientProps {
  const angle = resolveDirection(config.direction);

  const colors: string[] = [];
  const stops: number[] = [];
  const colorsCount = config.colors.length;

  config.colors.forEach((colorInput: GradientColorInput, index: number) => {
    let colorValue: string;
    let offset: number;

    if (isGradientColorStop(colorInput)) {
      colorValue = colorInput.color;
      if (colorInput.opacity !== undefined) {
        colorValue = applyOpacity(colorValue, colorInput.opacity);
      }
      offset = colorInput.offset ?? index / (colorsCount - 1);
    } else {
      colorValue = colorInput;
      offset = index / (colorsCount - 1);
    }

    colors.push(colorValue);
    stops.push(offset);
  });

  return { angle, colors, stops };
}

/**
 * Converts a Gradient prop value to props for the LinearGradient component.
 */
export function gradientToProps(
  gradient: Gradient,
  themeGradient: ThemeGradient,
): LinearGradientProps {
  const config = isGradientPreset(gradient)
    ? resolveGradientPreset(gradient, themeGradient)
    : gradient;

  return linearGradientToProps(config);
}
