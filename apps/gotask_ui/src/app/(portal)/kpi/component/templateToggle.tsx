"use client";

import React from "react";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

interface TemplateToggleProps {
  view: "template" | "assignee";
  onViewChange: (view: "template" | "assignee") => void;
}

const TemplateToggle: React.FC<TemplateToggleProps> = ({ view, onViewChange }) => {
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 4,
        position: "relative",
        borderBottom: "2px solid #eee",
        width: "fit-content",
        marginBottom: "4px"
      }}
    >
      {["template", "assignee"].map((key) => (
        <Box
          key={key}
          onClick={() => onViewChange(key as "template" | "assignee")}
          sx={{
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: view === key ? 600 : 400,
            color: view === key ? "#741B92" : "#555",
            paddingBottom: "4px",
            transition: "color 0.2s"
          }}
        >
          {transkpi(`${key}label`)}
        </Box>
      ))}

      {/* Animated underline */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: view === "template" ? 0 : "calc(100% / 2)",
          width: "50%",
          height: "2px",
          backgroundColor: "#741B92",
          transition: "left 0.3s ease"
        }}
      />
    </Box>
  );
};

export default TemplateToggle;
