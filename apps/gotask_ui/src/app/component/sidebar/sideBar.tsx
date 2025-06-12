import React, { useState, useRef } from "react";
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
  useMediaQuery
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GridViewIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import SecurityIcon from "@mui/icons-material/Security";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import menuItemsData from "./menuItems.json";
import { useRouter, usePathname } from "next/navigation";
import { Theme } from "@mui/material/styles";
import UserInfoCard from "../header/userMenu";
import { useUser } from "@/app/userContext";
import { hasPermission } from "@/app/common/utils/permisssion";
import { ACTIONS, ActionType, ApplicationName } from "@/app/common/utils/authCheck";
import ChatIcon from "@mui/icons-material/Chat";
import { UploadFileOutlined } from "../../../../node_modules/@mui/icons-material/index";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

const iconMap: Record<string, React.ReactNode> = {
  DashboardIcon: <GridViewIcon />,
  FolderIcon: <FolderIcon />,
  PeopleIcon: <PeopleIcon />,
  BusinessIcon: <BusinessIcon />,
  SecurityIcon: <SecurityIcon />,
  VpnKeyIcon: <VpnKeyIcon />,
  AssignmentIcon: <AssignmentIcon />,
  BarChartIcon: <BarChartIcon />,
  ChatIcon: <ChatIcon />,
  UploadIcon: <UploadFileOutlined />,
  ManageAccountsIcon: <ManageAccountsIcon />
};

const drawerWidth = 260;

const Sidebar: React.FC = () => {
  const { user } = useUser();
  const [open, setOpen] = useState<boolean>(false);
  const [collapsed] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const drawerRef = useRef<HTMLDivElement>(null);
  const accessDetails = (user?.role?.accessDetails ?? []) as {
    id: string;
    name: string;
    application: {
      access: ApplicationName;
      actions: ActionType[];
      _id: string;
    }[];
  }[];

  // Only include menu items the user has READ access to
  const filteredMenuItems = menuItemsData.filter((item) => {
    if (!item.access) return true; // Allow items like Dashboard
    return hasPermission(accessDetails, item.access as ApplicationName, ACTIONS.READ);
  });

  const selectedIndex = menuItemsData.findIndex((item) => pathname === item.path);

  const handleListItemClick = (index: number, path: string) => {
    router.push(path);
    if (isMobile) setOpen(false);
  };

  const toggleSidebar = () => {
    setOpen((prev) => !prev);
  };

  // Smooth hover logic
  let closeTimeout: NodeJS.Timeout;

  const handleMouseLeave = () => {
    if (!isMobile) {
      closeTimeout = setTimeout(() => setOpen(false), 200); // small delay
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      clearTimeout(closeTimeout);
      setOpen(true);
    }
  };

  return (
    <>
      {/* Desktop Menu Icon */}
      {!open && (
        <IconButton
          onClick={toggleSidebar}
          sx={{
            marginTop: "-12px",
            position: "fixed",
            top: 20,
            left: 20,
            backgroundColor: "#741B92",
            color: "#fff",
            "&:hover": { backgroundColor: "#5a1473" }
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          width: open ? drawerWidth : 60,
          flexShrink: 0,
          transition: "width 0.3s ease",
          whiteSpace: "nowrap",
          [`& .MuiDrawer-paper`]: {
            width: open ? drawerWidth : 60,
            transition: "width 0.3s ease",
            overflowX: "hidden",
            boxSizing: "border-box",
            background: "linear-gradient(180deg, #EFE2F3 0%, #D6C4E4 100%)",
            color: "#2A1237",
            borderRight: "1px solid #d3b7eb",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }
        }}
      >
        <div ref={drawerRef} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Toolbar>
            <Box sx={{ fontWeight: "bold", fontSize: "1.6rem", color: "#741B92" }}>
              {collapsed ? "" : "Go Task Today"}
            </Box>
          </Toolbar>

          <Box sx={{ overflow: "auto", px: 1, flex: 1, width: "100%" }}>
            <List>
              {filteredMenuItems.map((item, index) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    selected={selectedIndex === index}
                    onClick={() => handleListItemClick(index, item.path)}
                    sx={{
                      width: "100%",
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
                    <ListItemIcon sx={{ minWidth: "40px", color: "#741B92" }}>
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

          {/* User Info Card */}
          <Box sx={{ marginTop: "auto" }}>
            <UserInfoCard />
          </Box>
        </div>
      </Drawer>
    </>
  );
};

export default Sidebar;
