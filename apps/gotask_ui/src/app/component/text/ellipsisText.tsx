import { Typography, Tooltip } from "@mui/material";

interface EllipsisTextProps {
  text: string;
  maxWidth?: number | string;
}

const EllipsisText = ({ text, maxWidth = 200 }: EllipsisTextProps) => {
  return (
    <Tooltip title={text} placement="top-start" arrow>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          maxWidth,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          cursor: "pointer"
        }}
      >
        {text}
      </Typography>
    </Tooltip>
  );
};

export default EllipsisText;
