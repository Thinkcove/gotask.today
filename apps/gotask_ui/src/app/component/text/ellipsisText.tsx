import { Typography } from "@mui/material";

interface EllipsisTextProps {
  text: string;
  maxWidth?: number | string;
}

const EllipsisText = ({ text, maxWidth = 200 }: EllipsisTextProps) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{
        maxWidth,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }}
    >
      {text}
    </Typography>
  );
};

export default EllipsisText;
