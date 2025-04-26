import React from "react";
import { Box, Tooltip, Fab } from "@mui/material";

interface FloatingActionButtonProps {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}

const ActionButton: React.FC<FloatingActionButtonProps> = ({ label, onClick, icon }) => {
  return (
    <Box position="fixed" bottom={42} right={32}>
      <Tooltip title={label} arrow>
        <Fab
          sx={{
            backgroundColor: "#741B92",
            "&:hover": { backgroundColor: "#5E1374" }
          }}
          onClick={onClick}
        >
          {icon}
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default ActionButton;
