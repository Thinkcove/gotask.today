"use client";
import React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import env from "@/app/common/env";
import { withAuth } from "@/app/common/utils/authToken";
import { getData } from "@/app/common/utils/apiData";
import { getStoriesByProject } from "@/app/(portal)/projectStory/services/projectStoryActions";
import TaskDetail from "./taskDetail";
import { StoryResponseWithData } from "../../interface/taskInterface";

const fetchTask = async (url: string) => {
  return await withAuth(async (token: string) => {
    return await getData(url, token);
  });
};

const fetchStoryName = async (projectId: string, storyId: string) => {
  if (!projectId || !storyId) return "-";

  try {
    const result = await getStoriesByProject(projectId);
    const storyOptions = ((result as StoryResponseWithData)?.data || []).map(
      (story: { id: string; title: string }) => ({
        id: story.id,
        name: story.title
      })
    );

    const matchedStory = storyOptions.find((story) => story.id === storyId);
    return matchedStory?.name || "No story found";
  } catch (error) {
    console.error("Failed to fetch story name:", error);
    return "Error fetching story";
  }
};

const ViewAction: React.FC = () => {
  const { taskId } = useParams();
  const url = `${env.API_BASE_URL}/getTaskById/${taskId}`;

  const { data, mutate } = useSWR(taskId ? url : null, fetchTask, {
    revalidateOnFocus: false
  });

  const selectedTask = data?.data || [];

  // Fetch story name when we have project_id and story_id
  const { data: storyName } = useSWR(
    selectedTask?.project_id && selectedTask?.story_id
      ? `story-${selectedTask.project_id}-${selectedTask.story_id}`
      : null,
    () => fetchStoryName(selectedTask.project_id, selectedTask.story_id),

  );

  return selectedTask && (
    <TaskDetail
      task={selectedTask}
      mutate={mutate}
    />
  );
};

export default ViewAction;