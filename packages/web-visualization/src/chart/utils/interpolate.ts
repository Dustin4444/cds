// Command types for SVG path commands
type CommandType = 'M' | 'L' | 'H' | 'V' | 'C' | 'S' | 'Q' | 'T' | 'A' | 'Z';
type CommandTypeLower = Lowercase<CommandType>;
type AnyCommandType = CommandType | CommandTypeLower;

type BaseCommand = {
  type: AnyCommandType;
};

type MoveCommand = BaseCommand & {
  type: 'M' | 'm';
  x: number;
  y: number;
};

type LineCommand = BaseCommand & {
  type: 'L' | 'l';
  x: number;
  y: number;
};

type HorizontalLineCommand = BaseCommand & {
  type: 'H' | 'h';
  x: number;
};

type VerticalLineCommand = BaseCommand & {
  type: 'V' | 'v';
  y: number;
};

type CubicBezierCommand = BaseCommand & {
  type: 'C' | 'c';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x: number;
  y: number;
};

type SmoothCubicBezierCommand = BaseCommand & {
  type: 'S' | 's';
  x2: number;
  y2: number;
  x: number;
  y: number;
};

type QuadraticBezierCommand = BaseCommand & {
  type: 'Q' | 'q';
  x1: number;
  y1: number;
  x: number;
  y: number;
};

type SmoothQuadraticBezierCommand = BaseCommand & {
  type: 'T' | 't';
  x: number;
  y: number;
};

type ArcCommand = BaseCommand & {
  type: 'A' | 'a';
  rx: number;
  ry: number;
  xAxisRotation: number;
  largeArcFlag: number;
  sweepFlag: number;
  x: number;
  y: number;
};

type ClosePathCommand = BaseCommand & {
  type: 'Z' | 'z';
};

type PathCommand =
  | MoveCommand
  | LineCommand
  | HorizontalLineCommand
  | VerticalLineCommand
  | CubicBezierCommand
  | SmoothCubicBezierCommand
  | QuadraticBezierCommand
  | SmoothQuadraticBezierCommand
  | ArcCommand
  | ClosePathCommand;

// Generic command type for internal operations where we may have partial commands
type GenericCommand = {
  type: AnyCommandType;
  x?: number;
  y?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  rx?: number;
  ry?: number;
  xAxisRotation?: number;
  largeArcFlag?: number;
  sweepFlag?: number;
};

type PathPoint = [number, number];

type InterpolateOptions = {
  excludeSegment?: (command1: GenericCommand, command2: GenericCommand) => boolean;
  snapEndsToInput?: boolean;
};

type ExcludeSegmentFn = (command1: GenericCommand, command2: GenericCommand) => boolean;

type DecasteljauResult = {
  left: PathPoint[];
  right: PathPoint[];
};

const commandTokenRegex = /[MLCSTQAHVZmlcstqahv]|-?[\d.e+-]+/g;

/**
 * List of params for each command type in a path `d` attribute
 */
const typeMap: Record<string, string[]> = {
  M: ['x', 'y'],
  L: ['x', 'y'],
  H: ['x'],
  V: ['y'],
  C: ['x1', 'y1', 'x2', 'y2', 'x', 'y'],
  S: ['x2', 'y2', 'x', 'y'],
  Q: ['x1', 'y1', 'x', 'y'],
  T: ['x', 'y'],
  A: ['rx', 'ry', 'xAxisRotation', 'largeArcFlag', 'sweepFlag', 'x', 'y'],
  Z: [],
};

// Add lower case entries too matching uppercase (e.g. 'm' == 'M')
Object.keys(typeMap).forEach((key) => {
  typeMap[key.toLowerCase()] = typeMap[key];
});

function arrayOfLength<T>(length: number, value?: T): T[] {
  const array = Array(length) as T[];
  for (let i = 0; i < length; i++) {
    array[i] = value as T;
  }

  return array;
}

/**
 * Converts a command object to a string to be used in a `d` attribute
 * @param command A command object
 * @return The string for the `d` attribute
 */
function commandToString(command: GenericCommand): string {
  return `${command.type}${typeMap[command.type].map((p) => command[p as keyof GenericCommand]).join(',')}`;
}

/**
 * Compares two commands for equality (same type and same coordinate values)
 * @param a First command
 * @param b Second command
 * @return True if the commands are equal
 */
