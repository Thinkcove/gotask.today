const ProjectMessages = {
  CREATE: {
    REQUIRED: "Project data is required",
    FAILED: "Failed to create project"
  },
  FETCH: {
    FAILED_ALL: "Failed to retrieve projects",
    FAILED_BY_USER: "Failed to retrieve projects for user",
    FAILED_BY_ID: "Failed to retrieve project",
    NOT_FOUND: "Project not found",
    FILTER_FAILED: "Failed to fetch filtered projects."
  },
  ASSIGN: {
    INVALID_INPUT: "Invalid user IDs or project ID",
    NO_USERS_FOUND: "No valid users found for provided user IDs",
    PROJECT_NOT_FOUND: "Project not found",
    FAILED: "Failed to assign users to project"
  },
  REMOVE: {
    INVALID_INPUT: "Invalid user IDs or project ID",
    PROJECT_NOT_FOUND: "Project not found",
    FAILED: "Failed to remove users from project"
  },
  USER: {
    REQUIRED: "User ID is required"
  },
  UPDATE: {
    FAILED: "Failed to Update a Project"
  }
};

export default ProjectMessages;
