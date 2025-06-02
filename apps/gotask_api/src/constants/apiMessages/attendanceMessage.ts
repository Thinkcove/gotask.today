export const AttendanceMessages = {
  CREATE: {
    REQUIRED: "Please provide empname, empcode, date, inTime, and outTime.",
    FAILED: "Failed to add attendance"
  },
  UPLOAD: {
    FAILED: "Failed to upload attendance",
    REQUIRED: "No sheets found in the file",
    NOTIFY: "XLSX file is empty or has no data rows",
    NO_DATA: "No data rows found",
    VALIDATION: "No valid attendance records processed",
    SUCCESS: "Attendance records processed successfully",
    NOT_FOUND: "File not found",
    UPLOAD_FAILED: "Failed to process attendance upload"
  },
  QUERY: {
    FAILED: "Failed to process attendance query",
    PARSE: "Query and parsedQuery are required.",
    NO_ABSENT: "No absences tracked on Sundays",
    INVALID:
      "Invalid attendance query: Please specify absent, after10am, latelogoff, late, or employee details",
    VALID: "No valid employee identifier provided",
    INVALID_DATE: "Invalid date format provided"
  }
};
