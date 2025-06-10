// src/modules/storyComment/storyComment.controller.ts

import { Request, ResponseToolkit } from "@hapi/hapi";
import * as StoryCommentService from "./storyComment.service";
import { AuthCredentials } from "../../constants/auth/auth"; // adjust path as needed

export const addCommentHandler = async (req: Request, h: ResponseToolkit) => {
  try {
    const { comment } = req.payload as { comment: string };
    const { storyId } = req.params;
    const { userId } = req.auth.credentials as unknown as AuthCredentials;

    const newComment = await StoryCommentService.addComment({
      storyId,
      userId,
      comment,
    });

    return h.response({ success: true, data: newComment }).code(201);
  } catch (err: any) {
    console.error("Error in addCommentHandler:", err);
    return h.response({ success: false, message: err.message }).code(500);
  }
};

export const getCommentsByStoryHandler = async (req: Request, h: ResponseToolkit) => {
  try {
    const { storyId } = req.params;
    const comments = await StoryCommentService.getCommentsByStory(storyId);

    return h.response({ success: true, data: comments }).code(200);
  } catch (err: any) {
    console.error("Error in getCommentsByStoryHandler:", err);
    return h.response({ success: false, message: err.message }).code(500);
  }
};
