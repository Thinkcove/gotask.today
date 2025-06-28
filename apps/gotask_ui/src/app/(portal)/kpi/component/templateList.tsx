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
import { useRouter } from "next/navigation";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/permission";
import { deleteTemplate, fetcher, updateTemplate } from "../service/templateAction";
import { Template } from "../service/templateInterface";
import Chat from "../../chatbot/components/chat";
import TemplateCards from "../view/[id]/kpiItem";
import TemplateToggle from "./templateToggle";

interface TemplateListProps {
  initialView?: "template" | "assignee";
}

const TemplateList: React.FC<TemplateListProps> = ({ initialView = "template" }) => {
  const { canAccess } = useUserPermission();
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const [view, setView] = useState<"template" | "assignee">(initialView);
  const {
    data: templates,
    error,
    mutate
  } = useSWR("fetch-templates", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true
  });

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

  const handleViewChange = (nextView: "template" | "assignee") => {
    if (nextView !== view) {
      setView(nextView);
      if (nextView === "template") {
        router.push("/kpi");
      } else {
        router.push("/kpi/assignee");
      }
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
    <Box sx={{ position: "relative", height: "100vh", overflowY: "auto", p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box mb={3} maxWidth={400}>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            sx={{ width: "100%" }}
            placeholder={transkpi("searchplaceholder")}
          />
        </Box>
        <TemplateToggle view={view} onViewChange={handleViewChange} />
      </Box>
      <TemplateCards
        templates={templates}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        onView={(id) => router.push(`/kpi/view/${id}`)}
      />

      {canAccess(APPLICATIONS.CHATBOT, ACTIONS.CREATE) && <Chat />}

      {canAccess(APPLICATIONS.KPI, ACTIONS.CREATE) && (
        <ActionButton
          label={transkpi("createnewtemplate")}
          icon={<AddIcon sx={{ color: "white" }} />}
          onClick={() => router.push("/kpi/createTemplate")}
        />
      )}
    </Box>
  );
};

export default TemplateList;
