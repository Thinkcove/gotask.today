"use client";

import React from "react";
import { Box, Card, Typography, Avatar, Chip } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useRouter } from "next/navigation";

interface AssigneeCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role?: { name: string };
  };
  assignedTemplates: any[];
}

const AssigneeCard: React.FC<AssigneeCardProps> = ({ user, assignedTemplates }) => {
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const router = useRouter();

  return (
    <Card
      sx={{
        width: "100%",
        minHeight: 180,
        cursor: "pointer",
        position: "relative",
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: "0px 3px 10px rgba(0,0,0,0.1)"
        }
      }}
      onClick={() => router.push(`/kpi/assignee/view/${user.id}`)}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar src={user.avatarUrl || ""} alt={user.name} />
        <Box>
          <Typography variant="subtitle1">{user.name}</Typography>
          <Typography variant="body2" color="textSecondary">
            {user.email}
          </Typography>
          {user.role?.name && (
            <Typography variant="body2" color="textSecondary">
              {transkpi("role")}: {user.role.name}
            </Typography>
          )}
        </Box>
      </Box>

      <Box mt={2}>
        <Typography variant="body2" color="textSecondary" mb={1}>
          {transkpi("assignedTemplates")}:
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {assignedTemplates && assignedTemplates.length > 0 ? (
            (() => {
              const allTemplates = assignedTemplates.flatMap(
                (assignment) => assignment.template || []
              );
              const visibleTemplates = allTemplates.slice(0, 3);
              const remainingCount = allTemplates.length - visibleTemplates.length;

              return (
                <>
                  {visibleTemplates.map((tpl: any, i: number) => (
                    <Chip
                      key={`template-chip-${tpl.template_id || i}`}
                      label={tpl.title}
                      size="small"
                    />
                  ))}
                  {remainingCount > 0 && (
                    <Chip label={`+${remainingCount} more`} size="small" color="default" />
                  )}
                </>
              );
            })()
          ) : (
            <Typography variant="body2" color="textSecondary">
              {transkpi("noTemplatesAssigned")}
            </Typography>
          )}
        </Box>
      </Box>

      <Typography
        variant="body2"
        color="primary"
        sx={{ mt: 2, textAlign: "right", textDecoration: "underline" }}
      >
        {transkpi("viewDetails")}
      </Typography>
    </Card>
  );
};

export default AssigneeCard;
