"use client";
import React, { useState } from "react";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ActionButton from "@/app/component/floatingButton/actionButton";
import useSWR from "swr";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { useUserPermission } from "@/app/common/utils/userPermission";
import SearchBar from "@/app/component/searchBar/searchBar";
import Chat from "../../chatbot/components/chat";
import { fetcher } from "../service/templateAction";
import { Template } from "../service/templateInterface";
import CreateTemplate from "./createTemplate";
import TemplateCards from "./templateCard";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/permission";

const TemplateList = () => {
  const { canAccess } = useUserPermission();
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: templates, mutate: TemplateUpdate } = useSWR("fetch-templates", fetcher);

  const filteredTemplates =
    templates?.filter((template: Template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || null;

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        overflowY: "auto",
        maxHeight: "calc(100vh - 100px)",
        p: 3,
      }}
    >
      <CreateTemplate
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mutate={TemplateUpdate}
      />
      <Box mb={3} maxWidth={400}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          sx={{ width: "100%" }}
          placeholder={transkpi("searchplaceholder")}
        />
      </Box>
      <TemplateCards templates={filteredTemplates} />
      {canAccess(APPLICATIONS.CHATBOT, ACTIONS.CREATE) && <Chat />}
      <Box>
        {canAccess(APPLICATIONS.KPI, ACTIONS.CREATE) && (
          <ActionButton
            label={transkpi("createnewtemplate")}
            icon={<AddIcon sx={{ color: "white" }} />}
            onClick={() => setIsModalOpen(true)}
          />
        )}
      </Box>
    </Box>
  );
};

export default TemplateList;