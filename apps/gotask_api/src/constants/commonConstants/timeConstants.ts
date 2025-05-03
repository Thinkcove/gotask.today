export const TIME_PERIODS = {
  AM: "AM",
  PM: "PM"
};

// Time formatting constants
export const TIME_FORMAT = {
  NOON_HOUR: 12,
  MINUTES_PER_HOUR: 60
};

// Time format regex patterns
export const TIME_FORMAT_PATTERNS = {
  // For HH:MM or H:MM format (24-hour format)
  STANDARD_TIME: /^\d{1,2}:\d{2}$/,
  
  // For HH:MM AM/PM or H:MM AM/PM format (12-hour format)
  AMPM_TIME: /^\d{1,2}:\d{2} [APap][Mm]$/,
  
  // Combined pattern for either format
  ANY_TIME_FORMAT: /^\d{1,2}:\d{2}(?: [APap][Mm])?$/,
  
  // For parsing AM/PM time components
  AMPM_PARTS: /^(\d{1,2}):(\d{2}) ([APap][Mm])$/,
  
  // For day and hour format validation (e.g., 1d5h)
  DAY_HOUR_FORMAT: /^(\d+d)?(\d+h)?$/
};
