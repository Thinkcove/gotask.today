import { Box, Typography } from "@mui/material";
import React from "react";
import OrganizationList from "./components/organizationList";

const page = () => {
  return (
    <>
      <Box
        sx={{
          backgroundColor: "#741B92",
          color: "white",
          p: 1.5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "600",
            textTransform: "capitalize"
          }}
        >
          Organization
        </Typography>
      </Box>
      <OrganizationList />
    </>
  );
};

export default page;
