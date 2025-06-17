import { Box, IconButton, Typography } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";

interface PageHeaderProps {
  onClose: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onClose }) => (
  <Box
    sx={{
      position: "sticky",
      top: 0,
      zIndex: 1100,
      backgroundColor: "white",
      p: 2,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    <IconButton color="primary" onClick={onClose} sx={{ position: "absolute", left: 16 }}>
      <ArrowBack />
    </IconButton>
  </Box>
);

export default PageHeader;
