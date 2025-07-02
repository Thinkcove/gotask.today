import React from "react";
import { Box, Typography, Divider, Stack } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import StatusIndicator from "@/app/component/status/statusIndicator";
import { getStatusColor } from "@/app/common/constants/project";
import { GoalCardProps } from "../interface/projectGoal";
import SeverityIndicator from "@/app/(portal)/access/components/SeverityIndicator";
import { getSeverityColor } from "@/app/common/constants/task";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

const GoalItem: React.FC<GoalCardProps> = ({ goal, onClick }) => {
  const color = getStatusColor(goal.status);
  const transGoal = useTranslations(LOCALIZATION.TRANSITION.PROJECTGOAL);

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: `${color}12`,
        border: `1px solid ${color}40`,
        transition: "all 0.2s ease-in-out",
        cursor: onClick ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        "&:hover": {
          boxShadow: `0 0 6px ${color}66`
        }
      }}
    >
      {/* Goal Title */}
      <Box>
        <Typography variant="subtitle1" fontWeight={500} textTransform="capitalize" sx={{ mb: 1 }}>
          {goal.goalTitle}
        </Typography>

        {/* Info Row */}
        <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center" mb={1.5}>
          <StatusIndicator status={goal.status} getColor={getStatusColor} />

          {goal.status === "completed" && <input type="checkbox" disabled checked />}
          <Divider orientation="vertical" sx={{ height: 20 }} />

          <SeverityIndicator severity={goal.priority} getColor={getSeverityColor} />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "#741B92",
              fontWeight: 500,
              cursor: "pointer",
              ml: "auto",
              "&:hover": {
                textDecoration: "underline"
              }
            }}
            onClick={onClick}
          >
            <Typography sx={{ textTransform: "capitalize", mr: 0.5 }}>
              {transGoal("viewdetails")}
            </Typography>
            <ArrowForward fontSize="small" />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default GoalItem;
