"use client";
import { Box, Link } from "@mui/material";
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
  filtersApplied
}) => {
  const t = useTranslations();
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      flexWrap="wrap"
      gap={2}
      justifyContent="flex-start"
    >
      <SearchBar
        value={searchTerm}
        onChange={onSearchChange}
        sx={{ minWidth: 250, flex: 1 }}
        placeholder={t("Projects.searchplaceholder")}
      />

      <FilterDropdown
        label={t("Projects.Stories.filters.user")}
        options={allUsers}
        selected={userFilter}
        onChange={onUserChange}
      />

      <FilterDropdown
        label={t("Projects.Stories.filters.status")}
        options={allStatuses}
        selected={statusFilter}
        onChange={onStatusChange}
      />

      {filtersApplied && onClearFilters && (
        <Link
          component="button"
          onClick={onClearFilters}
          underline="always"
          sx={{
            fontSize: "1rem",
            color: "primary.main",
            whiteSpace: "nowrap"
          }}
        >
          {t("Projects.Stories.filters.clearAll")}
        </Link>
      )}
    </Box>
  );
};
export default ProjectFilters;
