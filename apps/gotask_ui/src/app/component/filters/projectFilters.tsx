"use client";
import { Box, Link, Skeleton } from "@mui/material";
import React from "react";
import FilterDropdown from "../input/filterDropDown";
import { useTranslations } from "next-intl";
import SearchBar from "@/app/component/searchBar/searchBar";

interface ProjectFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  statusFilter: string[];
  userFilter: string[];
  allStatuses: string[];
  allUsers: string[];
  onStatusChange: (val: string[]) => void;
  onUserChange: (val: string[]) => void;
  onClearFilters?: () => void;
  filtersApplied?: boolean;
  loading?: boolean;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  userFilter,
  allStatuses,
  allUsers,
  onStatusChange,
  onUserChange,
  onClearFilters,
  filtersApplied,
  loading = false
}) => {
  const t = useTranslations();

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { sm: "center" },
          gap: 2,
          flexWrap: "nowrap"
        }}
      >
        {/* Search Bar */}
        <Box sx={{ width: { xs: "100%", sm: "300px" } }}>
          {loading ? (
            <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
          ) : (
            <SearchBar
              value={searchTerm}
              onChange={onSearchChange}
              sx={{ width: "100%" }}
              placeholder={t("Projects.searchplaceholder")}
            />
          )}
        </Box>

        {/* Filters */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            overflowX: { xs: "auto", sm: "visible" },
            gap: 2,
            width: "100%",
            pt: { xs: 1, sm: 0 },
            pb: 1,
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none"
          }}
        >
          {/* User Filter */}
          <Box sx={{ minWidth: 150 }}>
            {loading ? (
              <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
            ) : (
              <FilterDropdown
                label={t("Projects.Stories.filters.user")}
                options={allUsers}
                selected={userFilter}
                onChange={onUserChange}
              />
            )}
          </Box>

          {/* Status Filter */}
          <Box sx={{ minWidth: 150 }}>
            {loading ? (
              <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
            ) : (
              <FilterDropdown
                label={t("Projects.Stories.filters.status")}
                options={allStatuses}
                selected={statusFilter}
                onChange={onStatusChange}
              />
            )}
          </Box>

          {/* Clear All Link */}
          {!loading && filtersApplied && onClearFilters && (
            <Link
              component="button"
              onClick={onClearFilters}
              underline="always"
              sx={{
                fontSize: "1rem",
                color: "primary.main",
                whiteSpace: "nowrap",
                flexShrink: 0
              }}
            >
              {t("Projects.Stories.filters.clearAll")}
            </Link>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectFilters;
