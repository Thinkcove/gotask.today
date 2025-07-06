import React, { useState, useMemo } from "react";
import { Grid, Box, Typography, Divider, Stack } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import useSWR from "swr";
import { fetchAllgetpermission } from "../services/permissionAction";
import SearchBar from "@/app/component/searchBar/searchBar";
import ActionButton from "@/app/component/floatingButton/actionButton";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { PermissionData } from "../interface/interface";

export const PermissionItem: React.FC<{
  permission: PermissionData;
  onClick: (permissionId: string) => void;
}> = ({ permission, onClick }) => {
  const color = "#741B92";

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: `${color}12`,
        border: `1px solid ${color}40`,
        transition: "all 0.2s ease-in-out",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        "&:hover": {
          boxShadow: `0 0 6px ${color}66`
        }
      }}
    >
      <Box>
        <Typography variant="subtitle1" fontWeight={500} textTransform="capitalize" sx={{ mb: 1 }}>
          {permission.user_name}
        </Typography>

        <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center" mb={1.5}>
          <Typography variant="body2" color="text.secondary">
            {new Date(permission.date).toLocaleDateString()}
          </Typography>

          <Divider orientation="vertical" sx={{ height: 20 }} />

          <Typography variant="body2" color="text.secondary">
            {permission.start_time} - {permission.end_time}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "#741B92",
              fontWeight: 500,
              cursor: "pointer",
              ml: "auto",
              "&:hover": {
                textDecoration: "underline"
              }
            }}
            onClick={() => onClick(permission.id)}
          >
            <Typography sx={{ textTransform: "capitalize", mr: 0.5 }}>View Details</Typography>
            <ArrowForward fontSize="small" />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};
