"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import CreateUser from "../createUser/createUser"; 
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

const CreateUserPage: React.FC = () => {
  const transuser = useTranslations(LOCALIZATION.TRANSITION.USER);

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
          {transuser("createusernew")}
        </Typography>
      </Box>

      <CreateUser />
    </>
  );
};

export default CreateUserPage;