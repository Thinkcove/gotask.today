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
import { User } from "../interfaces/userInterface";
import SearchBar from "@/app/component/searchBar/searchBar";
import Chat from "../../chatbot/components/chat";

const UserList = () => {
  const { canAccess } = useUserPermission();
  const transuser = useTranslations(LOCALIZATION.TRANSITION.USER);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: users, mutate: UserUpdate } = useSWR("fetch-user", fetcherUserList);

  const filteredUsers =
    users?.filter((user: User) => user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    null;

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        overflowY: "auto",
        maxHeight: "calc(100vh - 100px)",
        p: 3
      }}
    >
      <CreateUser open={isModalOpen} onClose={() => setIsModalOpen(false)} mutate={UserUpdate} />
      <Box mb={3} maxWidth={400}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          sx={{ width: "100%" }}
          placeholder={transuser("searchplaceholder")}
        />
      </Box>
      <UserCards users={filteredUsers} />

      <Chat />

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
