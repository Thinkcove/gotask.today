import React from "react";
import { Box, Divider, IconButton, Link } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import SearchBar from "@/app/component/searchBar/searchBar";
import DateDropdown from "@/app/component/input/dateDropdown";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { PermissionFilterProps } from "../interface/interface";


const PermissionFilter: React.FC<PermissionFilterProps> = ({
  searchTerm,
  onSearchChange,
  onBack,
  dateFrom,
  dateTo,
  onDateChange,
  showClear = false,
  clearText,
  onClearFilters,
}) => {
  const transpermishion = useTranslations(LOCALIZATION.TRANSITION.PERMISSION);

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
              placeholder={transpermishion("search")}
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
          <DateDropdown
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateChange={onDateChange}
            transtask={transpermishion}
            placeholder={transpermishion("filterdate")}
          />
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
