import React from "react";
import { Box, Typography, IconButton, Tooltip, Divider, Stack } from "@mui/material";
import { Edit } from "@mui/icons-material";
import StatusIndicator from "@/app/component/status/statusIndicator";
import { getStatusColor } from "@/app/common/constants/project";
import { GoalCardProps } from "../interface/projectGoal";
import SeverityIndicator from "@/app/(portal)/access/components/SeverityIndicator";
import { getSeverityColor } from "@/app/common/constants/task";

const GoalItem: React.FC<GoalCardProps> = ({ goal, onEdit, onClick }) => {
  const color = getStatusColor(goal.status);

  return (
    <Box
      onClick={onClick}
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
        <Stack direction="row" gap={1.5} flexWrap="wrap" alignItems="center" mb={1.5}>
          <StatusIndicator status={goal.status} getColor={getStatusColor} />

          {goal.status === "completed" && <input type="checkbox" disabled checked />}
          <Divider orientation="vertical" sx={{ height: 20 }} />

          <SeverityIndicator severity={goal.priority} getColor={getSeverityColor} />

          <Tooltip title="Edit Goal">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onEdit(goal);
              }}
              sx={{ ml: "auto" }}
              color="primary"
            >
              <Edit />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  );
};

export default GoalItem;
