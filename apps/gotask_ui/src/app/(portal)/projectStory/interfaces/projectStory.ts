// Interface for a single comment
export interface Comment {
  updatedAt: string;
  id: string; // UUID from backend
  user_id: string; // UUID or email of user
  user_name: string; // Full name or email
  comment: string;
  createdAt: string;
}

// Interface for a project story
export interface ProjectStory {
  data: any;
  id: string;
  title: string;
  description?: string;
  status: string;
  project_id: string;
  comments?: Comment[];
  createdAt?: string;
  updatedAt?: string;
}

// Payload for creating a new story
export interface CreateStoryPayload {
  title: string;
  description?: string;
  projectId: string;
  createdBy: string;
  status?: string;
}

// Payload for updating an existing story
export interface UpdateStoryPayload {
  title?: string;
  description?: string;
  status?: string;
}

// Payload for adding a comment to a story (user_id is extracted from token in backend)
export interface AddCommentPayload {
  comment: string;
}

// Optional query parameters for fetching stories
export interface StoryQueryParams {
  status?: string[];
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Paginated response format for stories
export interface PaginatedStoryResponse {
  data: ProjectStory[];
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}
