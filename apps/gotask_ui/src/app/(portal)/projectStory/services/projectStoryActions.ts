import env from "@/app/common/env";
import { getData, postData, putData, deleteData } from "@/app/common/utils/apiData";
import { withAuth } from "@/app/common/utils/authToken";
import {
  CreateStoryPayload,
  UpdateStoryPayload,
  AddCommentPayload,
  StoryQueryParams,
  PaginatedStoryResponse,
  ProjectStory,
  Comment
} from "../interfaces/projectStory";

// Create a new Project Story
export const createProjectStory = async (formData: CreateStoryPayload) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/createStory/${formData.projectId}`;
    return postData(url, formData as unknown as Record<string, unknown>, token);
  });
};

// Update a Project Story
export const updateProjectStory = async (storyId: string, updatedFields: UpdateStoryPayload) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/story/update/${storyId}`;
    return putData(url, updatedFields as Record<string, unknown>, token);
  });
};

//  Delete a Project Story
export const deleteProjectStory = async (storyId: string) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/story/delete/${storyId}`;
    return deleteData(url, token);
  });
};

//  Add Comment to a Story
export const addCommentToProjectStory = async (storyId: string, payload: AddCommentPayload) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/story/comment/${storyId}`;
    return postData(url, payload as unknown as Record<string, unknown>, token);
  });
};

// Get All Comments by Story ID
export const getCommentsByStoryId = async (storyId: string): Promise<Comment[]> => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/story/${storyId}/comments`;
    return getData(url, token);
  });
};

// Update a Comment by Comment ID
export const updateCommentOnProjectStory = async (
  commentId: string,
  payload: AddCommentPayload
) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/story/comment/${commentId}`;
    return putData(url, payload as unknown as Record<string, unknown>, token);
  });
};

// Delete a Comment by Comment ID
export const deleteCommentFromProjectStory = async (commentId: string) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/story/comment/${commentId}`;
    return deleteData(url, token);
  });
};

// Get Stories by Project ID with Filters
export const getStoriesByProject = async (
  projectId: string,
  queryParams: Omit<StoryQueryParams, "endDate"> = {}
): Promise<PaginatedStoryResponse> => {
  return withAuth((token) => {
    const query = new URLSearchParams();

    if (queryParams.status) {
      const statuses = Array.isArray(queryParams.status)
        ? queryParams.status
        : [queryParams.status];
      statuses.forEach((s) => query.append("status", s));
    }

    if (queryParams.startDate) query.set("startDate", queryParams.startDate);
    if (queryParams.page) query.set("page", String(queryParams.page));
    if (queryParams.limit) query.set("limit", String(queryParams.limit));
    if (queryParams.search) query.set("search", queryParams.search);

    const url = `${env.API_BASE_URL}/getStories/${projectId}?${query.toString()}`;
    return getData(url, token);
  });
};

// Get Single Story by Story ID
export const getProjectStoryById = async (storyId: string): Promise<ProjectStory> => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/story/${storyId}`;
    return getData(url, token);
  });
};

// Get Tasks by Story ID
export const getTasksByStory = async (storyId: string) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/story/${storyId}/tasks`;
    return getData(url, token);
  });
};
