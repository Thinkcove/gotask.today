const DateFormats = {
  // Common formats
  FULL_DATE_TIME_12H: "DD-MM-YYYY hh:mm:ss A", // e.g., 06-06-2025 03:30:45 PM
  FULL_DATE_TIME_24H: "DD-MM-YYYY HH:mm:ss", // e.g., 06-06-2025 15:30:45

  DATE_ONLY: "DD-MM-YYYY", // e.g., 06-06-2025
  TIME_ONLY_12H: "hh:mm A", // e.g., 03:30 PM
  TIME_ONLY_24H: "HH:mm", // e.g., 15:30

  MONTH_DATE: "MMM D", // e.g., June 6
  MONTH_YEAR: "MMMM YYYY", // e.g., June 2025
  YEAR_ONLY: "YYYY", // e.g., 2025
  DAY_NAME: "dddd", // e.g., Friday

  // ISO and technical formats
  ISO_DATE: "YYYY-MM-DD", // e.g., 2025-06-06
  ISO_DATE_TIME: "YYYY-MM-DDTHH:mm:ssZ", // ISO format with timezone

  // Custom format examples
  SHORT_DATE: "DD/MM/YY", // e.g., 06/06/25
  COMPACT_DATE_TIME: "DDMMYYYY_HHmmss", // e.g., 06062025_153045
};

export default DateFormats;
