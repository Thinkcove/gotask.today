"use client";

import React from "react";
import useSWR from "swr";
import { withAuth } from "@/app/common/utils/authToken";
import { getData } from "@/app/common/utils/apiData";
import TaskDetail from "./taskDetail";
import { buildTaskUrl } from "./taskUtils";

type ViewActionProps = {
  fallbackTask: any;
  taskId: string;
};

const fetchTask = async (url: string) => {
  return await withAuth(async (token: string) => {
    return await getData(url, token);
  });
};

const ViewAction: React.FC<ViewActionProps> = ({ fallbackTask, taskId }) => {
  const url = buildTaskUrl(taskId);
  const { data, mutate } = useSWR(url, fetchTask, {
    fallbackData: { data: fallbackTask },
    revalidateOnFocus: false
  });

  const selectedTask = data?.data;

  if (!selectedTask) return null; // optional: add loading or fallback UI

  return <TaskDetail task={selectedTask} mutate={mutate} />;
};


export default ViewAction;
