"use client";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { Box } from "@mui/material";
import React from "react";
import Upload from "./component/uploadList";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

const Page = () => {
  const transchatbot = useTranslations(LOCALIZATION.TRANSITION.CHATBOT);
  return (
    <Box>
      <ModuleHeader name={transchatbot("name")} />
      <Upload />
    </Box>
  );
};

export default Page;
