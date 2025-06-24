"use client";

import React from "react";
import { Box, Link } from "@mui/material";
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
}

const StoryFilters: React.FC<Props> = ({
  status,
  startDate,
  searchTerm,
  onStatusChange,
  onStartDateChange,
  onSearchChange,
  onClearFilters
}) => {
  const t = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);
  const statusOptions = getTranslatedStoryStatusOptions(t);

  const filtersApplied = status.length > 0 || !!startDate || !!searchTerm;

  return (
    <Box px={8} pt={3}>
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        flexWrap="wrap"
        sx={{
          mb: 1,
          justifyContent: "flex-start"
        }}
      >
        {/* SearchBar with fixed width */}
        <Box sx={{ flexShrink: 0 }}>
          <SearchBar
            value={searchTerm}
            onChange={onSearchChange}
            placeholder={t("Stories.filters.search")}
            sx={{ width: 250 }}
          />
        </Box>

        {/* Status Filter */}
        <Box sx={{ flexShrink: 0 }}>
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
        <Box sx={{ flexShrink: 0 }}>
          <DateDropdown
            dateFrom={startDate}
            dateTo={startDate}
            singleDateMode={true}
            onDateChange={(from) => {
              onStartDateChange(from);
            }}
            transtask={(key: string) => {
              if (key === "filterduedate") return t("Stories.filters.createdDate");
              if (key === "filtercreateddate") return t("Stories.filters.createdDate");
              if (key === "filterclear") return t("Stories.filters.clear");
              if (key === "filterapply") return t("Stories.filters.apply");
              return key;
            }}
          />
        </Box>

        {/* Clear All Link */}
        {filtersApplied && (
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
              {t("Stories.filters.clearAll")}
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default StoryFilters;
