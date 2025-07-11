"use client";

import React from "react";
import { Box, IconButton, Link } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import FilterDropdown from "../../../component/input/filterDropDown";
import DateDropdown from "@/app/component/input/dateDropdown";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { getTranslatedStoryStatusOptions } from "@/app/common/constants/storyStatus";
import SearchBar from "@/app/component/searchBar/searchBar";

interface Props {
  status: string[];
  startDate: string;
  searchTerm: string;
  onStatusChange: (val: string[]) => void;
  onStartDateChange: (val: string) => void;
  onSearchChange: (val: string) => void;
  onClearFilters: () => void;
  onBack?: () => void;
}

const StoryFilters: React.FC<Props> = ({
  status,
  startDate,
  searchTerm,
  onStatusChange,
  onStartDateChange,
  onSearchChange,
  onClearFilters,
  onBack
}) => {
  const t = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);
  const statusOptions = getTranslatedStoryStatusOptions(t);

  const filtersApplied = status.length > 0 || !!startDate || !!searchTerm;

  return (
    <Box px={{ xs: 2, md: 2.5, lg: 2 }} pt={3}>
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="flex-start"
        gap={2}
      >
        {/* Row: Back Button + Search (ONLY on small screens) */}
        <Box
          display={{ xs: "flex", md: "none" }}
          flexDirection="row"
          alignItems="center"
          gap={1}
          width="100%"
        >
          {onBack && (
            <IconButton
              onClick={onBack}
              color="primary"
              size="medium"
              sx={{
                p: "6px",
                flexShrink: 0
              }}
            >
              <ArrowBack />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 1, maxWidth: 250 }}>
            <SearchBar
              value={searchTerm}
              onChange={onSearchChange}
              placeholder={t("Stories.filters.search")}
              sx={{ width: "100%", maxWidth: 250 }}
            />
          </Box>
        </Box>

        {/* Row: Back + Search (ONLY on medium/large screens) */}
        {onBack && (
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center"
            }}
          >
            <IconButton
              onClick={onBack}
              color="primary"
              size="medium"
              sx={{
                p: "6px",
                alignSelf: "center",
                mr: { md: 0 }
              }}
            >
              <ArrowBack />
            </IconButton>
          </Box>
        )}

        <Box
          sx={{
            display: { xs: "none", md: "block" },
            width: "100%",
            maxWidth: 250,
            flexShrink: 0
          }}
        >
          <SearchBar
            value={searchTerm}
            onChange={onSearchChange}
            placeholder={t("Stories.filters.search")}
            sx={{ width: "100%", maxWidth: 250 }}
          />
        </Box>

        {/* Filters Row  */}
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
          {/* Status Filter */}
          <Box sx={{ minWidth: 150, flexShrink: 0 }}>
            <FilterDropdown
              label={t("Stories.filters.status")}
              options={statusOptions.map((opt) => opt.label)}
              selected={statusOptions
                .filter((opt) => status.includes(opt.value))
                .map((opt) => opt.label)}
              onChange={(selectedLabels) => {
                const matchedValues = statusOptions
                  .filter((opt) => selectedLabels.includes(opt.label))
                  .map((opt) => opt.value);
                onStatusChange(matchedValues);
              }}
            />
          </Box>

          {/* Date Filter */}
          <Box sx={{ minWidth: 150, flexShrink: 0 }}>
            <DateDropdown
              dateFrom={startDate}
              dateTo={startDate}
              singleDateMode
              onDateChange={(from) => onStartDateChange(from)}
              transtask={(key: string) => {
                if (key === "filterduedate") return t("Stories.filters.createdDate");
                if (key === "filtercreateddate") return t("Stories.filters.createdDate");
                if (key === "filterclear") return t("Stories.filters.clear");
                if (key === "filterapply") return t("Stories.filters.apply");
                return key;
              }}
            />
          </Box>

          {/* Clear All - inline for large screens */}
          {filtersApplied && (
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
                {t("Stories.filters.clearAll")}
              </Link>
            </Box>
          )}
        </Box>

        {/* Clear All - visible separately on mobile */}
        {filtersApplied && (
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
              {t("Stories.filters.clearAll")}
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default StoryFilters;
