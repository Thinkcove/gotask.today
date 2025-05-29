export const QueryTaskMessages = {
  CREATE: {
    REQUIRED: "user_id, project_id, title, due_date, status, and severity are required",
    INVALID_USER: "User not found",
    INVALID_PROJECT: "Project not found",
    INVALID_STATUS: "Invalid status",
    INVALID_SEVERITY: "Invalid severity",
    FAILED: "Failed to create task"
  },
  FETCH: {
    NOT_FOUND: "Task not found",
    FAILED: "Failed to retrieve task"
  },
  UPDATE: {
    NOT_FOUND: "Task not found",
    INVALID_USER: "User not found",
    INVALID_PROJECT: "Project not found",
    INVALID_STATUS: "Invalid status",
    INVALID_SEVERITY: "Invalid severity",
    FAILED: "Failed to update task"
  },
  DELETE: {
    NOT_FOUND: "Task not found",
    FAILED: "Failed to delete task"
  },
  QUERY: {
    INVALID: "Please specify a valid task, project, or organization query",
    FAILED: "Failed to process task query"
  },
  EMPLOYEE_TASKS: {
    REQUIRED: "empcode or empname is required",
    FAILED: "Failed to retrieve tasks for employee"
  },
  TIME: {
    FAILED: "Failed to fetch timespent"
  },
  COMMENT: {
    FAILED: "Failed to create comment "
  }
};
