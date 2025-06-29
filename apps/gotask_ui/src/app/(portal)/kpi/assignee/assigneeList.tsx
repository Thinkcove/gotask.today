"use client";

import React, { useEffect, useState } from "react";
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

interface assigneeListProps {
  initialView?: "template" | "assignee";
}

const AssigneeList: React.FC<assigneeListProps> = ({ initialView = "assignee" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [usersWithTemplates, setUsersWithTemplates] = useState<any[]>([]);
  const { data: users = [] } = useSWR("fetch-users", fetcherUserList);
  const router = useRouter();
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const [view, setView] = useState<"template" | "assignee">(initialView);

  useEffect(() => {
    const loadAssignments = async () => {
      const result = await Promise.all(
        users.map(async (user: any) => {
          const assignedTemplates = await fetchTemplatesByUserId(user.id);
          return { ...user, assignedTemplates };
        })
      );
      setUsersWithTemplates(result);
    };

    if (users.length) loadAssignments();
  }, [users]);

  const handleViewChange = (nextView: "template" | "assignee") => {
    if (nextView !== view) {
      setView(nextView);
      if (nextView === "template") {
        router.push("/kpi");
      } else {
        router.push("/kpi/assignee");
      }
    }
  };

  const filteredUsers = usersWithTemplates.filter((user: any) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {filteredUsers.map((user: any) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={user.id}>
            <AssigneeCard user={user} assignedTemplates={user.assignedTemplates || []} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AssigneeList;
