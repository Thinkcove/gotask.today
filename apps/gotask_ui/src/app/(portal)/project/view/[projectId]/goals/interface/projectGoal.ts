import { SelectOption } from "@/app/component/input/formField";
import { RichTextEditorRef } from "mui-tiptap";
import { RefObject } from "react";

export interface User {
  id: string;
  name: string;
}
export interface Project {
  id: string;
  name: string;
}
export interface GoalComment {
  id: number | string;
  comments: string[];
  user_name?: string;
  user_id?: string;
  updatedAt?: string;
}

export interface ProjectGoalViewProps {
  goalData: (GoalData & { comments: GoalComment[] }) | null;
  user: User | null;
  loading?: boolean;
  handleSaveComment: (commentData: {
    goal_id: string;
    comment: string;
    user_id?: string;
  }) => Promise<void>;
  handleEditComment: (
    commentId: string | number,
    updatedComment: { comment: string }
  ) => Promise<void>;
  handleDeleteComment: (commentId: string | number) => Promise<void>;
  handleBack?: () => void;
  onEdit: (goal: GoalData) => void;
}
export interface CommentPayload {
  comment: string;
}
export interface GoalCardProps {
  goal: GoalData;
  onClick?: () => void;
}
export interface GoalCommentProps {
  comments: GoalComment[];
  onSave: (commentData: { goal_id: string; comment: string; user_id?: string }) => Promise<void>;
  onEdit: (id: number | string, updatedComment: { comment: string }) => Promise<void>;
  onDelete: (id: number | string) => Promise<void>;
  goalId: string;
  user?: User | null;
}

export interface ProjectGoalsProps {
  projectGoals: GoalData[];
  isLoading: boolean;
  error: boolean;
  formatStatus: (status: string) => string;
  projectId: string;
  projectGoalView: (goalId: string) => void;
  handleScroll: (e: React.UIEvent<HTMLElement>) => void;
}
export interface GoalData {
  id: string;
  goalTitle: string;
  description: string;
  weekStart: string | Date;
  weekEnd: string | Date;
  status: string;
  priority: string;
  projectId?: string;
  user_id?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  comments?: GoalComment[];
}

export interface GoalDataPayload {
  goalTitle: string;
  description: string;
  weekStart: string;
  weekEnd: string;
  status: string;
  priority: string;
  projectId?: string;
  comments: string[];
  id?: string;
}

export interface ProjectGoalFormProps {
  goalData: GoalData;
  setGoalData: React.Dispatch<React.SetStateAction<GoalData>>;
  errors: { [key: string]: string };
  onSubmit?: (payload: GoalDataPayload) => void;
  rteRef?: RefObject<RichTextEditorRef | null>;
  currentProjectOptions: SelectOption[];
  currentProject: Project | undefined;
  handleProjectChange: (value: string | number | string[] | Date) => void;
}

export interface GoalFormHeaderProps {
  isEdit: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  onShowHistory?: () => void;
  isSubmitting?: boolean;
  hasHistory?: boolean;
  showModuleHeader?: boolean;
 projectname?:string
}
export interface HistoryData {
  [key: string]: string;
}

export interface UpdateHistoryItem {
  user_id: string;
  timestamp: string;
  history_data: HistoryData;
}

export interface ProjectGoalHistory {
  updateHistory: UpdateHistoryItem[];
}
