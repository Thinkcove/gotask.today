// Updated types/comment.ts - Support both formats
export interface Comment {
  id: number;
  comment: string;
  user_name: string;
  user_id: string;
  updatedAt: string;
}

// For API payload - simplified format
export interface CommentPayload {
  comment: string;
}
export interface GoalCardProps {
  goal: GoalData;
  onEdit: (goal: GoalData) => void;
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
}
export interface GoalData {
  goalTitle: string;
  description: string;
  weekStart: string;
  weekEnd: string;
  status: string;
  priority: string;
  projectId?: string;
  comments: Comment[]; // Frontend uses full Comment objects
  id?: string;
}

// For API submission - simplified format
export interface GoalDataPayload {
  goalTitle: string;
  description: string;
  weekStart: string;
  weekEnd: string;
  status: string;
  priority: string;
  projectId?: string;
  comments: string[]; // API expects array of strings
  id?: string;
}

export interface ProjectGoalFormProps {
  goalData: GoalData;
  setGoalData: React.Dispatch<React.SetStateAction<GoalData>>;
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  onSubmit?: (payload: GoalDataPayload) => void; // Add submit handler
}
