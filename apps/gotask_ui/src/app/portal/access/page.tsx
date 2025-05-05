import { LOCALIZATION } from "@/app/common/constants/localization";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import React from "react";
import AccessContainer from "../access/components/AccessContainer"; 

const page = () => {
  const transaccess = useTranslations(LOCALIZATION.TRANSITION.ACCESS);
  return (
    <Box
      sx={{
        backgroundColor: "#741B92", // Solid color for a bold look   
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
          backgroundColor: "#741B92", 
          color: "white",
          p: 1.5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
    >
        {transaccess("access")}
      </Typography>
    </Box>
  );
};

export default page; 
