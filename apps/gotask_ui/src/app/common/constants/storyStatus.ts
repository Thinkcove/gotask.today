export const STORY_STATUS = {
  TO_DO: "to-do",
  IN_PROGRESS: "in-progress",
  NEED_INFO: "need-info",
  HOLD: "hold",
  COMPLETED: "completed"
} as const;

export type StoryStatus = (typeof STORY_STATUS)[keyof typeof STORY_STATUS];

export const STORY_STATUS_OPTIONS: { id: StoryStatus; name: string }[] = [
  { id: STORY_STATUS.TO_DO, name: "To Do" },
  { id: STORY_STATUS.IN_PROGRESS, name: "In Progress" },
  { id: STORY_STATUS.NEED_INFO, name: "Need Info" },
  { id: STORY_STATUS.HOLD, name: "Hold" },
  { id: STORY_STATUS.COMPLETED, name: "Completed" }
];

// Color Mapping
export const STORY_STATUS_COLOR: Record<StoryStatus, string> = {
  [STORY_STATUS.TO_DO]: "#B1AAAA",
  [STORY_STATUS.IN_PROGRESS]: "#F29807",
  [STORY_STATUS.NEED_INFO]: "#939FCF",
  [STORY_STATUS.HOLD]: "#E2A3D5",
  [STORY_STATUS.COMPLETED]: "#4CAF50"
};

// Translated Status Options Helper
export const getTranslatedStoryStatusOptions = (
  t: (key: string) => string
): { label: string; value: StoryStatus }[] => {
  return [
    { label: t("Stories.filters.toDo"), value: STORY_STATUS.TO_DO },
    { label: t("Stories.filters.inProgress"), value: STORY_STATUS.IN_PROGRESS },
    { label: t("Stories.filters.needInfo"), value: STORY_STATUS.NEED_INFO },
    { label: t("Stories.filters.hold"), value: STORY_STATUS.HOLD },
    { label: t("Stories.filters.completed"), value: STORY_STATUS.COMPLETED }
  ];
};

// Story Status Transitions
export const STORY_STATUS_TRANSITIONS: Record<StoryStatus, StoryStatus[]> = {
  [STORY_STATUS.TO_DO]: [STORY_STATUS.IN_PROGRESS, STORY_STATUS.HOLD],
  [STORY_STATUS.IN_PROGRESS]: [STORY_STATUS.NEED_INFO, STORY_STATUS.HOLD, STORY_STATUS.COMPLETED],
  [STORY_STATUS.NEED_INFO]: [STORY_STATUS.IN_PROGRESS, STORY_STATUS.HOLD],
  [STORY_STATUS.HOLD]: [STORY_STATUS.TO_DO, STORY_STATUS.IN_PROGRESS],
  [STORY_STATUS.COMPLETED]: [STORY_STATUS.IN_PROGRESS, STORY_STATUS.TO_DO]
};
