"use client";

import React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import env from "@/app/common/env";
import TaskDetail from "./taskDetail";
import { withAuth } from "@/app/common/utils/authToken";
import { getData } from "@/app/common/utils/apiData";

const fetchTask = async (url: string) => {
  return await withAuth(async (token: string) => {
    return await getData(url, token);
  });
};

const TaskViewClient: React.FC = () => {
  const { taskId } = useParams();
  const url = `${env.API_BASE_URL}/getTaskById/${taskId}`;
  const { data, mutate } = useSWR(taskId ? url : null, fetchTask, {
    revalidateOnFocus: false
  });
  const selectedTask = data?.data || [];
  
  return selectedTask && <TaskDetail task={selectedTask} mutate={mutate} />;
};

export default TaskViewClient;
