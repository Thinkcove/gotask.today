"use client";
import React, { useState } from "react";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ActionButton from "@/app/component/floatingButton/actionButton";
import useSWR from "swr";
import UserCards from "./userCards";
import { fetcherUserList } from "../services/userAction";
import CreateUser from "./createUser";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/authCheck";

const UserList = () => {
  const { canAccess } = useUserPermission();
  const transuser = useTranslations(LOCALIZATION.TRANSITION.USER);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: projects, error, mutate: UserUpdate } = useSWR("fetch-user", fetcherUserList);

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        overflowY: "auto",
        maxHeight: "calc(100vh - 100px)"
      }}
    >
      <CreateUser open={isModalOpen} onClose={() => setIsModalOpen(false)} mutate={UserUpdate} />

      <UserCards users={projects} error={error} />

      {/* Add User Button */}
      {canAccess(APPLICATIONS.USER, ACTIONS.CREATE) && (
        <ActionButton
          label={transuser("createusernew")}
          icon={<AddIcon sx={{ color: "white" }} />}
          onClick={() => setIsModalOpen(true)}
        />
      )}
    </Box>
  );
};

export default UserList;
