"use client";

import React, { useState, useMemo } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
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
import Toggle from "@/app/component/toggle/toggle";
import KpiItem from "./view/[id]/kpiItem";

interface TemplateListProps {
  initialView?: "template" | "assignee";
}

const TemplateList: React.FC<TemplateListProps> = ({ initialView = "template" }) => {
  const { canAccess } = useUserPermission();
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"template" | "assignee">(initialView);

  const labels = {
    template: transkpi("template"),
    assignee: transkpi("assignee")
  };

  const toggleOptions = [labels.template, labels.assignee];

  const labelToKey = {
    [labels.template]: "template",
    [labels.assignee]: "assignee"
  } as const;

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

  const handleViewChange = (selectedLabel: string) => {
    const nextView = labelToKey[selectedLabel];
    if (nextView !== view) {
      setView(nextView);
      router.push(nextView === "template" ? "/kpi/template" : "/kpi/employee");
    }
  };

  const filteredTemplates = useMemo(() => {
    if (!templates) return [];
    return templates.filter((template: Template) =>
      template.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [templates, searchTerm]);

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
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)"
        }}
      >
        <CircularProgress size={50} thickness={4} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          p: 3,
          pb: 0,
          backgroundColor: "#fff",
          zIndex: 1
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          mb={3}
        >
          {/* Left-aligned SearchBar */}
          <Box sx={{ flexGrow: 1, maxWidth: 400 }}>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              sx={{ width: "100%" }}
              placeholder={transkpi("searchplaceholder")}
            />
          </Box>

          {/* Right-aligned Toggle */}
          <Box sx={{ flexShrink: 0 }}>
            <Toggle options={toggleOptions} selected={labels[view]} onChange={handleViewChange} />
          </Box>
        </Box>
      </Box>

      {/* Template List */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 3,
          pt: 2,
          pb: 8
        }}
      >
        <KpiItem
          templates={filteredTemplates}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onView={(id) => router.push(`/kpi/template/view/${id}`)}
        />
      </Box>

      {canAccess(APPLICATIONS.CHATBOT, ACTIONS.CREATE) && <Chat />}

      {canAccess(APPLICATIONS.KPI, ACTIONS.CREATE) && (
        <ActionButton
          label={transkpi("createnewtemplate")}
          icon={<AddIcon sx={{ color: "white" }} />}
          onClick={() => router.push("/kpi/template/createTemplate")}
        />
      )}
    </Box>
  );
};

export default TemplateList;
