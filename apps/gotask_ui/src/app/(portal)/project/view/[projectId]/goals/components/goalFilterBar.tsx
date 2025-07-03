import React from "react";
import { Box, Divider, IconButton, Link } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import FilterDropdown from "@/app/component/input/filterDropDown";
import SearchBar from "@/app/component/searchBar/searchBar";
import { GoalFiltersBar } from "../interface/projectGoal";

const GoalFilterBar: React.FC<GoalFiltersBar> = ({
  searchTerm,
  onSearchChange,
  onBack,
  statusFilter,
  severityFilter,
  onStatusChange,
  onSeverityChange,
  onClearFilters,
  statusOptions,
  priorityOptions,
  showClear,
  clearText,
  searchPlaceholder
}) => {
  return (
    <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
      <Box
        display="flex"
        gap={{ xs: 0.5, sm: 1 }}
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        sx={{ width: "100%" }}
      >
        {/* Back + Search */}
        <Box display="flex" gap={1} alignItems="center" sx={{ width: { xs: "100%", sm: "auto" } }}>
          <IconButton color="primary" onClick={onBack}>
            <ArrowBack />
          </IconButton>
          <Box
            sx={{
              flexGrow: 1,
              maxWidth: { xs: "none", sm: 400 },
              minWidth: { xs: "auto", sm: 200 }
            }}
          >
            <SearchBar
              value={searchTerm}
              onChange={onSearchChange}
              sx={{ width: "100%" }}
              placeholder={searchPlaceholder}
            />
          </Box>
        </Box>
        <Divider orientation="vertical" sx={{ pr: 2, height: 30 }} />

        {/* Filters */}
        <Box
          display="flex"
          alignItems="center"
          gap={{ xs: 1, sm: 2 }}
          px={{ xs: 8, sm: 2 }}
          py={{ xs: 1, sm: 1 }}
          justifyContent="flex-start"
          flexWrap="wrap"
          mt={{ xs: 1, sm: 0 }}
          sx={{
            width: "100%",
            "& .MuiFormControl-root": {
              minWidth: { xs: "auto", sm: "120px" },
              maxWidth: { xs: "auto", sm: "none" }
            }
          }}
        >
          <FilterDropdown
            label="Status"
            options={statusOptions}
            selected={statusFilter}
            onChange={onStatusChange}
          />
          <FilterDropdown
            label="Priority"
            options={priorityOptions}
            selected={severityFilter}
            onChange={onSeverityChange}
          />
          {showClear && (
            <Box sx={{ flexShrink: 0 }}>
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
                {clearText}
              </Link>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default GoalFilterBar;
