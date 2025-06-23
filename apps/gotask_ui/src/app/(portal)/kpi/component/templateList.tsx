"use client";
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ActionButton from "@/app/component/floatingButton/actionButton";
import useSWR from "swr";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { useUserPermission } from "@/app/common/utils/userPermission";
import SearchBar from "@/app/component/searchBar/searchBar";
import Chat from "../../chatbot/components/chat";
import { fetcher, deleteTemplate, updateTemplate } from "../service/templateAction";
import { Template } from "../service/templateInterface";
import CreateTemplate from "./createTemplate";
import TemplateCards from "../templateDetail/[id]/templateCard";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/permission";
import router from "next/router";

const TemplateList = () => {
  const { canAccess } = useUserPermission();
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: templates,
    error,
    mutate
  } = useSWR("fetch-templates", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true
  });

  const filteredTemplates =
    templates?.filter((template: Template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleDelete = async (templateId: string) => {
    try {
      await deleteTemplate(templateId);
      mutate();
    } catch (err) {
      console.error("Error deleting template:", err);
    }
  };

  const handleUpdate = async (templateId: string, updatedFields: Partial<Template>) => {
    try {
      await updateTemplate(templateId, updatedFields);
      mutate();
    } catch (err) {
      console.error("Error updating template:", err);
    }
  };

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          {transkpi("fetcherror")}
        </Typography>
      </Box>
    );
  }

  if (!templates) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">{transkpi("loading")}</Typography>
      </Box>
    );
  }

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
      <CreateTemplate open={isModalOpen} onClose={() => setIsModalOpen(false)} mutate={mutate} />
      <Box mb={3} maxWidth={400}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          sx={{ width: "100%" }}
          placeholder={transkpi("searchplaceholder")}
        />
      </Box>
      <TemplateCards
        templates={templates}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        onView={(id) => router.push(`/kpi/templateDetail/${id}`)}
      />
      {canAccess(APPLICATIONS.CHATBOT, ACTIONS.CREATE) && <Chat />}
      {canAccess(APPLICATIONS.KPI, ACTIONS.CREATE) && (
        <ActionButton
          label={transkpi("createnewtemplate")}
          icon={<AddIcon sx={{ color: "white" }} />}
          onClick={() => setIsModalOpen(true)}
        />
      )}
    </Box>
  );
};

export default TemplateList;
