const OrganizationMessages = {
  CREATE: {
    REQUIRED: "Organization data is required",
    FAILED: "Failed to create organization",
    SUCCESS: "Organization Created Successfully"
  },
  FETCH: {
    FAILED_ALL: "Failed to retrieve organizations",
    FAILED_BY_USER: "Failed to retrieve organizations for user",
    FAILED_BY_ID: "Failed to retrieve organization",
    NOT_FOUND: "Organization not found"
  },
  ASSIGN: {
    INVALID_INPUT: "Invalid user IDs or organization ID",
    NO_USERS_FOUND: "No valid users found for provided user IDs",
    PROJECT_NOT_FOUND: "Organization not found",
    FAILED: "Failed to assign users to organization"
  },
  USER: {
    REQUIRED: "User ID is required"
  },
  UPDATE: {
    FAILED: "Failed to update the organization",
    SUCCESS: "Organization updated Successfully"
  }
};

export default OrganizationMessages;
