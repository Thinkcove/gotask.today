const UserMessages = {
  CREATE: {
    REQUIRED: "User Data Is Required",
    FAILED: "Failed To Create User"
  },
  FETCH: {
    FAILED_ALL: "Failed to Retrieve Users",
    FAILED_BY_ID: "Failed To Retrieve User",
    NOT_FOUND: "User Not Found"
  },
  UPDATE: {
    FAILED: "Failed To Update user"
  },
  OTP: {
    SENT: "OTP Sent Successfully",
    SEND_FAILED: "Failed To Send OTP",
    EXPIRED_OR_INVALID: "OTP is expired or invalid",
    INCORRECT: "Incorrect OTP",
    VERIFIED: "OTP Verified Successfully",
    VERIFY_FAILED: "Failed to verify OTP",
    OTP_TITLE: "Your OTP Code Is"
  }
};

export default UserMessages;
