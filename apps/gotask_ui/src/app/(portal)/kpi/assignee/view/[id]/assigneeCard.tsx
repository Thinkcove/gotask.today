"use client";

import React from "react";
import { Box, Typography, Chip, Stack, Divider } from "@mui/material";
import AlphabetAvatar from "@/app/component/avatar/alphabetAvatar";
import { ArrowForward } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import CardComponent from "@/app/component/card/cardComponent";
import { User } from "@/app/userContext";
import { Template } from "../../../service/templateInterface";

interface AssigneeCardProps {
  user: User;
  assignedTemplates: {
    template: Template[];
  }[];
}

const AssigneeCard: React.FC<AssigneeCardProps> = ({ user, assignedTemplates }) => {
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const router = useRouter();

  const templateList = assignedTemplates.flatMap((a) => a.template || []);
  const visibleTemplates = templateList.slice(0, 1);
  const remainingCount = templateList.length - visibleTemplates.length;

  return (
    <CardComponent>
      <Stack spacing={2} sx={{ height: "100%" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <AlphabetAvatar userName={user.name} size={48} fontSize={18} />
          <Box>
            <Typography variant="h6" fontWeight={600} sx={{ textTransform: "capitalize" }}>
              {user.name}
            </Typography>
            {user.role?.name && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textTransform: "capitalize" }}
              >
                {user.role.name}
              </Typography>
            )}
          </Box>
        </Stack>

        <Divider />

        {/* Assigned Templates */}
        <Box>
          <Typography variant="body2" color="text.secondary" mb={1}>
            {transkpi("assignedtemplates")}:
          </Typography>
          {templateList.length > 0 ? (
            <Box display="flex" flexWrap="wrap" gap={1}>
              {visibleTemplates.map((template: Template, i: number) => (
                <Chip
                  key={`tpl-chip-${template.id}-${i}`}
                  label={template.title}
                  size="small"
                  sx={{
                    color: "#741B92",
                    backgroundColor: "rgba(116, 27, 146, 0.1)"
                  }}
                />
              ))}
              {remainingCount > 0 && (
                <Chip
                  label={`+${remainingCount} more`}
                  size="small"
                  sx={{
                    color: "#741B92",
                    backgroundColor: "rgba(116, 27, 146, 0.1)"
                  }}
                />
              )}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {transkpi("notemplatesassigned")}
            </Typography>
          )}
        </Box>

        {/* View Details */}
        <Box display="flex" justifyContent="flex-end">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "#741B92",
              fontWeight: 500,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" }
            }}
            onClick={() => router.push(`/kpi/assignee/view/${user.id}`)}
          >
            <Typography sx={{ textTransform: "capitalize", mr: 0.5 }}>
              {transkpi("viewdetails")}
            </Typography>
            <ArrowForward fontSize="small" />
          </Box>
        </Box>
      </Stack>
    </CardComponent>
  );
};

export default AssigneeCard;
