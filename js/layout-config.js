// Shared mutable configuration for layout constants.
// Used by svg-renderer.js and svg-thumbnail.js at render time.
// The cell editor updates these via /api/save-layout.

export const DEFAULTS = Object.freeze({
  MARGIN_LEFT: 380,
  COL_WIDTH: 200,
  ROW_HEIGHT: 200,
  HEADER_HEIGHT: 54,
  STATS_COL_WIDTH: 44,
  SUMMARY_ROW_HEIGHT: 36,
  DIAMOND_R: 55,
  PITCH_COL_W: 66,
  PITCH_START_Y: 4,
  PITCH_STEP: 18,
  PITCH_FONT_SIZE: 16,
  SZ_WIDTH: 16,
  SZ_HEIGHT: 26,
  SUB_CIRCLE_POS: 0.08,    // Sub circle position (fraction of MARGIN_LEFT)
  SUB_TEXT_POS: 0.05,       // Sub player text position (fraction of MARGIN_LEFT)
  SUB_CIRCLE_R: 10,         // Sub circle radius
  SUB_LINE_W: 5,            // Sub indicator line width
  SUB_CIRCLE_VPOS: 0.75,    // Sub circle vertical position on play cell bar (fraction of ROW_HEIGHT)
});

export const THUMBNAIL_DEFAULTS = Object.freeze({
  TH_CELL_SIZE: 41,         // cell size (viewBox units)
  TH_DIAMOND_R: 11,         // diamond radius
  TH_PATH_STROKE_W: 2,      // base path stroke width
  TH_GRID_STROKE_W: 0.5,    // grid line stroke width
  TH_FONT_SIZE: 16,         // notation font size (no diamond)
  TH_FONT_SIZE_SM: 11,      // smaller font when diamond shown
  TH_DOT_R: 2.5,            // out dot radius
  TH_GAP: 12,               // gap between away/home grids
  TH_PAD: 3,                // inner cell padding
});

const config = { ...DEFAULTS };
const thumbnailConfig = { ...THUMBNAIL_DEFAULTS };

export function getConfig() {
  return config;
}

export function updateConfig(overrides) {
  Object.assign(config, overrides);
}

export function resetConfig() {
  Object.assign(config, DEFAULTS);
}

export function getThumbnailConfig() {
  return thumbnailConfig;
}

export function updateThumbnailConfig(overrides) {
  Object.assign(thumbnailConfig, overrides);
}

export function resetThumbnailConfig() {
  Object.assign(thumbnailConfig, THUMBNAIL_DEFAULTS);
}
