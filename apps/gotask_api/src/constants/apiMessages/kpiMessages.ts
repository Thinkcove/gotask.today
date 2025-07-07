export const KpiTemplateMessages = {
  CREATE: {
    REQUIRED:
      "Title, description, and measurement criteria are required for creating a KPI template",
    FAILED: "Failed to create KPI template",
    SUCCESS: "KPI template created successfully",
    DUPLICATE: "Template name already exists"
  },
  FETCH: {
    FAILED_ALL: "Failed to fetch KPI templates",
    FAILED_BY_ID: "Failed to fetch KPI template by ID",
    NOT_FOUND: "KPI template not found"
  },
  UPDATE: {
    REQUIRED: "At least one field is required to update the KPI template",
    FAILED: "Failed to update KPI template",
    NOT_FOUND: "KPI template not found for update",
    SUCCESS: "KPI template updated successfully"
  },
  DELETE: {
    FAILED: "Failed to delete KPI template",
    NOT_FOUND: "KPI template not found for deletion",
    SUCCESS: "KPI template deleted successfully"
  }
};
