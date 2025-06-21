"use client";

import React, { useState } from "react";
import { Box, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useSWR from "swr";
import ActionButton from "@/app/component/floatingButton/actionButton";
import SearchBar from "@/app/component/searchBar/searchBar";
import Chat from "../../chatbot/components/chat";
import UserCards from "./userCards";
import { fetcherUserList } from "../services/userAction";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/permission";
import { User } from "../interfaces/userInterface";
import UserStatusFilter from "@/app/component/filters/userFilter";
import { STATUS_CONFIG, getUserStatusColor } from "@/app/common/constants/status";
import { useRouter } from "next/navigation";

const UserList = () => {
  const { canAccess } = useUserPermission();
  const transuser = useTranslations(LOCALIZATION.TRANSITION.USER);
  const [searchTerm, setSearchTerm] = useState("");
  const [userStatusFilter, setUserStatusFilter] = useState<string[]>(["All"]);
  const { data: users } = useSWR("fetch-user", fetcherUserList);
  const router = useRouter();
  const filteredUsers =
    users
      ?.filter((user: User) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      ?.filter((user: User) => {
        if (userStatusFilter.length === 0 || userStatusFilter.includes(STATUS_CONFIG.ALL_STATUS))
          return true;
        return userStatusFilter.includes(
          user.status ? STATUS_CONFIG.STATUS_OPTIONS[0].id : STATUS_CONFIG.STATUS_OPTIONS[1].id
        );
      }) || null;

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
      <Box mb={2} display="flex" flexDirection="row" gap={2}>
        {/* Search Bar */}
        <Box mb={2} maxWidth={400}>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            sx={{ width: "100%" }}
            placeholder={transuser("searchplaceholder")}
          />
        </Box>
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            display: { xs: "none", sm: "block" },
            height: 50
          }}
        />

        {/* User Status Filter */}
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
      </Box>

      <UserCards users={filteredUsers} getUserStatusColor={getUserStatusColor} />

      {canAccess(APPLICATIONS.CHATBOT, ACTIONS.CREATE) && <Chat />}

      {canAccess(APPLICATIONS.USER, ACTIONS.CREATE) && (
        <ActionButton
          label={transuser("createusernew")}
          icon={<AddIcon sx={{ color: "white" }} />}
          onClick={() => router.push("/user/createUser")}
        />
      )}
    </Box>
  );
};

export default UserList;
