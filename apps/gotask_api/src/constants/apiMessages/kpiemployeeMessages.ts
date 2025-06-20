export const KpiAssignmentMessages = {
  CREATE: {
    REQUIRED:
      "Employee ID, measurement criteria, frequency, weightage, and assigned by are required. If not using a template, title and description are also required.",
    REVIEWER_REQUIRED: "Reviewer ID is required when assigned by the employee themselves",
    TEMPLATE_NOT_FOUND: "KPI template not found",
    EMPLOYEE_SELF_ASSIGN_ONLY: "Employees can only assign KPIs to themselves",
    FAILED: "Failed to create KPI assignment",
    SUCCESS: "KPI assignment created successfully",
    INVALID_USER_IDS: "One or more user IDs not found"
  },
  FETCH: {
    REQUIRED: "Employee ID is required to fetch KPI assignments",
    EMPLOYEE_OWN_ONLY: "Employees can only view their own KPI assignments",
    FAILED_ALL: "Failed to fetch KPI assignments",
    FAILED_BY_ID: "Failed to fetch KPI assignment by ID",
    NOT_FOUND: "KPI assignment not found",
    INVALID_USER_IDS: "One or more user IDs not found",
    MISSING_USER_ID: "User Id is missing",
    REVIEWER_NOT_UPDATABLE: "Reviewer cannot be updated once assigned.",
    FAILED: "Failed to fetch templates for user.",
    ASSIGN_ID: "assignment_id is required in path",
    USER_ID: "authUserId is required in payload"
  },
  UPDATE: {
    EMPLOYEE_OWN_ONLY: "Employees can only update their own KPI assignments",
    REVIEWER_NOT_UPDATABLE: "Reviewer ID cannot be updated after creation",
    NOT_FOUND: "KPI assignment not found for update",
    FAILED: "Failed to update KPI assignment",
    SUCCESS: "KPI assignment updated successfully",
    INVALID_USER_IDS: "One or more user IDs not found"
  },
  DELETE: {
    EMPLOYEE_NOT_ALLOWED: "Employees are not allowed to delete KPI assignments",
    NOT_FOUND: "KPI assignment not found for deletion",
    FAILED: "Failed to delete KPI assignment",
    SUCCESS: "KPI assignment deleted successfully",
    INVALID_USER_IDS: "One or more user IDs not found"
  }
};
