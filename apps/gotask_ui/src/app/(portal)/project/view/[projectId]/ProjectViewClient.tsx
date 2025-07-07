"use client";

import React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import env from "@/app/common/env";
import { withAuth } from "@/app/common/utils/authToken";
import { getData } from "@/app/common/utils/apiData";
import ProjectDetail from "./projectDetail";

const fetchProject = async (url: string) => {
  return await withAuth(async (token) => {
    return await getData(url, token);
  });
};

const ProjectViewClient: React.FC = () => {
  const { projectId } = useParams();
  const url = `${env.API_BASE_URL}/getProjectById/${projectId}`;
  const { data, mutate } = useSWR(projectId ? url : null, fetchProject, {
    revalidateOnFocus: false
  });

  const selectedProject = data?.data || null;

  return selectedProject ? <ProjectDetail project={selectedProject} mutate={mutate} /> : null;
};

export default ProjectViewClient;
