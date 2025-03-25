"use client";

import { Box, Drawer } from "@mui/material";
import { useState } from "react";

interface SideBarProps {
  handleFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SideBar: React.FC<SideBarProps> = ({ handleFileChange }) => {
  const [isHovered, setIsHovered] = useState(false);

  const drawerWidth = isHovered ? 300 : 64;

  const drawerStyle = {
    width: drawerWidth,
    flexShrink: 0,
    transition: "width 0.3s ease",
    "--sidebar-width": `${drawerWidth}px`,
    "& .MuiDrawer-paper": {
      width: 300,
      boxSizing: "border-box",
      overflow: "hidden",
      transition: "width 0.3s ease",
      backgroundColor: "#F1E5F5",
    },
  };

  return (
    <>
      <Drawer
        sx={drawerStyle}
        variant="permanent"
        anchor="right"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box sx={{ paddingX: 4, paddingTop: 6 }}>
          <Box sx={{ backgroundColor: "white", borderRadius: 2 }}>
            <Box>nciojfiotgjormtoyrio</Box>
            <Box>nciojfiotgjormtoyrio</Box>
            <Box>nciojfiotgjormtoyrio</Box>
            <Box>nciojfiotgjormtoyrio</Box>
            <Box>nciojfiotgjormtoyrio</Box>
            <Box>nciojfiotgjormtoyrio</Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default SideBar;
