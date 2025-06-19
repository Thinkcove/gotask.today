export interface GoalCardProps {
  goal: {
    id: string;
    goalTitle: string;
    status: string;
  };
  onEdit: (goal: any) => void;
}

export interface GoalData {
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
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
}

export interface ProjectGoal {
  comments(comments: any): unknown;
  priority: string;
  weekEnd: string;
  weekStart: string;
  description: string;
  id: string;
  goalTitle: string;
  status: string;
  projectId: string;
}

export interface ProjectGoalsProps {
  projectGoals: ProjectGoal[];
  isLoading: boolean;
  error: boolean;
  formatStatus: (status: string) => string;
  openDialog: boolean;
  handelOpen: (open: boolean) => void;
  handleEditGoal: (goal: ProjectGoal) => void;
  projectId: string;
}