function commandsEqual(a: GenericCommand, b: GenericCommand): boolean {
  if (a.type !== b.type) return false;
  const args = typeMap[a.type];
  for (const arg of args) {
    if (a[arg as keyof GenericCommand] !== b[arg as keyof GenericCommand]) {
      return false;
    }
  }
  return true;
}

/**
 * Finds the number of identical commands at the start of both arrays
 */
function findIdenticalPrefixLength(a: GenericCommand[], b: GenericCommand[]): number {
  const minLen = Math.min(a.length, b.length);
  let count = 0;
  for (let i = 0; i < minLen; i++) {
    if (commandsEqual(a[i], b[i])) {
      count++;
    } else {
      break;
    }
  }
  return count;
}

/**
 * Finds the number of identical commands at the end of both arrays
 */
function findIdenticalSuffixLength(a: GenericCommand[], b: GenericCommand[]): number {
  const minLen = Math.min(a.length, b.length);
  let count = 0;
  for (let i = 0; i < minLen; i++) {
    if (commandsEqual(a[a.length - 1 - i], b[b.length - 1 - i])) {
      count++;
    } else {
      break;
    }
  }
  return count;
}

/**
 * Converts command A to have the same type as command B.
 *
 * e.g., L0,5 -> C0,5,0,5,0,5
 *
 * Uses these rules:
 * x1 <- x
 * x2 <- x
 * y1 <- y
 * y2 <- y
 * rx <- 0
 * ry <- 0
 * xAxisRotation <- read from B
 * largeArcFlag <- read from B
 * sweepflag <- read from B
 *
 * @param aCommand Command object from path `d` attribute
 * @param bCommand Command object from path `d` attribute to match against
 * @return aCommand converted to type of bCommand
 */
function convertToSameType(aCommand: GenericCommand, bCommand: GenericCommand): GenericCommand {
  const conversionMap: Record<string, string> = {
    x1: 'x',
    y1: 'y',
    x2: 'x',
    y2: 'y',
  };

  const readFromBKeys = ['xAxisRotation', 'largeArcFlag', 'sweepFlag'];

  // convert (but ignore M types)
  if (aCommand.type !== bCommand.type && bCommand.type.toUpperCase() !== 'M') {
    const aConverted: GenericCommand = { type: bCommand.type };
    Object.keys(bCommand).forEach((bKey) => {
      const bValue = bCommand[bKey as keyof GenericCommand];
      // first read from the A command
      let aValue = aCommand[bKey as keyof GenericCommand];

      // if it is one of these values, read from B no matter what
      if (aValue === undefined) {
        if (readFromBKeys.includes(bKey)) {
          aValue = bValue;
        } else {
          // if it wasn't in the A command, see if an equivalent was
          if (aValue === undefined && conversionMap[bKey]) {
            aValue = aCommand[conversionMap[bKey] as keyof GenericCommand];
          }

          // if it doesn't have a converted value, use 0
          if (aValue === undefined) {
            aValue = 0;
          }
        }
      }

      (aConverted as Record<string, unknown>)[bKey] = aValue;
    });

    // update the type to match B
    aConverted.type = bCommand.type;
    return aConverted;
  }

  return aCommand;
}

/**
 * Interpolate between command objects commandStart and commandEnd segmentCount times.
 * If the types are L, Q, or C then the curves are split as per de Casteljau's algorithm.
 * Otherwise we just copy commandStart segmentCount - 1 times, finally ending with commandEnd.
 *
 * @param commandStart Command object at the beginning of the segment
 * @param commandEnd Command object at the end of the segment
 * @param segmentCount The number of segments to split this into. If only 1
 *   Then [commandEnd] is returned.
 * @return Array of ~segmentCount command objects between commandStart and
 *   commandEnd. (Can be segmentCount+1 objects if commandStart is type M).
 */
function splitSegment(
  commandStart: GenericCommand,
  commandEnd: GenericCommand,
  segmentCount: number,
): GenericCommand[] {
  let segments: GenericCommand[] = [];

  // line, quadratic bezier, or cubic bezier
  if (commandEnd.type === 'L' || commandEnd.type === 'Q' || commandEnd.type === 'C') {
    segments = segments.concat(splitCurve(commandStart, commandEnd, segmentCount));

    // general case - just copy the same point
  } else {
    const copyCommand = { ...commandStart };

    // convert M to L
    if (copyCommand.type === 'M') {
      copyCommand.type = 'L';
    }

    segments = segments.concat(arrayOfLength(segmentCount - 1).map(() => copyCommand));
    segments.push(commandEnd);
  }

  return segments;
}

