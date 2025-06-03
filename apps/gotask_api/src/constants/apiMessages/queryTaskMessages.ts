export const QueryTaskMessages = {
  CREATE: {
    REQUIRED: "user_id, project_id, title, due_date, status, and severity are required",
    INVALID_USER: "User not found",
    INVALID_PROJECT: "Project not found",
    INVALID_STATUS: "Invalid status",
    INVALID_SEVERITY: "Invalid severity",
    FAILED: "Failed to create task",
    REQUIRED_FIELDS: "Please provide user_id, project_id, created_on, and due_date.",
    REQUIRED_ID: "Please provide task_id, user_id, comment, and user_name."
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
    FAILED: "Failed to process task query",
    REQUIRED: "Query and parsedQuery are required."
  },
  EMPLOYEE_TASKS: {
    REQUIRED: "empcode or empname is required",
    FAILED: "Failed to retrieve tasks for employee",
    REQUIRED_FIELD: "Please provide task id.",
    PIPELINE: "Please provide aggregation pipeline.",
    REQUIRED_ID: "Please provide task id and time entries.",
    RETRIEVED: "Retrieved tasks for project",
    RETRIEVED_USER: "Retrieved tasks for user",
    COUNT: "Task counts by status retrieved",
    INVALID: "Invalid task query: Please specify task, project, or employee details"
  },
  TIME: {
    FAILED: "Failed to fetch timespent"
  },
  COMMENT: {
    FAILED: "Failed to create comment ",
    REQUIRED: "Please provide comment id and new comment text."
  }
};
