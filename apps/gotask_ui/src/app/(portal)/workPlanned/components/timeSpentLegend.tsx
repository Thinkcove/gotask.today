import { Box, Typography } from "@mui/material";

export const TimeSpentLegend: React.FC = () => {
  const legendItems = [
    { color: "#20bf25ff", label: "Completed Early" },
    { color: "#ead30cff", label: "Estimated Time" },
    { color: "#dd1428ff", label: "Overdue" }
  ];

  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        justifyContent: "center",
        mb: 2,
        flexWrap: "wrap"
      }}
    >
      {legendItems.map((item, index) => (
        <Box key={index} display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: item.color,
              flexShrink: 0
            }}
          />
          <Typography variant="caption" sx={{ fontSize: "0.75rem", color: "#666" }}>
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
