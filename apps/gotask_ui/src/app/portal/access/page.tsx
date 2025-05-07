import { LOCALIZATION } from "@/app/common/constants/localization";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import React from "react";
import AccessContainer from "../access/components/AccessContainer";

const Page = () => {
  const transaccess = useTranslations(LOCALIZATION.TRANSITION.ACCESS);

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#741B92",
          color: "white",
          p: 1.5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">{transaccess("access")}</Typography>
      </Box>
      <AccessContainer />
    </>
  );
};

export default Page;