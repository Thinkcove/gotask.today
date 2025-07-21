"use client";

import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/permission";
import ActionButton from "@/app/component/floatingButton/actionButton";
import { useUserPermission } from "@/app/common/utils/userPermission";
import AlphabetAvatar from "@/app/component/avatar/alphabetAvatar";
import { Template } from "../../../service/templateInterface";
import { mildStatusColor } from "@/app/common/constants/kpi";
import { getUserStatusColor } from "@/app/common/constants/status";
import StatusIndicator from "@/app/component/status/statusIndicator";

interface AssigneeDetailProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role?: { name: string };
  };
  assignedTemplates: {
    assignment_id: string;
    template: Template[];
  }[];
  mutate: () => void;
}

const AssigneeDetail: React.FC<AssigneeDetailProps> = ({ user, assignedTemplates }) => {
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const router = useRouter();
  const { canAccess } = useUserPermission();

  const isTemplateEmpty =
    assignedTemplates.length === 0 ||
    assignedTemplates.every((assignment) => assignment.template.length === 0);

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
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          sx={{
            position: "sticky"
          }}
        >
          <ArrowBackIcon
            sx={{ cursor: "pointer", color: "#741B92" }}
            onClick={() => router.push("/kpi/employee")}
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
            label={transkpi("assignatemplate")}
            icon={<AddIcon sx={{ color: "white" }} />}
            onClick={() => router.push(`/kpi/employee/addTemplate/${user.id}`)}
          />
        )}
      </Box>

      {/* Assigned Templates Grid */}
      <Grid container spacing={2} mt={2}>
        {isTemplateEmpty ? (
          <Grid item xs={12}>
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{
                fontStyle: "italic",
                ml: 1,
                mt: 1
              }}
            >
              {transkpi("notemplatesassigned")}
            </Typography>
          </Grid>
        ) : (
          assignedTemplates.flatMap((assignment) =>
            assignment.template.map((template: Template, i: number) => {
              const status = template.status?.toLowerCase() || "inactive";
              const assignmentId = assignment.assignment_id;

              return (
                <Grid item xs={12} sm={6} md={4} key={`${assignmentId}-${template.id || i}`}>
                  <Box
                    sx={{
                      borderRadius: 4,
                      p: 2,
                      backgroundColor: mildStatusColor(status),
                      border: `1px solid ${getUserStatusColor(status)}`,
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        cursor: "pointer",
                        boxShadow: "none"
                      }
                    }}
                    onClick={() => router.push(`/kpi/employee/assignedTemplate/${assignmentId}`)}
                  >
                    <Typography variant="h6" fontWeight={600} mb={1}>
                      {template.title}
                    </Typography>

                    <Typography variant="body2" mb={0.5}>
                      <strong>{transkpi("measurementcriteria")}:</strong>{" "}
                      {template.measurement_criteria}
                    </Typography>

                    <Typography variant="body2" mb={0.5}>
                      <strong>{transkpi("frequency")}:</strong> {template.frequency || "N/A"}
                    </Typography>

                    <Box display="flex" alignItems="center" mt={1}>
                      <StatusIndicator
                        status={status}
                        getColor={getUserStatusColor}
                        dotSize={8}
                        capitalize
                      />
                    </Box>
                  </Box>
                </Grid>
              );
            })
          )
        )}
      </Grid>
    </Box>
  );
};

export default AssigneeDetail;
