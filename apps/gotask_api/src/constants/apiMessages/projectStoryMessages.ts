export const storyMessages = {
  CREATE: {
    SUCCESS: "Story created successfully.",
    TITLE_REQUIRED: "Title and project ID are required to create a story.",
    FAILED: "Failed to create story."
  },
  FETCH: {
    ALL_SUCCESS: "Stories fetched successfully.",
    SINGLE_SUCCESS: "Story fetched successfully.",
    NOT_FOUND: "Story not found.",
    PROJECT_ID_REQUIRED: "Project ID is required to fetch stories.",
    FAILED: "Failed to fetch story data."
  },
  COMMENT: {
    COMMENT_REQUIRED: "Comment and story ID are required.",
    SUCCESS: "Comment added successfully.",
    FAILED: "Failed to add comment to story."
  },
  UPDATE: {
    SUCCESS: "Story updated successfully.",
    NO_FIELDS: "Nothing to update. Provide at least a title or description.",
    FAILED: "Failed to update story."
  },
  DELETE: {
    SUCCESS: "Story deleted successfully.",
    FAILED: "Failed to delete story."
  },
  TASK: {
    CREATE_REQUIRED: "Task data is required.",
    CREATE_FAILED: "Failed to create task under story.",
    CREATE_SUCCESS: "Task created successfully under the story.",
    FETCH_SUCCESS: "Tasks fetched successfully under the story.",
    FETCH_FAILED: "Story ID is required to fetch tasks or fetching failed."
  }
};
