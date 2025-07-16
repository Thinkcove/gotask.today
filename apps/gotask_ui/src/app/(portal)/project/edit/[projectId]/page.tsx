"use client";

import React from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { Box, CircularProgress } from "@mui/material";

import EditProject from "./editProject";
import { getProjectById } from "../../services/projectAction";
import { Project } from "../../interfaces/projectInterface";
import ModuleHeader from "../../../../component/header/moduleHeader";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "../../../../common/constants/localization";

const EditProjectPage = () => {
  const { projectId } = useParams();
  const transproject = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);

  const {
    data: project,
    mutate,
    isLoading
  } = useSWR<Project>(projectId ? `/project/${projectId}` : null, () =>
    getProjectById(projectId as string)
  );

  if (isLoading || !project) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <ModuleHeader name={transproject("edittitle")} />
      <EditProject data={project} mutate={mutate} projectID={projectId as string} />
    </>
  );
};

export default EditProjectPage;
