import React from "react";
import { Box, IconButton, Link } from "@mui/material";
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
  searchPlaceholder,
  filterpriority,
  filterstatus
}) => {
  const filtersApplied =
    (statusFilter && statusFilter.length > 0) ||
    (severityFilter && severityFilter.length > 0) ||
    !!searchTerm;

  return (
    <Box px={2} pt={3}>
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="flex-start"
        gap={2}
      >
        {/* Back + Search */}
        <Box display="flex" flexDirection="row" alignItems="center" gap={1} width="100%">
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

        {/* Filters Row - horizontal scroll */}
        <Box
          display="flex"
          flexDirection="row"
          flexWrap="nowrap"
          overflow="auto"
          gap={2}
          sx={{
            flexGrow: 1,
            minWidth: 0,
            mt: { xs: 1, md: 0 },
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none"
          }}
        >
          <Box sx={{ minWidth: 150, flexShrink: 0 }}>
            <FilterDropdown
              label={filterstatus}
              options={statusOptions}
              selected={statusFilter}
              onChange={onStatusChange}
            />
          </Box>
          <Box sx={{ minWidth: 150, flexShrink: 0 }}>
            <FilterDropdown
              label={filterpriority}
              options={priorityOptions}
              selected={severityFilter}
              onChange={onSeverityChange}
            />
          </Box>

          {showClear && filtersApplied && (
            <Box
              sx={{
                flexShrink: 0,
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                pl: 1
              }}
            >
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

        {/* Clear All - visible separately on mobile */}
        {showClear && filtersApplied && (
          <Box
            sx={{
              mt: 1,
              mb: 1,
              display: { xs: "flex", md: "none" },
              justifyContent: "flex-end",
              width: "100%"
            }}
          >
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
  );
};

export default GoalFilterBar;
