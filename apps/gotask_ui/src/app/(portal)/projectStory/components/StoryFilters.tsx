"use client";

import React from "react";
import { Box, Button, Tooltip } from "@mui/material";
import FilterDropdown from "../../../component/input/filterDropDown";
import DateDropdown from "@/app/component/input/dateDropdown";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { getTranslatedStoryStatusOptions } from "@/app/common/constants/storyStatus";

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
  const statusOptions = getTranslatedStoryStatusOptions(t);

  return (
    <Box display="flex" gap={2} px={2} pt={10} alignItems="center" flexWrap="wrap">
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

      <Tooltip title={t("Stories.filters.clearTooltip")}>
        <Button variant="outlined" size="small" onClick={onClearFilters} sx={{ height: 40 }}>
          {t("Stories.filters.clearFilters")}
        </Button>
      </Tooltip>
    </Box>
  );
};

export default StoryFilters;
