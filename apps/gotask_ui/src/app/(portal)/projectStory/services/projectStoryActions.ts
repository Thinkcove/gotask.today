import env from "@/app/common/env";
import { getData, postData, putData, deleteData } from "@/app/common/utils/apiData";
import { withAuth } from "@/app/common/utils/authToken";
import {
  CreateStoryPayload,
  UpdateStoryPayload,
  AddCommentPayload,
  StoryQueryParams,
  PaginatedStoryResponse
} from "../interfaces/projectStory";

// Create a new Project Story
export const createProjectStory = async (formData: CreateStoryPayload) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/createStory/${formData.projectId}`;
    return postData(url, formData as unknown as Record<string, unknown>, token);
  });
};


//  Update a Project Story
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

//  Get Stories with Filters & Pagination
export const getStoriesByProject = async (
  projectId: string,
  queryParams: Omit<StoryQueryParams, "endDate"> = {}
): Promise<PaginatedStoryResponse> => {
  return withAuth((token) => {
    const query = new URLSearchParams();

    // Handle multi-status values correctly
    if (queryParams.status) {
      const statuses = Array.isArray(queryParams.status)
        ? queryParams.status
        : [queryParams.status];
      statuses.forEach((s) => query.append("status", s));
    }

    if (queryParams.startDate) query.set("startDate", queryParams.startDate);
    if (queryParams.page) query.set("page", String(queryParams.page));
    if (queryParams.limit) query.set("limit", String(queryParams.limit));

    const url = `${env.API_BASE_URL}/getStories/${projectId}?${query.toString()}`;
    return getData(url, token);
  });
};



//  Get Single Story by ID
export const getProjectStoryById = async (storyId: string) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/story/${storyId}`;
    return getData(url, token);
  });
};

//  Get Tasks by Story ID
export const getTasksByStory = async (storyId: string) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/story/${storyId}/tasks`;
    return getData(url, token);
  });
};
