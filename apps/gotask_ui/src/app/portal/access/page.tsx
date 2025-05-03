import { Box, Typography } from "@mui/material";
import React from "react";
import AccessContainer from "../access/components/AccessContainer"; 

const AccessPage = () => {
  return (
    <div className="flex flex-col h-full m-0 p-4 overflow-hidden">
      {/* Header Section */}
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
          variant="h5"
          sx={{
            fontWeight: "600",
            textTransform: "capitalize"
          }}
        >
          Access
        </Typography>
      </Box>

      
      <div className="flex-1 overflow-hidden">
        <AccessContainer />
      </div>
    </div>
  );
};

export default AccessPage;
