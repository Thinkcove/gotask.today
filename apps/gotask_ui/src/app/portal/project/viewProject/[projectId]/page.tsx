"use client";
import React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import env from "@/app/common/env";
import ProjectDetail from "./projectDetail";
import { getData } from "@/app/common/utils/apiData";
import { withAuth } from "@/app/common/utils/authToken";

const fetchProject = async (url: string) => {
  return await withAuth(async (token: string) => {
    return await getData(url, token);
  });
};

const ViewAction: React.FC = () => {
  const { projectId } = useParams();
  const url = `${env.API_BASE_URL}/getProjectById/${projectId}`;
  const { data, mutate: UpdateData } = useSWR(projectId ? url : null, fetchProject, {
    revalidateOnFocus: false
  });
  const selectedProject = data?.data || null;
  return selectedProject && <ProjectDetail project={selectedProject} mutate={UpdateData} />;
};

export default ViewAction;
