"use client";
import React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import EditTask from "./editTask";
import env from "@/app/common/env";
import { withAuth } from "@/app/common/utils/authToken";
import { getData } from "@/app/common/utils/apiData";

const fetchTask = async (url: string) => {
  return await withAuth(async (token: string) => {
    return await getData(url, token);
  });
};

const EditAction: React.FC = () => {
  const { taskId } = useParams();
  const url = `${env.API_BASE_URL}/getTaskById/${taskId}`;
  const { data, mutate: UpdateData } = useSWR(taskId ? url : null, fetchTask, {
    revalidateOnFocus: false
  });
  const selectedTask = data?.data || null;
  return selectedTask && <EditTask data={selectedTask} mutate={UpdateData} />;
};

export default EditAction;
