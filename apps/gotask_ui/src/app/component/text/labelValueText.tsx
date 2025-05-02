import { Typography, Box, SxProps, Theme } from "@mui/material";

interface LabelValueTextProps {
  label: string;
  value: string;
  sx?: SxProps<Theme>;
}

const LabelValueText = ({ label, value, sx }: LabelValueTextProps) => {
  return (
    <Box sx={sx}>
      <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  );
};

export default LabelValueText;
