"use client";

import React from "react";
import {
  Typography,
  Grid,
  CircularProgress,
  Box,
  Stack,
  Divider,
} from "@mui/material";
import { CalendarMonth, ArrowForward } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import CardComponent from "@/app/component/card/cardComponent";
import { AccessData } from "../interfaces/accessInterfaces";
import { userPermission } from "@/app/common/utils/userPermission";
import { APPLICATIONS, ACTIONS } from "@/app/common/utils/authCheck";

interface Props {
  data: AccessData[];
  loading?: boolean;
  error?: string | null;
}

const AccessCards: React.FC<Props> = ({ data, loading = false, error }) => {
  const { canAccess } = userPermission();
  const router = useRouter();

  console.log("AccessCards data:", data); // Debug log
  console.log("AccessCards loading:", loading); // Debug log
  console.log("AccessCards error:", error); // Debug log

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="body1" color="text.secondary">
          No Access Roles Available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {data.map((access) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={access.id}>
            <CardComponent>
              <Stack spacing={2} sx={{ height: "100%" }}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{ textTransform: "capitalize" }}
                >
                  {access.name}
                </Typography>
                {access.createdAt && (
                  <Box display="flex" alignItems="center">
                    <CalendarMonth sx={{ fontSize: 20, color: "#741B92", mr: 1 }} />
                    <Typography variant="body2" fontWeight={500} color="text.secondary">
                      {new Date(access.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
                <Divider />
                {canAccess(APPLICATIONS.ACCESS, ACTIONS.VIEW) && (
                  <Box display="flex" justifyContent="flex-end">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#741B92",
                        fontWeight: 500,
                        cursor: "pointer",
                        "&:hover": { textDecoration: "underline" },
                      }}
                      onClick={() => {
                        router.push(`/portal/access/pages/view/${access.id}`);
                      }}
                    >
                      <Typography sx={{ textTransform: "capitalize", mr: 0.5 }}>
                        View Details
                      </Typography>
                      <ArrowForward fontSize="small" />
                    </Box>
                  </Box>
                )}
              </Stack>
            </CardComponent>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AccessCards;