"use client";

import { ReactNode } from "react";
import { Box, Container } from "@mui/material";
import Header from "./component/appBar/header";
import { useUser } from "./userContext";

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useUser();
  return (
    <Box>
      {/* Use Header instead of AppBar */}
      {user && <Header />}

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
    </Box>
  );
}
