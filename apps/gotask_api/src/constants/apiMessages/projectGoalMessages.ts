const ProjectGoalMessages = {
  CREATE: {
    REQUIRED: "project goal data is required",
    MISSING_FIELDS:
      "Missing required fields: user_id, project_id, title, start_date, end_date, status",
    FAILED: "Failed to create project goal",
    SUCCESS: "project goal created successfully"
  },

  FETCH: {
    FAILED_ALL: "Failed to retrieve project goals",
    FAILED_BY_ID: "Failed to retrieve project goal by ID",
    FAILED_BY_USER: "Failed to retrieve project goals by user ID",
    FAILED_BY_PROJECT: "Failed to retrieve project goals by project ID",
    NOT_FOUND: "project goal not found",
    SUCCESS: "project goals fetched successfully"
  },

  UPDATE: {
    FAILED: "Failed to update project goal",
    NOT_FOUND: "project goal not found for update",
    SUCCESS: "project goal updated successfully"
  },

  DELETE: {
    FAILED: "Failed to delete project goal",
    NOT_FOUND: "project goal not found for deletion",
    SUCCESS: "project goal deleted successfully"
  },

  USER: {
    REQUIRED: "User ID is required",
    NOT_FOUND: "User not found"
  },

  PROJECT: {
    ID_REQUIRED: "Project ID is required and cannot be empty",
    FETCH_FAILED: "Failed to fetch project goals by project ID"
  },

  QUERY: {
    MISSING_FIELDS: "Missing required query parameters",
    FAILED: "Failed to query project goals",
    SUCCESS: "project goals query successful"
  }
};

export default ProjectGoalMessages;