/**
 * Extends an array of commandsToExtend to the length of the referenceCommands by
 * splitting segments until the number of commands match. Ensures all the actual
 * points of commandsToExtend are in the extended array.
 *
 * This function preserves identical prefix and suffix commands between the two arrays,
 * only distributing extra points into the "different" middle section.
 *
 * @param commandsToExtend The command object array to extend
 * @param referenceCommands The command object array to match in length
 * @param excludeSegment a function that takes a start command object and
 *   end command object and returns true if the segment should be excluded from splitting.
 * @return The extended commandsToExtend array
 */
function extend(
  commandsToExtend: GenericCommand[],
  referenceCommands: GenericCommand[],
  excludeSegment?: ExcludeSegmentFn,
): GenericCommand[] {
  // Find identical prefix and suffix to preserve them
  const identicalPrefixLen = findIdenticalPrefixLength(commandsToExtend, referenceCommands);
  const identicalSuffixLen = findIdenticalSuffixLength(commandsToExtend, referenceCommands);

  // Make sure prefix + suffix don't overlap
  const maxPreserved = Math.min(
    identicalPrefixLen + identicalSuffixLen,
    commandsToExtend.length - 1, // Need at least one segment to extend
  );

  // Adjust suffix if there's overlap
  const effectiveSuffixLen = Math.max(
    0,
    Math.min(identicalSuffixLen, maxPreserved - identicalPrefixLen),
  );
  const effectivePrefixLen = Math.min(identicalPrefixLen, maxPreserved);

  // Extract the parts
  const prefix = commandsToExtend.slice(0, effectivePrefixLen);
  const suffix = effectiveSuffixLen > 0 ? commandsToExtend.slice(-effectiveSuffixLen) : [];
  const middleToExtend = commandsToExtend.slice(
    effectivePrefixLen,
    commandsToExtend.length - effectiveSuffixLen,
  );

  // Calculate how many commands the middle section needs
  const targetMiddleLen = referenceCommands.length - effectivePrefixLen - effectiveSuffixLen;

  // If the middle section is already the right length or empty, just concatenate
  if (middleToExtend.length === 0 || middleToExtend.length >= targetMiddleLen) {
    return [...prefix, ...middleToExtend, ...suffix];
  }

  // Now extend only the middle section
  const numSegmentsToExtend = middleToExtend.length - 1;
  const numTargetSegments = targetMiddleLen - 1;

  // this value is always between [0, 1].
  const segmentRatio = numSegmentsToExtend / numTargetSegments;

  // create a map, mapping segments in target to how many points
  // should be added in that segment of the source
  const countPointsPerSegment = arrayOfLength<number>(numTargetSegments).reduce(
    (accum: number[], _d, i) => {
      let insertIndex = Math.floor(segmentRatio * i);

      // handle excluding segments
      if (
        excludeSegment &&
        insertIndex < middleToExtend.length - 1 &&
        excludeSegment(middleToExtend[insertIndex], middleToExtend[insertIndex + 1])
      ) {
        const addToPriorSegment = (segmentRatio * i) % 1 < 0.5;

        if (accum[insertIndex]) {
          if (addToPriorSegment) {
            if (insertIndex > 0) {
              insertIndex -= 1;
            } else if (insertIndex < middleToExtend.length - 1) {
              insertIndex += 1;
            }
          } else if (insertIndex < middleToExtend.length - 1) {
            insertIndex += 1;
          } else if (insertIndex > 0) {
            insertIndex -= 1;
          }
        }
      }

      accum[insertIndex] = (accum[insertIndex] || 0) + 1;

      return accum;
    },
    [],
  );

  // extend each segment in the middle section
  const extendedMiddle = countPointsPerSegment.reduce(
    (extendedCommands: GenericCommand[], segmentCount: number, i: number) => {
      // if last command in middle section, just add `segmentCount` number of times
      if (i === middleToExtend.length - 1) {
        const lastCommandCopies = arrayOfLength(segmentCount, {
          ...middleToExtend[middleToExtend.length - 1],
        });

        // convert M to L
        if (lastCommandCopies[0].type === 'M') {
          lastCommandCopies.forEach((d) => {
            d.type = 'L';
          });
        }
        return extendedCommands.concat(lastCommandCopies);
      }

      // otherwise, split the segment segmentCount times.
      return extendedCommands.concat(
        splitSegment(middleToExtend[i], middleToExtend[i + 1], segmentCount),
      );
    },
    [],
  );

  // add in the very first point of middle since splitSegment only adds in the ones after it
  extendedMiddle.unshift(middleToExtend[0]);

  // Concatenate: prefix + extended middle + suffix
  return [...prefix, ...extendedMiddle, ...suffix];
}

