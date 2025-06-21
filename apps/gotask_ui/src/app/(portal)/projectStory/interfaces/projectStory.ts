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
  status?: string;
}

export interface UpdateStoryPayload {
  title?: string;
  description?: string;
  status?: string;
}

export interface AddCommentPayload {
  user_id: string;
  comment: string;
}
