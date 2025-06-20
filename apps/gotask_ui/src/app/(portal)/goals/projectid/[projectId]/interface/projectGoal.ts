export interface GoalComment {
  id: number | string;
  comment: string;
  user_name?: string;
  user_id?: string;
  updatedAt?: string;
}
export interface ProjectGoalViewProps {
  goalData: any;
  loading?: boolean;
}
export interface CommentPayload {
  comment: string;
}
export interface GoalCardProps {
  goal: GoalData;
  onEdit: (goal: GoalData) => void;
  onClick?: () => void;
}
export interface GoalCommentProps {
  comments: GoalComment[];
  onSave: (comment: string) => void;
  onEdit: (id: number | string, comment: string) => void;
  onDelete: (id: number | string) => void;
  currentUserId: string;
}

export interface ProjectGoalsProps {
  projectGoals: GoalData[];
  isLoading: boolean;
  error: boolean;
  formatStatus: (status: string) => string;
  handelOpen: () => void;
  openDialog: boolean;
  handleEditGoal: (goal: GoalData) => void;
  projectId: string;
  projectGoalView: (goalId: string) => void; // ✅ fixed
}
export interface GoalData {
  goalTitle: string;
  description: string;
  weekStart: string;
  weekEnd: string;
  status: string;
  priority: string;
  projectId?: string;
  comments: GoalComment[];
  id?: string;
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
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  onSubmit?: (payload: GoalDataPayload) => void;
}
