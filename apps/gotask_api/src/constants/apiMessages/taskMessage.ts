const TaskMessages = {
  CREATE: {
    REQUIRED: "Task data is required",
    FAILED: "Failed to create task"
  },
  DELETE: {
    NOT_FOUND: "Task not found",
    SUCCESS: "Task deleted successfully",
    FAILED: "Failed to delete task"
  },
  FETCH: {
    FAILED_ALL: "Failed to retrieve tasks",
    FAILED_BY_PROJECT: "Failed to retrieve tasks by project",
    FAILED_BY_USER: "Failed to retrieve tasks by user",
    FAILED_COUNTS: "Failed to retrieve task counts by status",
    FAILED_BY_ID: "Failed to retrieve task",
    NOT_FOUND: "Task not found"
  },
  UPDATE: {
    NOT_FOUND: "Task not found",
    FAILED: "Failed to update task"
  },
  COMMENT: {
    CREATE_FAILED: "Failed to create comment",
    UPDATE_FAILED: "Failed to update comment",
    NOT_FOUND: "Comment not found"
  }
};

export default TaskMessages;
