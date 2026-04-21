/**
 * Controls what aspects of the data can be highlighted.
 */
export type HighlightScope = {
  /**
   * Whether highlighting tracks data index (x-axis position).
   * @default true
   */
  dataIndex?: boolean;
  /**
   * Whether highlighting tracks specific series.
   * @default false
   */
  series?: boolean;
};

/**
 * Default highlight scope for cartesian charts.
 * Highlights by data index (x-axis position), not by series.
 */
export const defaultCartesianChartHighlightScope: HighlightScope = {
  dataIndex: true,
  series: false,
};

/**
 * Represents a single highlighted item during interaction.
 * - `null` values mean the user is interacting but not over a specific item/series
 */
export type HighlightedItem = {
  /**
   * The data index (x-axis position) being highlighted.
   * `null` when interacting but not over a data point.
   */
  dataIndex: number | null;
  /**
   * The series ID being highlighted.
   * `null` when series scope is disabled or not over a specific series.
   */
  seriesId: string | null;
};
