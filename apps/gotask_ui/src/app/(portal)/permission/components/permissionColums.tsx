import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Delete, Visibility } from "@mui/icons-material";
import { Column } from "@/app/component/table/table";
import { formatDate, formatTime } from "@/app/common/utils/dateTimeUtils";
import { PermissionData } from "../interface/interface";

interface PermissionColumnsConfig {
  onViewClick: (permission: PermissionData) => void;
  onDeleteClick: (permission: PermissionData) => void;
  isDeleting?: boolean;
  translations: {
    username: string;
    date: string;
    starttime: string;
    endtime: string;
    actions: string;
    viewdetails: string;
    deletepermission: string;
  };
}

export const getPermissionColumns = ({
  onViewClick,
  onDeleteClick,
  isDeleting = false,
  translations
}: PermissionColumnsConfig): Column<PermissionData>[] => [
  {
    id: "user_name",
    label: translations.username,
    sortable: true
  },
  {
    id: "date",
    label: translations.date,
    render: (value: string | number | string[] | undefined, row: PermissionData) =>
      formatDate(row.date),
    sortable: true
  },
  {
    id: "start_time",
    label: translations.starttime,
    render: (value: string | number | string[] | undefined, row: PermissionData) =>
      formatTime(row.start_time || ""),
    sortable: true
  },
  {
    id: "end_time",
    label: translations.endtime,
    render: (value: string | number | string[] | undefined, row: PermissionData) =>
      formatTime(row.end_time || ""),
    sortable: true
  },
  {
    id: "actions",
    label: translations.actions,
    sortable: false,
    render: (value: string | number | string[] | undefined, row: PermissionData) => (
      <Box sx={{ display: "flex", gap: 1 }}>
        <Tooltip title={translations.viewdetails}>
          <IconButton size="small" onClick={() => onViewClick(row)} color="primary">
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={translations.deletepermission}>
          <IconButton
            size="small"
            onClick={() => onDeleteClick(row)}
            color="error"
            disabled={isDeleting}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    )
  }
];


