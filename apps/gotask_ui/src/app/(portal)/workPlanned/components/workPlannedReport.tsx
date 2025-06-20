"use client";
import React, { useState, useEffect, useMemo } from "react";
import { 
  Box, 
  Grid, 
  CircularProgress, 
  Typography, 
  Button
} from "@mui/material";
import { useWorkPlannedReport } from "../services/workPlannedServices";
import { fetchProject, fetchUser } from "../../task/service/taskAction";
import useSWR from "swr";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoSearchResultsImage from "@assets/placeholderImages/nofilterdata.svg";
import NoReportImage from "@assets/placeholderImages/noreportlog.svg"
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import WorkPlannedCalendarGrid from "./workPlannedCalendarGrid";
import { User } from "../interface/workPlanned";
import { Project } from "../../task/interface/taskInterface";
import WorkPlannedFiltersPanel from "./workPlannedFilterPanel";

// Define the payload type
interface Payload {
  fromDate: string;
  toDate: string;
  userIds: string[];
  selectedProjects: string[];
}

const getInitialFilters = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("workplanned_filters");
    return saved
      ? JSON.parse(saved)
      : {
          fromDate: "",
          toDate: "",
          userIds: [],
          projectIds: []
        };
  }
  return {
    fromDate: "",
    toDate: "",
    userIds: [],
    projectIds: []
  };
};

const WorkPlannedReport = () => {
  const transreport = useTranslations(LOCALIZATION.TRANSITION.REPORT);
  const [filters, setFilters] = useState(getInitialFilters);
  const isClient = typeof window !== "undefined";

  const {
    data: fetchedUserData,
    error: userError,
    isLoading: isUserLoading
  } = useSWR(isClient ? "fetchuser" : null, fetchUser, {
    revalidateOnFocus: false
  });

  const {
    data: fetchedProjectData,
    error: projectError,
    isLoading: isProjectLoading
  } = useSWR(isClient ? "fetchproject" : null, fetchProject, {
    revalidateOnFocus: false
  });

  const usersList: User[] = fetchedUserData?.data || [];
  const projectsList: Project[] = fetchedProjectData?.data || [];

  const updateFilter = (updated: Partial<typeof filters>) => {
    const newFilters = { ...filters, ...updated };
    setFilters(newFilters);
    if (isClient) {
      localStorage.setItem("workplanned_filters", JSON.stringify(newFilters));
    }
  };

  const resetFilters = () => {
    const cleared = {
      fromDate: "",
      toDate: "",
      userIds: [],
      projectIds: []
    };
    setFilters(cleared);
    if (isClient) {
      localStorage.setItem("workplanned_filters", JSON.stringify(cleared));
    }
  };

  const payload: Payload = {
    fromDate: filters.fromDate,
    toDate: filters.toDate,
    userIds: filters.userIds.length > 0 ? filters.userIds : [],
    selectedProjects: filters.projectIds.length > 0 ? filters.projectIds : []
  };
  
  const shouldFetch = filters.fromDate !== "" && filters.toDate !== "";

  const {
    data: reportData,
    isLoading: isReportLoading,
    isError: isReportError,
  } = useWorkPlannedReport(payload, shouldFetch);

//   useEffect(() => {
//     if (shouldFetch) {
//       console.log("Payload changed:", payload);
//       setLastFetchPayload(payload);
//     }
//   }, [shouldFetch, JSON.stringify(payload)]);

const memoizedPayload = useMemo(() => ({
  fromDate: filters.fromDate,
  toDate: filters.toDate,
  userIds: filters.userIds.length > 0 ? filters.userIds : [],
  selectedProjects: filters.projectIds.length > 0 ? filters.projectIds : []
}), [filters.fromDate, filters.toDate, filters.userIds, filters.projectIds]);

useEffect(() => {
  if (shouldFetch) {
    console.log("Payload changed:", memoizedPayload);
  }
}, [shouldFetch, memoizedPayload]);

  if (userError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{transreport("errorFetchingUsers")}</Typography>
      </Box>
    );
  }

  if (projectError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{transreport("errorFetchingProjects")}</Typography>
      </Box>
    );
  }

  if (isUserLoading || isProjectLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          {isClient && (
            <WorkPlannedFiltersPanel
              fromDate={filters.fromDate}
              toDate={filters.toDate}
              userIds={filters.userIds}
              projectIds={filters.projectIds}
              setFromDate={(val: string) => updateFilter({ fromDate: val })}
              setToDate={(val: string) => updateFilter({ toDate: val })}
              setUserIds={(val: string[]) => updateFilter({ userIds: val })}
              setProjectIds={(val: string[]) => updateFilter({ projectIds: val })}
              usersList={usersList}
              projectsList={projectsList}
            />
          )}
          <Button
            variant="outlined"
            color="primary"
            sx={{ mt: 2 }}
            onClick={resetFilters}
            fullWidth
          >
            {transreport("reset")}
          </Button>
        </Grid>

        <Grid item xs={12} md={9}>
          {isReportLoading && <CircularProgress />}
          
          {isReportError && (
            <Typography color="error">{transreport("error")}</Typography>
          )}
          
          {!filters.fromDate || !filters.toDate ? (
            <Grid item xs={12}>
              <EmptyState imageSrc={NoReportImage} message={transreport("loghelper")} />
            </Grid>
             ) : reportData && reportData.length === 0 ? (
            <Grid item xs={12}>
              <EmptyState imageSrc={NoSearchResultsImage} message={`No work planned data found for the selected date range`} />
            </Grid>
          ) : reportData ? (
            <WorkPlannedCalendarGrid
              data={reportData}
              fromDate={filters.fromDate}
              toDate={filters.toDate}
              selectedProjects={filters.projectIds}
            />
          ) : null}
        </Grid>
      </Grid>
    </Box>
  );
};

export default WorkPlannedReport;