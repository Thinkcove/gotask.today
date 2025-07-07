const UserMessages = {
  CREATE: {
    REQUIRED: "User data is required",
    MISSING_FIELDS:
      "Missing required fields: emp_id,name, user_id,mobile_no,joined_date, roleId, status",
    FAILED: "Failed to create user",
    ROLE_INVALID: "Role ID is invalid or not found",
    SUCCESS: "User created successfully"
  },
  FETCH: {
    FAILED_ALL: "Failed to retrieve users",
    FAILED_BY_ID: "Failed to retrieve user",
    NOT_FOUND: "User not found",
    ROLE_NOT_FOUND: "Role ID not found for this user",
    FETCH_ROLE_FAILED: "Failed to fetch role details"
  },
  UPDATE: {
    FAILED: "Failed to update user",
    ROLE_INVALID: "Role ID is invalid or not found",
    SUCCESS: "User updated successfully"
  },
  DELETE: {
    FAILED: "Failed to delete user",
    NOT_FOUND: "User not found for deletion",
    SUCCESS: "User deleted successfully"
  },
  LOGIN: {
    MISSING_FIELDS: "Missing required fields: user_id and password",
    INVALID_CREDENTIALS: "Invalid credentials",
    USER_NOT_FOUND: "User not found",
    ROLE_NOT_FOUND: "Role ID not found for this user",
    ROLE_FETCH_FAILED: "Failed to fetch role details",
    SUCCESS: "Login successful"
  },
  EMAIL: {
    NOT_FOUND: "User with this email not found"
  },
  QUERY: {
    FAILED: "Failed to find the user",
    MISSING_FIELDS: "Missing required fields",
    NOT_FOUND: "Query was unsupported",
    SUCCESS: "User found successfully"
  },
  PROJECT: {
    ID_REQUIRED: "Project ID is required and cannot be empty",
    FETCH_FAILED: "Failed to fetch users by project ID"
  }
};
export default UserMessages;
