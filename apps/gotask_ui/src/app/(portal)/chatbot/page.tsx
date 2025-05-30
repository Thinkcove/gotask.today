"use client";
import { Box } from "@mui/material";
import React from "react";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import ModuleHeader from "@/app/component/appBar/moduleHeader";
import Chatbot from "./components/chat";

const Page = () => {
  const transchatbot = useTranslations(LOCALIZATION.TRANSITION.CHATBOT);
  return (
    <Box>
      <ModuleHeader name={transchatbot("viewname")} />
      <Chatbot />
    </Box>
  );
};

export default Page;
