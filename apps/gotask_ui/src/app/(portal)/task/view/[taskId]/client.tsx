"use client";

import React from "react";
import useSWR from "swr";
import TaskDetail from "./taskDetail";
import env from "@/app/common/env";
import { withAuth } from "@/app/common/utils/authToken";
import { getData } from "@/app/common/utils/apiData";

interface ViewActionProps {
  taskId: string;
  swrKey: string;
}

const fetchTask = async (url: string) => {
  return await withAuth(async (token: string) => {
    return await getData(url, token);
  });
};

const ViewAction: React.FC<ViewActionProps> = ({ swrKey }) => {
  const { data, mutate } = useSWR(swrKey, fetchTask, {
    revalidateOnFocus: false
  });

  const task = data?.data;

  return task ? <TaskDetail task={task} mutate={mutate} /> : null;
};

export default ViewAction;