/**
 * Takes a path `d` string and converts it into an array of command
 * objects. Drops the `Z` character.
 *
 * @param d A path `d` string
 */
export function pathCommandsFromString(d: string | null | undefined): GenericCommand[] {
  // split into valid tokens
  const tokens = (d || '').match(commandTokenRegex) || [];
  const commands: GenericCommand[] = [];
  let commandArgs: string[] | undefined;
  let command: GenericCommand;

  // iterate over each token, checking if we are at a new command
  // by presence in the typeMap
  for (let i = 0; i < tokens.length; ++i) {
    commandArgs = typeMap[tokens[i]];

    // new command found:
    if (commandArgs) {
      command = {
        type: tokens[i] as AnyCommandType,
      };

      // add each of the expected args for this command:
      for (let a = 0; a < commandArgs.length; ++a) {
        (command as Record<string, unknown>)[commandArgs[a]] = +tokens[i + a + 1];
      }

      // need to increment our token index appropriately since
      // we consumed token args
      i += commandArgs.length;

      commands.push(command);
    }
  }
  return commands;
}

export type PathCommandInterpolator = (t: number) => GenericCommand[];

/**
 * Interpolate from A to B by extending A and B during interpolation to have
 * the same number of points. This allows for a smooth transition when they
 * have a different number of points.
 *
 * Ignores the `Z` command in paths unless both A and B end with it.
 *
 * This function works directly with arrays of command objects instead of with
 * path `d` strings (see interpolatePath for working with `d` strings).
 *
 * @param aCommandsInput Array of path commands
 * @param bCommandsInput Array of path commands
 * @param interpolateOptions
 * @returns Interpolation function that maps t ([0, 1]) to an array of path commands.
 */
export function interpolatePathCommands(
  aCommandsInput: GenericCommand[] | null | undefined,
  bCommandsInput: GenericCommand[] | null | undefined,
  interpolateOptions?: ExcludeSegmentFn | InterpolateOptions,
): PathCommandInterpolator {
  // make a copy so we don't mess with the input arrays
  let aCommands = aCommandsInput == null ? [] : aCommandsInput.slice();
  let bCommands = bCommandsInput == null ? [] : bCommandsInput.slice();

  const { excludeSegment, snapEndsToInput } =
    typeof interpolateOptions === 'object'
      ? interpolateOptions
      : {
          excludeSegment: interpolateOptions,
          snapEndsToInput: true,
        };

  // both input sets are empty, so we don't interpolate
  if (!aCommands.length && !bCommands.length) {
    return function nullInterpolator(): GenericCommand[] {
      return [];
    };
  }

  // do we add Z during interpolation? yes if both have it. (we'd expect both to have it or not)
  const addZ =
    (aCommands.length === 0 || aCommands[aCommands.length - 1].type === 'Z') &&
    (bCommands.length === 0 || bCommands[bCommands.length - 1].type === 'Z');

  // we temporarily remove Z
  if (aCommands.length > 0 && aCommands[aCommands.length - 1].type === 'Z') {
    aCommands.pop();
  }
  if (bCommands.length > 0 && bCommands[bCommands.length - 1].type === 'Z') {
    bCommands.pop();
  }

  // if A is empty, treat it as if it used to contain just the first point
  // of B. This makes it so the line extends out of from that first point.
  if (!aCommands.length) {
    aCommands.push(bCommands[0]);

    // otherwise if B is empty, treat it as if it contains the first point
    // of A. This makes it so the line retracts into the first point.
  } else if (!bCommands.length) {
    bCommands.push(aCommands[0]);
  }

  // extend to match equal size
  const numPointsToExtend = Math.abs(bCommands.length - aCommands.length);

  if (numPointsToExtend !== 0) {
    // B has more points than A, so add points to A before interpolating
    if (bCommands.length > aCommands.length) {
      aCommands = extend(aCommands, bCommands, excludeSegment);

      // else if A has more points than B, add more points to B
    } else if (bCommands.length < aCommands.length) {
      bCommands = extend(bCommands, aCommands, excludeSegment);
    }
  }

  // commands have same length now.
  // convert commands in A to the same type as those in B
  aCommands = aCommands.map((aCommand, i) => convertToSameType(aCommand, bCommands[i]));

  // create mutable interpolated command objects
  const interpolatedCommands = aCommands.map((aCommand) => ({ ...aCommand }));

  if (addZ) {
    interpolatedCommands.push({ type: 'Z' });
    aCommands.push({ type: 'Z' }); // required for when returning at t == 0
  }

  return function pathCommandInterpolator(t: number): GenericCommand[] {
    // at 1 return the final value without the extensions used during interpolation
    if (t === 1 && snapEndsToInput) {
      return bCommandsInput == null ? [] : bCommandsInput;
    }

    // at 0 return the original input without extensions (symmetric with t=1)
    if (t === 0 && snapEndsToInput) {
      return aCommandsInput == null ? [] : aCommandsInput;
    }

    // interpolate the commands using the mutable interpolated command objs
    for (let i = 0; i < interpolatedCommands.length; ++i) {
      const aCommand = aCommands[i];
      const bCommand = bCommands[i];
      const interpolatedCommand = interpolatedCommands[i];
      for (const arg of typeMap[interpolatedCommand.type]) {
        const aVal = aCommand[arg as keyof GenericCommand] as number;
        const bVal = bCommand[arg as keyof GenericCommand] as number;
        let interpolatedVal = (1 - t) * aVal + t * bVal;

        // do not use floats for flags (#27), round to integer
        if (arg === 'largeArcFlag' || arg === 'sweepFlag') {
          interpolatedVal = Math.round(interpolatedVal);
        }

        (interpolatedCommand as Record<string, unknown>)[arg] = interpolatedVal;
      }
    }

    return interpolatedCommands;
  };
}

