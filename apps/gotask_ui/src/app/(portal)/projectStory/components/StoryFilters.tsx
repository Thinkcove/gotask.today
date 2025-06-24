import React from "react";
import { Box, Link } from "@mui/material";
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

  const filtersApplied = status.length > 0 || !!startDate;

  return (
    <Box px={2} pt={10}>
      {/* Filters Row */}
      <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
        {/* Status Filter */}
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

        {/* Date Filter */}
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

        {/* Inline Clear All */}
        {filtersApplied && (
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
        )}
      </Box>
    </Box>
  );
};

export default StoryFilters;
