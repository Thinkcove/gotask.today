// PermissionLoadingState.tsx - Loading Component
import React from "react";
import { Box, CircularProgress } from "@mui/material";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { PermissionLoadingStateProps } from "../interface/interface";



const PermissionLoadingState: React.FC<PermissionLoadingStateProps> = ({ title }) => {
  return (
    <>
      <ModuleHeader name={title} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh"
        }}
      >
        <CircularProgress />
      </Box>
    </>
  );
};

export default PermissionLoadingState;
