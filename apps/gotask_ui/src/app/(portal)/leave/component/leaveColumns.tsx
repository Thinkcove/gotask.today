import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { Column } from "@/app/component/table/table";
import { LeaveEntry } from "../interface/leaveInterface";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import DateFormats from "@/app/component/dateTime/dateFormat";

interface LeaveColumnsProps {
  transleave: (key: string) => string;
  onViewClick: (leave: LeaveEntry) => void;
  onEditClick: (leave: LeaveEntry) => void;
  onDeleteClick: (leave: LeaveEntry) => void;
}

export const getLeaveColumns = ({
  transleave,
  onViewClick,
  onEditClick,
  onDeleteClick
}: LeaveColumnsProps): Column<LeaveEntry>[] => [
  {
    id: "user_name",
    label: transleave("username"),
    sortable: true
  },
  {
    id: "leave_type",
    label: transleave("leavetype"),
    sortable: false
  },
  {
    id: "from_date",
    label: transleave("fromdate"),
    render: (value: string | undefined, row: LeaveEntry) => (
      <FormattedDateTime date={row.from_date || ""} format={DateFormats.DATE_ONLY} />
    ),
    sortable: true
  },
  {
    id: "to_date",
    label: transleave("todate"),
    render: (value: string | undefined, row: LeaveEntry) => (
      <FormattedDateTime date={row.to_date || ""} format={DateFormats.DATE_ONLY} />
    ),
    sortable: true
  },
  {
    id: "actions",
    label: transleave("actions"),
    sortable: false,
    render: (value: string | undefined, row: LeaveEntry) => (
      <Box sx={{ display: "flex", gap: 1 }}>
        <Tooltip title={transleave("viewdetails")}>
          <IconButton size="small" onClick={() => onViewClick(row)} sx={{ color: "#741B92" }}>
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={transleave("editleave")}>
          <IconButton size="small" onClick={() => onEditClick(row)} sx={{ color: "#741B92" }}>
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={transleave("deleteleave")}>
          <IconButton size="small" onClick={() => onDeleteClick(row)} sx={{ color: "#741B92" }}>
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    )
  }
];