export type PathStringInterpolator = (t: number) => string;

/**
 * Interpolate from A to B by extending A and B during interpolation to have
 * the same number of points. This allows for a smooth transition when they
 * have a different number of points.
 *
 * Ignores the `Z` character in paths unless both A and B end with it.
 *
 * @param a The `d` attribute for a path
 * @param b The `d` attribute for a path
 * @param interpolateOptions The excludeSegment function or an options object
 *    - interpolateOptions.excludeSegment a function that takes a start command object and
 *      end command object and returns true if the segment should be excluded from splitting.
 *    - interpolateOptions.snapEndsToInput a boolean indicating whether end of input should
 *      be sourced from input argument or computed.
 * @returns Interpolation function that maps t ([0, 1]) to a path `d` string.
 */
export function interpolatePath(
  a: string | null | undefined,
  b: string | null | undefined,
  interpolateOptions?: ExcludeSegmentFn | InterpolateOptions,
): PathStringInterpolator {
  const aCommands = pathCommandsFromString(a);
  const bCommands = pathCommandsFromString(b);

  const { excludeSegment, snapEndsToInput } =
    typeof interpolateOptions === 'object'
      ? interpolateOptions
      : {
          excludeSegment: interpolateOptions,
          snapEndsToInput: true,
        };

  if (!aCommands.length && !bCommands.length) {
    return function nullInterpolator(): string {
      return '';
    };
  }

  const commandInterpolator = interpolatePathCommands(aCommands, bCommands, {
    excludeSegment,
    snapEndsToInput,
  });

  return function pathStringInterpolator(t: number): string {
    // at 1 return the final value without the extensions used during interpolation
    if (t === 1 && snapEndsToInput) {
      return b == null ? '' : b;
    }

    const interpolatedCommands = commandInterpolator(t);

    // convert to a string (fastest concat: https://jsperf.com/join-concat/150)
    let interpolatedString = '';
    for (const interpolatedCommand of interpolatedCommands) {
      interpolatedString += commandToString(interpolatedCommand);
    }

    return interpolatedString;
  };
}

/**
 * de Casteljau's algorithm for drawing and splitting bezier curves.
 * Inspired by https://pomax.github.io/bezierinfo/
 *
 * @param points Array of [x,y] points: [start, control1, control2, ..., end]
 *   The original segment to split.
 * @param t Where to split the curve (value between [0, 1])
 * @return An object { left, right } where left is the segment from 0..t and
 *   right is the segment from t..1.
 */
