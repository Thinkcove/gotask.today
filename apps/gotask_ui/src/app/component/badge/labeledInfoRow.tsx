// components/InfoRow.tsx

import React from "react";
import { Stack, Box, Typography } from "@mui/material";

interface LabeledInfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const LabeledInfoRow: React.FC<LabeledInfoRowProps> = ({ icon, label, value }) => {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box color="text.secondary">{icon}</Box>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 90 }}>
        {label}:
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
  );
};

export default LabeledInfoRow;
