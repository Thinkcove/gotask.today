"use client";

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { calculateTimeProgressData } from "../../../common/utils/common";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

interface ProgressBarProps {
  estimatedTime: string;
  timeSpentTotal: string;
  dueDate: string;
  timeEntries: Array<{ date: string; start_time: string; end_time: string }>;
  variation: string; 
  onClick: () => void;
  canLogTime: boolean;
}

const TimeProgressBar: React.FC<ProgressBarProps> = ({
  estimatedTime,
  timeSpentTotal,
  dueDate,
  timeEntries,
  variation,
  onClick,
  canLogTime = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const { estimatedHours, spentHours, spentFillPercentage, variationFillPercentage } =
    calculateTimeProgressData(estimatedTime, timeSpentTotal, dueDate, timeEntries);

  const purpleColor = "#741B92";
  const redColor = "#d32f2f";
  const disabledColor = "#a0a0a0";

  const handleClick = () => {
    if (canLogTime) {
      onClick();
    }
  };

  // Determine variation display based on whether variation is negative
  const isNegativeVariation = variation.startsWith("-");
  const variationDisplay = isNegativeVariation ? "Variation: 0" : `Variation: ${variation}`;

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      mt={2}
      mb={2}
      sx={{
        cursor: canLogTime ? (isHovered ? "pointer" : "default") : "not-allowed",
        opacity: canLogTime ? 1 : 0.6
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <Box
        sx={{
          minWidth: 400,
          maxWidth: 500,
          width: "100%",
          px: 2,
          "&:hover .progress-info": {
            color: canLogTime ? "#741B92" : "#a0a0a0"
          }
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="body2" sx={{ fontWeight: "normal" }}>
            {transtask("spent")} {spentHours.toFixed(1)}h
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: "normal" }}>
            {transtask("estimated")} {estimatedHours.toFixed(1)}h
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: "normal" }}>
            {variationDisplay}
          </Typography>
        </Box>

        <Box sx={{ position: "relative", height: 10, borderRadius: 5, backgroundColor: "#e0e0e0" }}>
          {/* Time spent progress (first 70% of the bar) */}
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${spentFillPercentage}%`,
              maxWidth: "70%",
              backgroundColor: canLogTime ? purpleColor : disabledColor,
              borderRadius: "5px 0 0 5px",
              zIndex: 1
            }}
          />

          {/* Variation progress (last 30% of the bar, starting at 70%) */}
          {!isNegativeVariation && variationFillPercentage > 0 && (
            <Box
              sx={{
                position: "absolute",
                left: "70%",
                top: 0,
                height: "100%",
                width: `${variationFillPercentage}%`,
                maxWidth: "30%",
                backgroundColor: canLogTime ? redColor : disabledColor,
                borderRadius: "0 5px 5px 0",
                zIndex: 1
              }}
            />
          )}

          {/* Divider between spent and variation sections */}
          <Box
            sx={{
              position: "absolute",
              left: "70%",
              top: 0,
              height: "100%",
              width: "2px",
              backgroundColor: "#fff",
              zIndex: 2
            }}
          />
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          textAlign="center"
          mt={1}
          sx={{
            fontStyle: "italic",
            display: "block",
            color: canLogTime ? (isHovered ? "#741B92" : "text.secondary") : "#a0a0a0"
          }}
          className="progress-info"
        >
          {canLogTime ? transtask("timetrackingclick") : transtask("timetrackingdisabled")}
        </Typography>
      </Box>
    </Box>
  );
};

export default TimeProgressBar;