export const AttendanceMessages = {
  CREATE: {
    REQUIRED: "Missing required fields: empcode, date, inTime, outTime",
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
    FAILED: "Failed to process attendance query"
  }
};
