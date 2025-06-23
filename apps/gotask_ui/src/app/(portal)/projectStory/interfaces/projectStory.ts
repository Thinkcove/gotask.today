export interface Comment {
  user_id: string;
  comment: string;
  created_at: string;
}

export interface ProjectStory {
  [x: string]: any;
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

// Pagination Query
export interface StoryQueryParams {
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Paginated Response
export interface PaginatedStoryResponse {
  data: ProjectStory[];
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}
