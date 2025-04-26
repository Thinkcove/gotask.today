"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Box } from "@mui/material";
import { useUser } from "./userContext";
import Sidebar from "./component/sidebar/sideBar";

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const pathname = usePathname();
  return (
    <Box>
      {/* Use Header instead of AppBar */}
      {user && pathname !== "/login" && <Sidebar />}

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
    </Box>
  );
}
