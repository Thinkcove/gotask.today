export const TIME_PERIODS = {
  AM: "AM",
  PM: "PM"
};

// Time formatting constants
export const TIME_FORMAT = {
  NOON_HOUR: 12,
  MINUTES_PER_HOUR: 60
};

// Time unit labels
export const TIME_UNITS = {
  DAY: "d",
  HOUR: "h"
};

// Time guide description
export const TIME_GUIDE_DESCRIPTION = {
  DAY: "d = day",
  HOUR: "h = hour"
};

export const TIME_FORMAT_PATTERNS = {
  // Pattern for validating duration format (e.g., "2d3h" or "2d3h45m")
  DURATION_FORMAT: /^-?\d+d\d+h(\d+m)?$/,
  // Pattern for parsing duration format (e.g., "2d3h" → "2d3h0m")
  DURATION_PARSE_FORMAT: /^(-?\d+)d(?:(\d+)h)?(?:(\d+)m)?$/,
  // Pattern for validating or parsing AM/PM time format (e.g., "9:01 AM")
  AMPM_TIME: /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
};
