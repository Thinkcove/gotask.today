"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useSWR from "swr";

import ActionButton from "@/app/component/floatingButton/actionButton";
import SearchBar from "@/app/component/searchBar/searchBar";
import Chat from "../../chatbot/components/chat";

import CreateUser from "./createUser";
import UserCards from "./userCards";

import { fetcherUserList } from "../services/userAction";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/permission";
import { User } from "../interfaces/userInterface";
import UserStatusFilter from "@/app/component/filters/userFilter";

const UserList = () => {
  const { canAccess } = useUserPermission();
  const transuser = useTranslations(LOCALIZATION.TRANSITION.USER);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userStatusFilter, setUserStatusFilter] = useState<string[]>(["All"]);

  const { data: users, mutate: UserUpdate } = useSWR("fetch-user", fetcherUserList);

  const filteredUsers =
    users
      ?.filter((user: User) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      ?.filter((user: User) => {
        if (userStatusFilter.length === 0 || userStatusFilter.includes("All")) return true;
        return userStatusFilter.includes(user.status ? "Active" : "Inactive");
      }) || null;

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        overflowY: "auto",
        maxHeight: "calc(100vh - 100px)",
        p: 3,
      }}
    >
      <CreateUser open={isModalOpen} onClose={() => setIsModalOpen(false)} mutate={UserUpdate} />

      <Box mb={2} maxWidth={400}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          sx={{ width: "100%" }}
          placeholder={transuser("searchplaceholder")}
        />
      </Box>

      <UserStatusFilter
        userStatus={userStatusFilter}
        onStatusChange={(newValue) => {
          if (newValue.includes("All")) {
            setUserStatusFilter(["All"]);
          } else {
            setUserStatusFilter(newValue.filter((val) => val !== "All"));
          }
        }}
        onClearStatus={() => setUserStatusFilter(["All"])}
        transuser={transuser}
      />

      <UserCards users={filteredUsers} />

      {canAccess(APPLICATIONS.CHATBOT, ACTIONS.CREATE) && <Chat />}

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
