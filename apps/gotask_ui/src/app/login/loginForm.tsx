"use client";
import React, { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import { BackgroundContainer, LoginCard } from "./style";
import EmailLogin from "../login/EmailLogin";
import OtpLogin from "./OtpLogin";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "../common/constants/localization";

const LoginForm = () => {
  const [activeTab, setActiveTab] = useState(0);
  const translogin = useTranslations(LOCALIZATION.TRANSITION.LOGINCARD);

  return (
    <BackgroundContainer>
      <LoginCard>
        <Typography variant="h4" gutterBottom style={{ fontWeight: "bold" }}>
          {translogin("gotask")}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {translogin("worksmarter")}
        </Typography>

        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={translogin("emailpassword")} />
          <Tab label={translogin("otplogin")} />
        </Tabs>
       
<Box flexGrow={1}>
  <Box
    minHeight="220px"
    display="flex"
    flexDirection="column"
    justifyContent="center"
  >
    {activeTab === 0 && <EmailLogin />}
    {activeTab === 1 && <OtpLogin />}
  </Box>
</Box>

      </LoginCard>
    </BackgroundContainer>
  );
};

export default LoginForm;
