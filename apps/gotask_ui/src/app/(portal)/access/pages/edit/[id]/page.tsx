import React from "react";
import AccessEditForm from "../../../components/AccessEditForm";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { Box } from "@mui/material";

const AccessEditPage = () => {
  const transAccess = useTranslations(LOCALIZATION.TRANSITION.ACCESS);

  return (
    <>
      <ModuleHeader name={transAccess("editaccess")} />
      <Box sx={{ flex: 1, overflow: "hidden", p: 2 }}>
        <AccessEditForm />
      </Box>
    </>
  );
};

export default AccessEditPage;
