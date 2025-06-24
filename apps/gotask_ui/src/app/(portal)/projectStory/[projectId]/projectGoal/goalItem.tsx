import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { Edit } from "@mui/icons-material";
import StatusIndicator from "@/app/component/status/statusIndicator";
import { getStatusColor } from "@/app/common/constants/project";
import { GoalCardProps } from "../interface/projectGoal";

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
      {/* Goal Title and Status */}
      <Box>
        <Typography variant="subtitle1" fontWeight={500} textTransform="capitalize" sx={{ mb: 1 }}>
          {goal.goalTitle}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <StatusIndicator status={goal.status} getColor={getStatusColor} />

          {goal.status === "completed" && <input type="checkbox" disabled checked />}

          <Box sx={{ ml: "auto" }}>
            <Tooltip title="Edit Goal">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(goal);
                }}
                color="primary"
              >
                <Edit />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GoalItem;
