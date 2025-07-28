import { timeStatusItems } from "@/app/common/constants/actualTime";
import { Box, Typography } from "@mui/material";

export const TimeSpentStatus: React.FC = () => {
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
      {timeStatusItems.map((item, index) => (
        <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1, lineHeight: 1 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: item.color,
              flexShrink: 0,
              transform: "translateY(-1px)" // <-- Key fix here
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.75rem",
              color: "#666",
              lineHeight: 1
            }}
          >
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
