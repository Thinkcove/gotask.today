export interface Comment {
  user_id: string;
  comment: string;
  created_at: string;
}

export interface ProjectStory {
  status: string;
  id: string;
  title: string;
  description?: string;
  project_id: string;
  comments?: Comment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStoryPayload {
  title: string;
  description?: string;
  projectId: string;
  createdBy: string;
}

export interface UpdateStoryPayload {
  title?: string;
  description?: string;
}

export interface AddCommentPayload {
  user_id: string;
  comment: string;
}
