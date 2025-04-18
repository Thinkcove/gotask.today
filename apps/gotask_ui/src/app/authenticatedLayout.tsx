"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Box } from "@mui/material";
import Header from "./component/appBar/header";
import { useUser } from "./userContext";

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useUser();
  const pathname = usePathname();
  return (
    <Box>
      {/* Use Header instead of AppBar */}
      {user && pathname !== "/login" && <Header />}

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
    </Box>
  );
}
