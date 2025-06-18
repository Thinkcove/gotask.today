const WeeklyGoalMessages = {
  CREATE: {
    REQUIRED: "Weekly goal data is required",
    MISSING_FIELDS:
      "Missing required fields: user_id, project_id, title, start_date, end_date, status",
    FAILED: "Failed to create weekly goal",
    SUCCESS: "Weekly goal created successfully"
  },

  FETCH: {
    FAILED_ALL: "Failed to retrieve weekly goals",
    FAILED_BY_ID: "Failed to retrieve weekly goal by ID",
    FAILED_BY_USER: "Failed to retrieve weekly goals by user ID",
    FAILED_BY_PROJECT: "Failed to retrieve weekly goals by project ID",
    NOT_FOUND: "Weekly goal not found",
    SUCCESS: "Weekly goals fetched successfully"
  },

  UPDATE: {
    FAILED: "Failed to update weekly goal",
    NOT_FOUND: "Weekly goal not found for update",
    SUCCESS: "Weekly goal updated successfully"
  },

  DELETE: {
    FAILED: "Failed to delete weekly goal",
    NOT_FOUND: "Weekly goal not found for deletion",
    SUCCESS: "Weekly goal deleted successfully"
  },

  USER: {
    REQUIRED: "User ID is required",
    NOT_FOUND: "User not found"
  },

  PROJECT: {
    ID_REQUIRED: "Project ID is required and cannot be empty",
    FETCH_FAILED: "Failed to fetch weekly goals by project ID"
  },

  QUERY: {
    MISSING_FIELDS: "Missing required query parameters",
    FAILED: "Failed to query weekly goals",
    SUCCESS: "Weekly goals query successful"
  }
};

export default WeeklyGoalMessages;
