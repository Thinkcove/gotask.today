const OtpMessages = {
  SEND: {
    SUCCESS: "OTP sent successfully",
    ERROR: "Failed to send OTP",
    MISSING_USER_ID: "User ID is required"
  },
  VERIFY: {
    SUCCESS: "OTP verified successfully",
    INVALID: "Invalid OTP",
    EXPIRED: "OTP has expired",
    ERROR: "OTP verification failed",
    MISSING_FIELDS: "User ID and OTP are required",
    NOT_FOUND: "OTP not found or already used"
  }
};

export default OtpMessages;
