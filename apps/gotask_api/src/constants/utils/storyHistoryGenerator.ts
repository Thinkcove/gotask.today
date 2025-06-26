import { IProjectStory } from "../../domain/model/projectStory/projectStory";

export const generateProjectStoryHistoryEntry = (
  existing: IProjectStory,
  updated: Partial<IProjectStory>
): string | null => {
  const changes: string[] = [];

  if (updated.title && updated.title !== existing.title) {
    changes.push(`Title changed from "${existing.title}" to "${updated.title}"`);
  }

  if (updated.description && updated.description !== existing.description) {
    changes.push(`Description updated`);
  }

  if (updated.status && updated.status !== existing.status) {
    changes.push(`Status changed from "${existing.status}" to "${updated.status}"`);
  }

  return changes.length ? changes.join("; ") : null;
};
