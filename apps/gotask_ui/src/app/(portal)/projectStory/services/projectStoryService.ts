import env from "@/app/common/env";
import { getData, postData, putData, deleteData } from "@/app/common/utils/apiData";
import { withAuth } from "@/app/common/utils/authToken";
import {
  CreateStoryPayload,
  UpdateStoryPayload,
  AddCommentPayload
} from "../interfaces/projectStory";

//create story
export const createProjectStory = async (formData: CreateStoryPayload) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/createStory/${formData.projectId}`;
    return postData(url, formData as unknown as Record<string, unknown>, token);
  });
};

// 🔹 Update a Project Story
export const updateProjectStory = async (storyId: string, updatedFields: UpdateStoryPayload) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/story/update/${storyId}`;
    return putData(url, updatedFields as Record<string, unknown>, token);
  });
};

// 🔹 Delete a Project Story
export const deleteProjectStory = async (storyId: string) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/story/delete/${storyId}`;
    return deleteData(url, token);
  });
};

// 🔹 Add Comment to Story
export const addCommentToProjectStory = async (storyId: string, payload: AddCommentPayload) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/story/comment/${storyId}`;
    return postData(url, payload as unknown as Record<string, unknown>, token);
  });
};

// 🔹 Get All Stories by Project ID
export const getStoriesByProject = async (projectId: string) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/getStories/${projectId}`;
    return getData(url, token);
  });
};

// 🔹 Get One Story by ID
export const getProjectStoryById = async (storyId: string) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/story/${storyId}`;
    return getData(url, token);
  });
};

// 🔹 Get Tasks under a Story
export const getTasksByStory = async (storyId: string) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/story/${storyId}/tasks`;
    return getData(url, token);
  });
};
