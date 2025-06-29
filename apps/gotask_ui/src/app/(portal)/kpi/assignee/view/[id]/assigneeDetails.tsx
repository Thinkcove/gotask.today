"use client";

import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/permission";
import ActionButton from "@/app/component/floatingButton/actionButton";
import { useUserPermission } from "@/app/common/utils/userPermission";
import AlphabetAvatar from "@/app/component/avatar/alphabetAvatar";

interface AssigneeDetailProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role?: { name: string };
  };
  assignedTemplates: any[];
  mutate: () => void;
}

const AssigneeDetail: React.FC<AssigneeDetailProps> = ({ user, assignedTemplates }) => {
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const router = useRouter();
  const { canAccess } = useUserPermission();

  return (
    <Box
      sx={{
        p: 4,
        pb: 10,
        mb: 4,
        background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)",
        overflow: "auto",
        maxHeight: "100vh",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" gap={2} mb={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <ArrowBackIcon
            sx={{ cursor: "pointer", color: "#741B92" }}
            onClick={() => router.push("/kpi/assignee")}
          />
          <AlphabetAvatar userName={user.name} size={48} fontSize={18} />
          <Box>
            <Typography variant="h6">{user.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {user.email}
            </Typography>
            {user.role?.name && (
              <Typography variant="body2" color="textSecondary">
                {user.role.name}
              </Typography>
            )}
          </Box>
        </Box>
        {canAccess(APPLICATIONS.KPI, ACTIONS.CREATE) && (
          <ActionButton
            label={transkpi("assignTemplate")}
            icon={<AddIcon sx={{ color: "white" }} />}
            onClick={() => router.push(`/kpi/assignee/addTemplate/${user.id}`)}
          />
        )}
      </Box>

      <Box mb={3}>
        <Typography variant="body2" color="textSecondary" mb={1}>
          {transkpi("assignedTemplates")}:
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {assignedTemplates && assignedTemplates.length > 0 ? (
            assignedTemplates.flatMap((assignment: any) =>
              (assignment.template || []).map((tpl: any, i: number) => (
                <Chip
                  key={`${assignment.assignment_id}-${tpl.template_id || i}`}
                  label={tpl.title}
                  size="small"
                />
              ))
            )
          ) : (
            <Typography variant="body2">{transkpi("noTemplatesAssigned")}</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AssigneeDetail;
