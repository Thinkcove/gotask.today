// src/app/common/constants/storyStatus.ts

export const STORY_STATUS = {
  TO_DO: "to-do",
  IN_PROGRESS: "in-progress",
  DONE: "done"
} as const;

export type StoryStatus = (typeof STORY_STATUS)[keyof typeof STORY_STATUS];

export const STORY_STATUS_OPTIONS: { id: StoryStatus; name: string }[] = [
  { id: STORY_STATUS.TO_DO, name: "To Do" },
  { id: STORY_STATUS.IN_PROGRESS, name: "In Progress" },
  { id: STORY_STATUS.DONE, name: "Done" }
];

// Add your color mapping here:
export const STORY_STATUS_COLOR: Record<StoryStatus, string> = {
  [STORY_STATUS.TO_DO]: "#B1AAAA",
  [STORY_STATUS.IN_PROGRESS]: "#F29807",
  [STORY_STATUS.DONE]: "#4CAF50"
};
