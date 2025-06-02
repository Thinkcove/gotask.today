"use client";
import React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import env from "@/app/common/env";
import { withAuth } from "@/app/common/utils/authToken";
import { getData } from "@/app/common/utils/apiData";
import TaskDetail from "./taskDetail";

const fetchTask = async (url: string) => {
  return await withAuth(async (token: string) => {
    return await getData(url, token);
  });
};

const ViewAction: React.FC = () => {
  const { taskId } = useParams();
  const url = `${env.API_BASE_URL}/getTaskById/${taskId}`;
  const { data, mutate, isLoading } = useSWR(taskId ? url : null, fetchTask, {
    revalidateOnFocus: false
  });

  const selectedTask = data?.data || null;

  return selectedTask && (
    <TaskDetail
      task={selectedTask}
      loading={isLoading}
      mutate={mutate} // ✅ pass mutate so TaskDetail can call it
    />
  );
};

export default ViewAction;
