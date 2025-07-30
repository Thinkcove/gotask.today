import React from "react";
import { Box, Link, Skeleton } from "@mui/material";
import FilterDropdown from "@/app/component/input/filterDropDown";
import DateDropdown from "@/app/component/input/dateDropdown";
import SearchBar from "@/app/component/searchBar/searchBar";
import { ALLOCATION, NOT_UTILIZED, OVERUTILIZED, systemTypeOptions } from "../assetConstants";

interface Props {
  modelNameFilter: string[];
  assignedToFilter: string[];
  allUsers: string[];
  onAssignedToChange: (val: string[]) => void;
  onClearFilters: () => void;
  trans: (key: string) => string;
  hideModelNameFilter?: boolean;
  hideAssignedToFilter?: boolean;
  statusFilter?: string[];
  allStatuses?: string[];
  onStatusChange?: (val: string[]) => void;
  dateFrom?: string;
  dateTo?: string;
  onDateChange?: (from: string, to: string) => void;
  systemTypeFilter?: string[];
  allSystemTypes?: string[];
  onSystemTypeChange?: (val: string[]) => void;
  assetAllocationFilter?: string[];
  onAssetAllocationChange?: (val: string[]) => void;
  assetTypeFilter?: string[];
  allAssetTypes?: string[];
  onAssetTypeChange?: (val: string[]) => void;
  loading?: boolean;
  searchText?: string;
  onSearchTextChange?: (val: string) => void;
  searchPlaceholder?: string;
  assetsToggle?: React.ReactNode;
  downloadAssets?: React.ReactNode;
}

const AssetFilters: React.FC<Props> = ({
  modelNameFilter,
  assignedToFilter,
  allUsers,
  onAssignedToChange,
  onClearFilters,
  trans,
  hideModelNameFilter,
  hideAssignedToFilter,
  statusFilter,
  allStatuses,
  onStatusChange,
  dateFrom,
  dateTo,
  onDateChange,
  systemTypeFilter,
  allSystemTypes,
  onSystemTypeChange,
  assetAllocationFilter,
  onAssetAllocationChange,
  assetTypeFilter,
  allAssetTypes,
  onAssetTypeChange,
  loading = false,
  searchText,
  onSearchTextChange,
  searchPlaceholder,
  assetsToggle,
  downloadAssets
}) => {
  const disableAssignedToFilter =
    assetAllocationFilter?.includes(NOT_UTILIZED) && !assetAllocationFilter?.includes(OVERUTILIZED);

  const appliedFilterCount =
    (hideModelNameFilter ? 0 : modelNameFilter.length > 0 ? 1 : 0) +
    (hideAssignedToFilter ? 0 : assignedToFilter.length > 0 ? 1 : 0) +
    (systemTypeFilter && systemTypeFilter.length > 0 ? 1 : 0) +
    (dateFrom ? 1 : 0) +
    (dateTo ? 1 : 0) +
    (assetAllocationFilter && assetAllocationFilter.length > 0 ? 1 : 0) +
    (assetTypeFilter && assetTypeFilter.length > 0 ? 1 : 0) +
    (statusFilter && statusFilter.length > 0 ? 1 : 0);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          gap: 1,
          px: 2,
          pl: 2,
          flexWrap: "nowrap"
        }}
      >
        {onSearchTextChange && (
          <Box
            sx={{
              flex: "1 1 auto",
              maxWidth: "300px"
            }}
          >
            {loading ? (
              <Skeleton variant="rectangular" height={43} width="100%" sx={{ borderRadius: 1 }} />
            ) : (
              <SearchBar
                value={searchText || ""}
                onChange={onSearchTextChange}
                placeholder={searchPlaceholder || trans("searchAsset")}
              />
            )}
          </Box>
        )}

        {assetsToggle && <Box sx={{ flexShrink: 0 }}>{assetsToggle}</Box>}
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 2,
          pt: 2,
          pb: 1
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            overflowX: "auto",
            flexWrap: "nowrap",
            flex: 1,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": {
              display: "none"
            }
          }}
        >
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width={220}
                height={42}
                sx={{ borderRadius: 1 }}
                animation="wave"
              />
            ))
          ) : (
            <>
              {allAssetTypes && onAssetTypeChange && (
                <FilterDropdown
                  label={trans("assettype")}
                  options={allAssetTypes}
                  selected={assetTypeFilter || []}
                  onChange={onAssetTypeChange}
                />
              )}
              {!hideAssignedToFilter && (
                <Box sx={{ position: "relative", width: "220px" }}>
                  <FilterDropdown
                    label={trans("assignedTo")}
                    options={allUsers}
                    selected={assignedToFilter}
                    onChange={onAssignedToChange}
                  />
                  {disableAssignedToFilter && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        borderRadius: 1,
                        backgroundColor: "rgba(255, 255, 255, 0.6)",
                        zIndex: 2,
                        cursor: "not-allowed"
                      }}
                    />
                  )}
                </Box>
              )}
              {onDateChange && (
                <DateDropdown
                  dateFrom={dateFrom || ""}
                  dateTo={dateTo || ""}
                  onDateChange={onDateChange}
                  transtask={trans}
                  placeholder={trans("warranty")}
                />
              )}
              {allSystemTypes && onSystemTypeChange && (
                <FilterDropdown
                  label={trans("systemtype")}
                  options={systemTypeOptions}
                  selected={systemTypeFilter || []}
                  onChange={onSystemTypeChange}
                />
              )}
              {allStatuses && onStatusChange && (
                <FilterDropdown
                  label={trans("status")}
                  options={allStatuses}
                  selected={statusFilter || []}
                  onChange={onStatusChange}
                />
              )}
              {onAssetAllocationChange && (
                <FilterDropdown
                  label={trans("assetallocation")}
                  options={ALLOCATION}
                  selected={assetAllocationFilter || []}
                  onChange={onAssetAllocationChange}
                />
              )}
            </>
          )}
        </Box>
        {downloadAssets && !loading && <Box sx={{ flexShrink: 0, ml: 2 }}>{downloadAssets}</Box>}
      </Box>

      {appliedFilterCount > 0 && (
        <Box sx={{ pl: 2, pb: 1 }}>
          <Link
            component="button"
            onClick={onClearFilters}
            underline="always"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 300
            }}
          >
            {`Clear All (${appliedFilterCount})`}
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default AssetFilters;
