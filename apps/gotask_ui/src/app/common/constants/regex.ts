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
export const TRAILING_DOTS_REGEX = /\.+$/;
