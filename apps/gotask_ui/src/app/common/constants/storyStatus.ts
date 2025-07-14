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

// Color Mapping
export const STORY_STATUS_COLOR: Record<StoryStatus, string> = {
  [STORY_STATUS.TO_DO]: "#B1AAAA",
  [STORY_STATUS.IN_PROGRESS]: "#F29807",
  [STORY_STATUS.DONE]: "#4CAF50"
};

// Translated Status Options Helper
export const getTranslatedStoryStatusOptions = (
  t: (key: string) => string
): { label: string; value: StoryStatus }[] => {
  return [
    { label: t("Stories.filters.toDo"), value: STORY_STATUS.TO_DO },
    { label: t("Stories.filters.inProgress"), value: STORY_STATUS.IN_PROGRESS },
    { label: t("Stories.filters.done"), value: STORY_STATUS.DONE }
  ];
};

// Story Status Transitions
export const STORY_STATUS_TRANSITIONS: Record<StoryStatus, StoryStatus[]> = {
  [STORY_STATUS.TO_DO]: [STORY_STATUS.IN_PROGRESS],
  [STORY_STATUS.IN_PROGRESS]: [STORY_STATUS.DONE],
  [STORY_STATUS.DONE]: [STORY_STATUS.IN_PROGRESS]
};
