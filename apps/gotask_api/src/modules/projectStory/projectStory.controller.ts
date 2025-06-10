import { Request, ResponseToolkit } from "@hapi/hapi";
import * as ProjectStoryService from "./projectStory.service";
import { AuthCredentials } from "../../constants/auth/auth"; // 🔁 Use the correct path if it's different in your project

export const createStoryHandler = async (req: Request, h: ResponseToolkit) => {
  try {
    const { title, description } = req.payload as { title: string; description: string };
    const { projectId } = req.params;
    const { userId } = req.auth.credentials as unknown as AuthCredentials;

    const story = await ProjectStoryService.createStory({
      title,
      description,
      projectId,
      createdBy: userId,
    });

    return h.response({ success: true, data: story }).code(201);
  } catch (err: any) {
    console.error("Error in createStoryHandler:", err);
    return h.response({ success: false, message: err.message }).code(500);
  }
};

export const getStoriesByProjectHandler = async (req: Request, h: ResponseToolkit) => {
  try {
    const { projectId } = req.params;
    const stories = await ProjectStoryService.getStoriesByProject(projectId);

    return h.response({ success: true, data: stories }).code(200);
  } catch (err: any) {
    console.error("Error in getStoriesByProjectHandler:", err);
    return h.response({ success: false, message: err.message }).code(500);
  }
};

export const getStoryByIdHandler = async (req: Request, h: ResponseToolkit) => {
  try {
    const { storyId } = req.params;
    const story = await ProjectStoryService.getStoryById(storyId);

    if (!story) {
      return h.response({ success: false, message: "Story not found" }).code(404);
    }

    return h.response({ success: true, data: story }).code(200);
  } catch (err: any) {
    console.error("Error in getStoryByIdHandler:", err);
    return h.response({ success: false, message: err.message }).code(500);
  }
};
