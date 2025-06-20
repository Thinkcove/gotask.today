import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { Edit } from "@mui/icons-material";
import StatusIndicator from "@/app/component/status/statusIndicator";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { GoalCardProps } from "@/app/(portal)/goals/projectid/[projectId]/interface/projectGoal";
import { getStatusColor } from "@/app/common/constants/project";

const GoalItem: React.FC<GoalCardProps> = ({ goal, onEdit, onClick }) => {
  const color = getStatusColor(goal.status);
  const transGoal = useTranslations(LOCALIZATION.TRANSITION.PROJECTGOAL);

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

        <StatusIndicator status={goal.status} getColor={getStatusColor} />

        {goal.status?.toLowerCase() === "completed" && (
          <Box display="flex" alignItems="center" mt={1}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              {transGoal("completion")}
            </Typography>
            <input type="checkbox" disabled checked />
          </Box>
        )}
      </Box>

      {/* Edit Button */}
      <Box display="flex" justifyContent="flex-end" mt={2}>
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
  );
};


export default GoalItem;
