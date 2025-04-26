import React from "react";
import { Box, Typography } from "@mui/material";
import { calculateTimeProgressData } from "@/app/common/utils/common";

interface ProgressBarProps {
  estimatedTime: string;
  timeSpentTotal: string;
  onClick: () => void;
}

const TimeProgressBar: React.FC<ProgressBarProps> = ({ estimatedTime, timeSpentTotal, onClick }) => {
  const {
    estimatedHours,
    spentHours,
    variationHours,
    spentFillPercentage,
    variationFillPercentage,
    totalFillPercentage
  } = calculateTimeProgressData(estimatedTime || "0h", timeSpentTotal || "0h");

  const purpleColor = "#741B92";
  const redColor = "#d32f2f";

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      mt={2}
      mb={2}
      sx={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <Box
        sx={{
          minWidth: 400,
          maxWidth: 500,
          width: "100%",
          px: 2,
          "&:hover .progress-info": {
            color: "#741B92"
          }
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="body2" sx={{ fontWeight: "normal" }}>
            Spent: {spentHours.toFixed(1)}h
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: "normal" }}>
            Estimated: {estimatedHours.toFixed(1)}h
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: "normal" }}>
            Variation:{" "}
            {variationHours > 0
              ? `+${variationHours.toFixed(1)}h`
              : `${variationHours.toFixed(1)}h`}
          </Typography>
        </Box>

        <Box sx={{ position: "relative", height: 10, borderRadius: 5, backgroundColor: "#e0e0e0" }}>
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${spentFillPercentage}%`,
              backgroundColor: purpleColor,
              borderRadius: "5px 0 0 5px",
              zIndex: 1
            }}
          />
          {variationFillPercentage > 0 && (
            <Box
              sx={{
                position: "absolute",
                left: `${spentFillPercentage}%`,
                top: 0,
                height: "100%",
                width: `${variationFillPercentage}%`,
                backgroundColor: redColor,
                borderRadius: spentFillPercentage === 0 ? "5px 0 0 5px" : "0",
                borderTopRightRadius: totalFillPercentage >= 100 ? "5px" : "0",
                borderBottomRightRadius: totalFillPercentage >= 100 ? "5px" : "0",
                zIndex: 1
              }}
            />
          )}
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
          sx={{ fontStyle: "italic", display: "block" }}
        >
          Click the bar to update time tracking
        </Typography>
      </Box>
    </Box>
  );
};

export default TimeProgressBar;
