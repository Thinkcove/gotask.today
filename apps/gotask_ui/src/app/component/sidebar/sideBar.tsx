import React, { useState, useRef, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  IconButton,
  useMediaQuery,
  AppBar,
  Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GridViewIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import SecurityIcon from "@mui/icons-material/Security";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import AssignmentIcon from "@mui/icons-material/Assignment";
import menuItemsData from "./menuItems.json";
import { useRouter, usePathname } from "next/navigation";

const iconMap: Record<string, React.ReactNode> = {
  DashboardIcon: <GridViewIcon />,
  FolderIcon: <FolderIcon />,
  PeopleIcon: <PeopleIcon />,
  BusinessIcon: <BusinessIcon />,
  SecurityIcon: <SecurityIcon />,
  VpnKeyIcon: <VpnKeyIcon />,
  AssignmentIcon: <AssignmentIcon />
};

const drawerWidth = 260;

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(
    !useMediaQuery((theme: any) => theme.breakpoints.down("sm"))
  );
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));
  const drawerRef = useRef<HTMLDivElement>(null);

  const selectedIndex = menuItemsData.findIndex((item) => pathname === item.path);

  const handleListItemClick = (index: number, path: string) => {
    router.push(path);
    if (isMobile) setOpen(false);
  };

  const toggleSidebar = () => {
    setOpen(!open);
  };

  // Handle outside click on desktop
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !isMobile &&
        open &&
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, isMobile]);

  return (
    <>
      {/* Mobile AppBar */}
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "#741B92",
          display: { xs: "block", sm: "none" }
        }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleSidebar} aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Go Task Today
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Desktop Open Button when Sidebar is Closed */}
      {!isMobile && !open && (
        <IconButton
          onClick={toggleSidebar}
          sx={{
            marginTop: "-12px",
            position: "fixed",
            top: 20,
            left: 20,
            zIndex: 1300,
            backgroundColor: "#741B92",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#5a1473"
            }
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={open}
        onClose={toggleSidebar}
        sx={{
          width: collapsed ? 60 : drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: collapsed ? 60 : drawerWidth,
            boxSizing: "border-box",
            background: "linear-gradient(180deg, #EFE2F3 0%, #D6C4E4 100%)",
            color: "#2A1237",
            borderRight: "1px solid #d3b7eb",
            display: "flex",
            flexDirection: "column",
            transition: "width 0.3s ease-in-out"
          }
        }}
      >
        <div ref={drawerRef}>
          <Toolbar>
            <Box sx={{ fontWeight: "bold", fontSize: "1.6rem", color: "#741B92" }}>
              {collapsed ? "" : "Go Task Today"}
            </Box>
          </Toolbar>

          <Box sx={{ overflow: "auto", px: 1, flex: 1 }}>
            <List>
              {menuItemsData.map((item, index) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    selected={selectedIndex === index}
                    onClick={() => handleListItemClick(index, item.path)}
                    sx={{
                      borderRadius: 2,
                      my: 0.5,
                      px: 2,
                      transition: "all 0.3s ease",
                      backgroundColor:
                        selectedIndex === index ? "rgba(116, 27, 146, 0.1)" : "transparent",
                      "&:hover": {
                        backgroundColor: "rgba(116, 27, 146, 0.15)",
                        transform: "scale(1.015)",
                        color: "#741B92"
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#ffffff",
                        boxShadow: "0 0 6px 2px rgba(116, 27, 146, 0.25)",
                        color: "#741B92"
                      }
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: "40px",
                        color: "#741B92"
                      }}
                    >
                      {iconMap[item.icon]}
                    </ListItemIcon>

                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: selectedIndex === index ? "bold" : "normal",
                        fontSize: "1rem",
                        display: collapsed ? "none" : "block"
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </div>
      </Drawer>
    </>
  );
};

export default Sidebar;
