export interface GoalComment {
  id: number | string;
  comments: string[];
  user_name?: string;
  user_id?: string;
  updatedAt?: string;
}
export interface ProjectGoalViewProps {
  goalData: any;
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
  onSave: (commentData: { goal_id: string; comment: string; user_id?: string }) => Promise<void>;
  onEdit: (id: number | string, updatedComment: { comment: string }) => Promise<void>;
  onDelete: (id: number | string) => Promise<void>;
  goalId: string;
  currentUserId?: string;
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
  onSubmit?: (payload: GoalDataPayload) => void;
}
