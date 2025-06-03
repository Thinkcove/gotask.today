export const QueryMessages = {
  PARSE: {
    FAILED: "Failed to parse query",
    SUCCESS: "Query parsed successfully"
  },
  PROCESS: {
    REQUIRED: "Query must be a non-empty string",
    FAILED: "Failed to process query"
  },
  EMPLOYEE_QUERY: {
    FAILED: "Failed to process employee query",
    VALID: "No valid employee identifier provided"
  },
  HISTORY: {
    FAILED: "Failed to retrieve query history",
    LIMIT: "Limit must be between 1 and 100",
    SUCCESS: "Query history retrieved successfully",
    NO_HISTORY: "No history found for this conversation",
    CLEAR: "Query history cleared successfully"
  },
  CLEAR: {
    FAILED: "Failed to clear query history"
  },
  DELETE: {
    FAILED: "Failed to delete conversation"
  },
  INVALID: {
    DATE: "Invalid date format provided",
    QUERY:
      "Invalid query: Please specify details for project, organization, task, or attendance information.",
    EMPTY: "Invalid or empty response from service"
  },
  CONVERSATION: {
    EMPTY: "Conversation ID must be a non-empty string",
    SUCCESS: "Conversation history retrieved successfully",
    DELETE: "Conversation deleted successfully",
    REQUIRED: "Conversation ID is required."
  },
  CONNECTION: {
    FAILED: "Database connection is not established"
  },
  QUERY: {
    REQUIRED: "Query is required."
  }
};
