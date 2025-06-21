// src/constants/status/projectStoryConstants.ts

export const PROJECT_STORY_STATUS = {
  TO_DO: "to-do",
  IN_PROGRESS: "in-progress",
  HOLD: "hold",
  COMPLETED: "completed"
} as const;

export type ProjectStoryStatus = (typeof PROJECT_STORY_STATUS)[keyof typeof PROJECT_STORY_STATUS];
  