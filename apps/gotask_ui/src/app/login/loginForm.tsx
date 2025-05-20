"use client";
import React from "react";
import { Typography, Box } from "@mui/material";
import { BackgroundContainer, LoginCard } from "./style";
import OtpLogin from "./OtpLogin";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "../common/constants/localization";

const LoginForm = () => {
  const translogin = useTranslations(LOCALIZATION.TRANSITION.LOGINCARD);

  return (
    <BackgroundContainer>
      <LoginCard
        sx={{
          padding: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start"
        }}
      >
        <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", marginTop: "8px" }}>
          {translogin("gotask")}
        </Typography>

        <Typography variant="subtitle1" gutterBottom style={{ marginBottom: "5px" }}>
          {translogin("worksmarter")}
        </Typography>

        <Box width="100%" mt={2}>
          <OtpLogin />
        </Box>
      </LoginCard>
    </BackgroundContainer>
  );
};

export default LoginForm;
