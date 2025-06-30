"use client";

import React, { useState, useMemo } from "react";
import { Box, Grid } from "@mui/material";
import useSWR from "swr";
import SearchBar from "@/app/component/searchBar/searchBar";
import { fetcherUserList } from "../../user/services/userAction";
import { useRouter } from "next/navigation";
import AssigneeCard from "./view/[id]/assigneeCard";
import { fetchTemplatesByUserId } from "../service/templateAction";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import TemplateToggle from "../component/templateToggle";
import { User } from "@/app/userContext";

interface assigneeListProps {
  initialView?: "template" | "assignee";
}

const AssigneeList: React.FC<assigneeListProps> = ({ initialView = "assignee" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"template" | "assignee">(initialView);
  const { data: users = [] } = useSWR("fetch-users", fetcherUserList);

  const { data: usersWithTemplates = [], isLoading } = useSWR(
    users.length ? "assigned-templates" : null,
    async () => {
      const result = await Promise.all(
        users.map(async (user: User) => {
          const assignedTemplates = await fetchTemplatesByUserId(user.id);
          return { ...user, assignedTemplates };
        })
      );
      return result;
    }
  );

  const router = useRouter();
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);

  const handleViewChange = (nextView: "template" | "assignee") => {
    if (nextView !== view) {
      setView(nextView);
      router.push(nextView === "template" ? "/kpi" : "/kpi/assignee");
    }
  };

  const filteredUsers = useMemo(() => {
    return usersWithTemplates.filter((user: User) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [usersWithTemplates, searchTerm]);

  return (
    <Box sx={{ p: 3, height: "calc(100vh - 100px)", overflowY: "auto" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box mb={3} maxWidth={400}>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            sx={{ width: "100%" }}
            placeholder={transkpi("searchemployees")}
          />
        </Box>
        <TemplateToggle view={view} onViewChange={handleViewChange} />
      </Box>

      <Grid container spacing={3}>
        {isLoading ? (
          <Box width="100%" textAlign="center" mt={4}>
            Loading...
          </Box>
        ) : (
          filteredUsers.map((user: any) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={user.id}>
              <AssigneeCard user={user} assignedTemplates={user.assignedTemplates || []} />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default AssigneeList;
