"use client";
import React, { useState, useMemo } from "react";
import { Box, Grid, CircularProgress, Typography, Button } from "@mui/material";
import { useWorkPlannedReport } from "../services/workPlannedServices";
import { fetchProject, fetchUser } from "../../task/service/taskAction";
import useSWR from "swr";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoReportImage from "@assets/placeholderImages/noreportlog.svg";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import WorkPlannedCalendarGrid from "./workPlannedCalendarGrid";
import { Payload, User } from "../interface/workPlanned";
import { Project } from "../../task/interface/taskInterface";
import WorkPlannedFiltersPanel from "./workPlannedFilterPanel";
import { Filters } from "../interface/workPlanned";
import DownloadIcon from "@mui/icons-material/Download";

const getStoredFilters = (): Filters | null => {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem("workplanned_filters");
  return saved ? JSON.parse(saved) : null;
};
const saveFiltersToStorage = (filters: Filters) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("workplanned_filters", JSON.stringify(filters));
  }
};

const getInitialFilters = (): Filters => {
  const stored = getStoredFilters();

  return (
    stored || {
      fromDate: "",
      toDate: "",
      userIds: [],
      projectIds: []
    }
  );
};

const WorkPlannedReport = () => {
  const transreport = useTranslations(LOCALIZATION.TRANSITION.REPORT);
  const [filters, setFilters] = useState<Filters>(getInitialFilters);
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

  const payload: Payload = useMemo(() => {
    const newPayload = {
      fromDate: filters.fromDate,
      toDate: filters.toDate,
      userIds: filters.userIds.length > 0 ? filters.userIds : [],
      selectedProjects: filters.projectIds.length > 0 ? filters.projectIds : []
    };

    return newPayload;
  }, [filters.fromDate, filters.toDate, filters.userIds, filters.projectIds]);
  const shouldFetch = filters.fromDate !== "" && filters.toDate !== "";

  const {
    data: reportData,
    isLoading: isReportLoading,
    isError: isReportError
  } = useWorkPlannedReport(payload, shouldFetch);

  // Optimized update function with automatic persistence
  const updateFilter = (updated: Partial<typeof filters>) => {
    setFilters((prevFilters: Filters) => {
      const newFilters = { ...prevFilters, ...updated };
      saveFiltersToStorage(newFilters);
      return newFilters;
    });
  };

  const resetFilters = () => {
    const cleared: Filters = {
      fromDate: "",
      toDate: "",
      userIds: [],
      projectIds: []
    };
    setFilters(cleared);
    saveFiltersToStorage(cleared);
  };

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
  const handleDownload = () => {
    if (!reportData?.length) return;

    const fileName = "work_planned_report.csv";
    const headers = Object.keys(reportData[0]);

    const csvRows = [
      headers.join(","), // header row
      ...reportData.map((row: Record<string, any>) =>
        headers
          .map((key) => {
            const value = row[key];
            return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : (value ?? "");
          })
          .join(",")
      )
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              sx={{
                alignItems: "center",
                whiteSpace: "nowrap",
                textTransform: "none",
                "& .MuiButton-startIcon": {
                  margin: { xs: 0, lg: "0 8px 0 -4px" }
                },
                minWidth: { xs: "40px", lg: "auto" },
                width: { xs: "40px", lg: "auto" },
                height: "40px",
                padding: { xs: "8px", lg: "6px 16px" },
                borderRadius: "8px",
                "& .button-text": {
                  display: { xs: "none", lg: "inline" }
                }
              }}
            >
              <span className="button-text">{transreport("downloadworkplanned")}</span>
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={9}>
          {isReportLoading && <CircularProgress />}

          {isReportError && <Typography color="error">{transreport("error")}</Typography>}

          {!filters.fromDate || !filters.toDate ? (
            <Grid item xs={12}>
              <EmptyState imageSrc={NoReportImage} message={transreport("loghelper")} />
            </Grid>
          ) : reportData ? (
            <WorkPlannedCalendarGrid
              data={reportData}
              fromDate={filters.fromDate}
              toDate={filters.toDate}
              selectedProjects={filters.projectIds}
              isUserSelected={filters.userIds}
            />
          ) : null}
        </Grid>
      </Grid>
    </Box>
  );
};

export default WorkPlannedReport;
