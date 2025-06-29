export const TASK_STATUS = {
  TO_DO: "to-do",
  IN_PROGRESS: "in-progress",
  NEED_INFO: "need-info",
  HOLD: "hold",
  IN_REVIEW: "in-review",
  UNDER_REVIEW: "under-review",
  REVIEWED: "reviewed",
  COMPLETED: "completed"
};

export const TASK_SEVERITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical"
};

export enum SortField {
  DUE_DATE = "due_date",
  USER_NAME = "user_name",
  CREATED_AT = "createdAt"
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc"
}
