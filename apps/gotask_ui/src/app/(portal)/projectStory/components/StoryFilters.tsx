"use client";

import React from "react";
import { Box, Button, Tooltip } from "@mui/material";
import FilterDropdown from "../../../component/input/filterDropDown";
import DateDropdown from "@/app/component/input/dateDropdown";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

interface Props {
  status: string[];
  startDate: string;
  onStatusChange: (val: string[]) => void;
  onStartDateChange: (val: string) => void;
  onClearFilters: () => void;
}

const StoryFilters: React.FC<Props> = ({
  status,
  startDate,
  onStatusChange,
  onStartDateChange,
  onClearFilters
}) => {
  const t = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);

  const statusOptions = [
    { label: t("Stories.filters.toDo"), value: "to-do" },
    { label: t("Stories.filters.inProgress"), value: "in-progress" },
    { label: t("Stories.filters.done"), value: "done" }
  ];

  return (
    <Box display="flex" gap={2} px={2} pt={10} alignItems="center" flexWrap="wrap">
      {/*  Multi-select Status Filter */}
      <FilterDropdown
        label={t("Stories.filters.status")}
        options={statusOptions.map((opt) => opt.label)}
        selected={statusOptions.filter((opt) => status.includes(opt.value)).map((opt) => opt.label)}
        onChange={(selectedLabels) => {
          const matchedValues = statusOptions
            .filter((opt) => selectedLabels.includes(opt.label))
            .map((opt) => opt.value);
          onStatusChange(matchedValues);
        }}
      />

      {/* Use created date only (startDate) */}
      <DateDropdown
        dateFrom={startDate}
        dateTo={startDate} // same value so user sees one date
        onDateChange={(from) => {
          onStartDateChange(from); // store only FROM (startDate)
        }}
        transtask={(key: string) => {
          if (key === "filterduedate") return t("Stories.filters.createdDate");
          if (key === "filterclear") return t("Stories.filters.clear");
          if (key === "filterapply") return t("Stories.filters.apply");
          return key;
        }}
      />

      {/* Clear All Filters */}
      <Tooltip title={t("Stories.filters.clearTooltip")}>
        <Button variant="outlined" size="small" onClick={onClearFilters} sx={{ height: 40 }}>
          {t("Stories.filters.clearFilters")}
        </Button>
      </Tooltip>
    </Box>
  );
};

export default StoryFilters;
