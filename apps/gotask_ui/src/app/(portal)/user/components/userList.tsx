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
import { USER_FILTER_STORAGE_KEY } from "@/app/common/constants/user";

function getInitialUserFilters() {
  if (typeof window === "undefined") {
    return {
      searchTerm: "",
      userStatusFilter: ["All"]
    };
  }

  try {
    const stored = localStorage.getItem(USER_FILTER_STORAGE_KEY);
    return stored
      ? JSON.parse(stored)
      : {
          searchTerm: "",
          userStatusFilter: ["All"]
        };
  } catch {
    return {
      searchTerm: "",
      userStatusFilter: ["All"]
    };
  }
}

const UserList = () => {
  const { canAccess } = useUserPermission();
  const transuser = useTranslations(LOCALIZATION.TRANSITION.USER);
  const router = useRouter();

  const initialFilters = getInitialUserFilters();

  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm);
  const [userStatusFilter, setUserStatusFilter] = useState<string[]>(
    initialFilters.userStatusFilter
  );

  const { data: users } = useSWR("fetch-user", fetcherUserList);

  const updateFilterStorage = (next: { searchTerm?: string; userStatusFilter?: string[] }) => {
    const updated = {
      searchTerm: next.searchTerm ?? searchTerm,
      userStatusFilter: next.userStatusFilter ?? userStatusFilter
    };
    localStorage.setItem(USER_FILTER_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleStatusChange = (newValue: string[]) => {
    let updatedValue = newValue;

    if (newValue.includes("All")) {
      updatedValue = ["All"];
    } else {
      updatedValue = newValue.filter((val) => val !== "All");
    }

    setUserStatusFilter(updatedValue);
    updateFilterStorage({ userStatusFilter: updatedValue });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateFilterStorage({ searchTerm: value });
  };

  const handleClearStatus = () => {
    setUserStatusFilter(["All"]);
    updateFilterStorage({ userStatusFilter: ["All"] });
  };

  const filteredUsers =
    users
      ?.filter((user: User) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      ?.filter((user: User) => {
        if (userStatusFilter.length === 0 || userStatusFilter.includes(STATUS_CONFIG.ALL_STATUS)) {
          return true;
        }

        const userStatusId = user.status
          ? STATUS_CONFIG.STATUS_OPTIONS[0].id
          : STATUS_CONFIG.STATUS_OPTIONS[1].id;

        return userStatusFilter.includes(userStatusId);
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
            onChange={handleSearchChange}
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
          onStatusChange={handleStatusChange}
          onClearStatus={handleClearStatus}
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