function decasteljau(points: PathPoint[], t: number): DecasteljauResult {
  const left: PathPoint[] = [];
  const right: PathPoint[] = [];

  function decasteljauRecurse(points: PathPoint[], t: number): void {
    if (points.length === 1) {
      left.push(points[0]);
      right.push(points[0]);
    } else {
      const newPoints: PathPoint[] = Array(points.length - 1);

      for (let i = 0; i < newPoints.length; i++) {
        if (i === 0) {
          left.push(points[0]);
        }
        if (i === newPoints.length - 1) {
          right.push(points[i + 1]);
        }

        newPoints[i] = [
          (1 - t) * points[i][0] + t * points[i + 1][0],
          (1 - t) * points[i][1] + t * points[i + 1][1],
        ];
      }

      decasteljauRecurse(newPoints, t);
    }
  }

  if (points.length) {
    decasteljauRecurse(points, t);
  }

  return { left, right: right.reverse() };
}

/**
 * Convert segments represented as points back into a command object
 *
 * @param points Array of [x,y] points: [start, control1, control2, ..., end]
 *   Represents a segment
 * @return A command object representing the segment.
 */
function pointsToCommand(points: PathPoint[]): GenericCommand {
  const command: GenericCommand = { type: 'L' };

  if (points.length === 4) {
    command.x2 = points[2][0];
    command.y2 = points[2][1];
  }
  if (points.length >= 3) {
    command.x1 = points[1][0];
    command.y1 = points[1][1];
  }

  command.x = points[points.length - 1][0];
  command.y = points[points.length - 1][1];

  if (points.length === 4) {
    // start, control1, control2, end
    command.type = 'C';
  } else if (points.length === 3) {
    // start, control, end
    command.type = 'Q';
  } else {
    // start, end
    command.type = 'L';
  }

  return command;
}

/**
 * Runs de Casteljau's algorithm enough times to produce the desired number of segments.
 *
 * @param points Array of [x,y] points for de Casteljau (the initial segment to split)
 * @param segmentCount Number of segments to split the original into
 * @return Array of segments
 */
function splitCurveAsPoints(points: PathPoint[], segmentCount: number = 2): PathPoint[][] {
  const segments: PathPoint[][] = [];
  let remainingCurve = points;
  const tIncrement = 1 / segmentCount;

  // x-----x-----x-----x
  // t=  0.33   0.66   1
  // x-----o-----------x
  // r=  0.33
  //       x-----o-----x
  // r=         0.5  (0.33 / (1 - 0.33))  === tIncrement / (1 - (tIncrement * (i - 1))

  // x-----x-----x-----x----x
  // t=  0.25   0.5   0.75  1
  // x-----o----------------x
  // r=  0.25
  //       x-----o----------x
  // r=         0.33  (0.25 / (1 - 0.25))
  //             x-----o----x
  // r=         0.5  (0.25 / (1 - 0.5))

  for (let i = 0; i < segmentCount - 1; i++) {
    const tRelative = tIncrement / (1 - tIncrement * i);
    const split = decasteljau(remainingCurve, tRelative);
    segments.push(split.left);
    remainingCurve = split.right;
  }

  // last segment is just to the end from the last point
  segments.push(remainingCurve);

  return segments;
}

/**
 * Convert command objects to arrays of points, run de Casteljau's algorithm on it
 * to split into to the desired number of segments.
 *
 * @param commandStart The start command object
 * @param commandEnd The end command object
 * @param segmentCount The number of segments to create
 * @return An array of commands representing the segments in sequence
 */
function splitCurve(
  commandStart: GenericCommand,
  commandEnd: GenericCommand,
  segmentCount: number,
): GenericCommand[] {
  const points: PathPoint[] = [[commandStart.x!, commandStart.y!]];
  if (commandEnd.x1 != null) {
    points.push([commandEnd.x1, commandEnd.y1!]);
  }
  if (commandEnd.x2 != null) {
    points.push([commandEnd.x2, commandEnd.y2!]);
  }
  points.push([commandEnd.x!, commandEnd.y!]);

  return splitCurveAsPoints(points, segmentCount).map(pointsToCommand);
}

// Re-export types for consumers
export type { GenericCommand, InterpolateOptions, PathCommand, PathPoint };
