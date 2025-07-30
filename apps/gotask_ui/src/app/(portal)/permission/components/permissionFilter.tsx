import React from "react";
import { Box, Link, Skeleton } from "@mui/material";
import DateDropdown from "@/app/component/input/dateDropdown";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { PermissionFilterProps } from "../interface/interface";
import FilterDropdown from "@/app/component/input/filterDropDown";
import SkeletonLoader from "@/app/component/loader/skeletonLoader";

const PermissionFilter: React.FC<PermissionFilterProps> = ({
  onUserChange,
  dateFrom,
  dateTo,
  onDateChange,
  showClear = false,
  clearText,
  onClearFilters,
  allUsers,
  userFilter,
  loading = false
}) => {
  const transpermission = useTranslations(LOCALIZATION.TRANSITION.PERMISSION);

  return (
    <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
      <Box
        display="flex"
        flexGrow={1}
        gap={1}
        flexDirection="row"
        sx={{
          width: "100%",
          maxWidth: "100%",
          overflowX: "auto",
          "&::-webkit-scrollbar": { display: "none" }
        }}
      >
        {/* User Dropdown */}
        <Box display="flex" justifyContent={{ xs: "center", sm: "flex-start" }} flexGrow={1}>
          <Box sx={{ width: { sm: "auto", xs: "100%" } }}>
            {loading ? (
              <SkeletonLoader count={2} />
            ) : (
              <FilterDropdown
                label={transpermission("filteruser")}
                options={allUsers}
                selected={userFilter}
                onChange={onUserChange}
              />
            )}
          </Box>
        </Box>

        {/* Filters */}
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          px={2}
          justifyContent={{ xs: "center", sm: "flex-start" }}
          flexWrap="wrap"
          sx={{
            width: "100%"
          }}
        >
          {loading ? (
            <Skeleton
              variant="rectangular"
              width={220}
              height={42}
              sx={{ borderRadius: 1 }}
              animation="wave"
            />
          ) : (
            <DateDropdown
              dateFrom={dateFrom}
              dateTo={dateTo}
              onDateChange={onDateChange}
              transtask={transpermission}
              placeholder={transpermission("filterdate")}
            />
          )}
          {showClear && onClearFilters && (
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

export default PermissionFilter;
