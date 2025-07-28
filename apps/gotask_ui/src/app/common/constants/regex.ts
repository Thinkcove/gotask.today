export const EMAIL_UPPERCASE_REGEX = /[A-Z]/;
export const ONLY_ALPHANUMERIC_REGEX = /[^a-zA-Z0-9]/g;
export const DIGIT_ONLY_REGEX = /\D/g;
export const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]+$/;

// Matches 1 or more digits followed by 'w', 'd', 'h', or 'm' (for weeks, days, hours, minutes)
export const WEEK_PATTERN = /(\d+)w/;
export const DAY_PATTERN = /(\d+)d/;
export const HOUR_PATTERN = /(\d+)h/;
export const MINUTE_PATTERN = /(\d+)m/;

// Matches time in the format: 'XdYh' (used in extractHours)
export const DAY_HOUR_COMBO_PATTERN = /(\d+)d(\d+)h/;

// Email and phone validations
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_PATTERN = /^\+?[1-9](?:\d\s?){7,14}$/;

//Time Parsing
export const DURATION_PARSE_FORMAT = "/^(-?\d+)d(?:(\d+)h)?(?:(\d+)m)?$/";

//Numeric value estimatioin

export const ESTIMATION_FORMAT = /[^\d.]/g;

export const TRAILING_DOTS_REGEX = /\.+$/;

export const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const TIME_PERIOD = /\s*(AM|PM)\s*/i;
export const NUMBER_FORMAT = /\B(?=(\d{2})+(?!\d))/g;

export const TIME_24H = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const DATE_ISO = /^\d{4}-\d{2}-\d{2}$/;

export const DATETIME_ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

export const NON_DIGIT = /[^0-9]/g;

// Strip HTML tags and trim whitespace
export const stripHtmlAndTrim = (html: string = ""): string => {
  return html.replace(/<[^>]*>/g, "").trim();
};

// Check if rich text content is empty (no meaningful content)
export const isHtmlContentEmpty = (html: string = ""): boolean => {
  return stripHtmlAndTrim(html) === "";
};

export const FIELD_PREFIX_REGEX = /^.+?: /;
