"use client";
import React, { useState } from "react";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateProject from "./createProject";
import ProjectCards from "./projectCards";
import ActionButton from "@/app/component/floatingButton/actionButton";
import { fetcher } from "../services/projectAction";
import useSWR from "swr";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/authCheck";
import SearchBar from "@/app/component/searchBar/searchBar";
import { Project } from "../../task/interface/taskInterface";
import Chat from "../../chatbot/components/chat";

const ProjectList = () => {
  const { canAccess } = useUserPermission();
  const transproject = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: projects, mutate: ProjectUpdate } = useSWR("fetch-projects", fetcher);

  const filteredProjects =
    projects?.filter((pro: Project) => pro.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    null;

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        overflowY: "auto",
        maxHeight: "calc(100vh - 100px)",
        p: 3
      }}
    >
      <CreateProject
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mutate={ProjectUpdate}
      />
      <Box mb={3} maxWidth={400}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          sx={{ width: "100%" }}
          placeholder={transproject("searchplaceholder")}
        />
      </Box>
      <ProjectCards projects={filteredProjects} />
      <Chat />
      <Box>
        {/* Add Project Button */}
        {canAccess(APPLICATIONS.PROJECT, ACTIONS.CREATE) && (
          <ActionButton
            label={transproject("createnewproject")}
            icon={<AddIcon sx={{ color: "white" }} />}
            onClick={() => setIsModalOpen(true)}
          />
        )}
      </Box>
    </Box>
  );
};

export default ProjectList;
