"use client";
import React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import EditTask from "./editTask";
import env from "@/app/common/env";

const EditAction: React.FC = () => {
  const { taskId } = useParams();
  const { data } = useSWR(`${env.API_BASE_URL}/getTaskById/${taskId}`, {
    revalidateOnFocus: false,
  });
  const selectedTask = data?.data || null;
  return selectedTask ? <EditTask data={selectedTask} /> : <p>Loading...</p>;
};

export default EditAction;
