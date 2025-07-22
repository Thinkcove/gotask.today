import { Box } from "@mui/material";
import React from "react";
import FilterDropdown from "../input/filterDropDown";

interface ProjectFiltersProps {
  statusFilter: string[];
  userFilter: string[];
  allStatuses: string[];
  allUsers: string[];
  onStatusChange: (val: string[]) => void;
  onUserChange: (val: string[]) => void;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  statusFilter,
  userFilter,
  allStatuses,
  allUsers,
  onStatusChange,
  onUserChange
}) => {
  return (
    <Box display="flex" gap={2} mb={3} flexWrap="wrap">
      <FilterDropdown
        label="User"
        options={allUsers}
        selected={userFilter}
        onChange={onUserChange}
      />
      <FilterDropdown
        label="Status"
        options={allStatuses}
        selected={statusFilter}
        onChange={onStatusChange}
      />
    </Box>
  );
};

export default ProjectFilters;
