import React from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import FilterDropdown from "../input/filterDropDown"; 
import { ProjectStatuses } from "../../common/constants/project";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

interface ProjectFiltersProps {
  statusFilter: string[];
  userFilter: string[];
  onStatusChange: (selectedStatuses: string[]) => void;
  onUserChange: (selectedUsers: string[]) => void;
  onClearFilters: () => void;
  userOptions: string[];
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  statusFilter,
  userFilter,
  onStatusChange,
  onUserChange,
  onClearFilters,
  userOptions,
}) => {
  const transproject = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        mb: 3,
        p: 2,
        borderRadius: 2,
        backgroundColor: "#f7f7f7",
        boxShadow: 2,
        alignItems: "flex-start",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        {transproject("filters")}
      </Typography>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6}>
          <FilterDropdown
            label={transproject("status")}
            options={ProjectStatuses.map(status => status.value)}
            selected={statusFilter}
            onChange={onStatusChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FilterDropdown
            label={transproject("user")}
            options={userOptions}
            selected={userFilter}
            onChange={onUserChange}
          />
        </Grid>
      </Grid>

      <Button variant="outlined" onClick={onClearFilters}>
        {transproject("clearfilters")}
      </Button>
    </Box>
  );
};

export default ProjectFilters;
