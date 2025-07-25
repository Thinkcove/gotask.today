import { formatEstimation, getTimeSpentColor } from "@/app/common/utils/leaveCalculate";
import { Box, Tooltip } from "@mui/material";

export const TimeSpentIndicator: React.FC<{
  spent: string | number | null | undefined;
  estimated: string | number | null | undefined;
}> = ({ spent, estimated }) => {
  const color = getTimeSpentColor(spent, estimated);
  const spentValue = spent !== null && spent !== undefined ? parseFloat(spent.toString()) : NaN;
  const estimatedValue = estimated !== null && estimated !== undefined ? parseFloat(estimated.toString()) : NaN;

  let tooltipText = "";
  if (isNaN(spentValue) || isNaN(estimatedValue)) {
    tooltipText = "No data available";
  } else if (spentValue > estimatedValue) {
    tooltipText = "Over estimated time";
  } else if (spentValue < estimatedValue) {
    tooltipText = "Under estimated time";
  } else if (spentValue === estimatedValue) {
    tooltipText = "Matches estimated time";
  }

  if (isNaN(spentValue) || isNaN(estimatedValue)) {
    return <span>{formatEstimation(spent)}</span>;
  }

  return (
    <Box display="flex" alignItems="center" gap={1} justifyContent="center">
      <Tooltip title={tooltipText} arrow>
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: color,
            flexShrink: 0
          }}
        />
      </Tooltip>
      <span>{formatEstimation(spent)}</span>
    </Box>
  );
};
