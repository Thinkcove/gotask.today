"use client";

import React from "react";
import { Typography, IconButton } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import PercentIcon from "@mui/icons-material/Percent";
import DeleteIcon from "@mui/icons-material/Delete";
import { Column } from "@/app/component/table/table";
import { IIncrementHistory } from "../interfaces/userInterface";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import DateFormats from "@/app/component/dateTime/dateFormat";
import formatCTC from "@/app/common/utils/formatCtc";
import { useTranslations } from "next-intl";

interface UseIncrementColumnOptions {
  onDelete?: (id: string) => void;
}

export const useIncrementColumns = (
  options: UseIncrementColumnOptions = {}
): Column<IIncrementHistory & { percent?: string }>[] => {
  const trans = useTranslations("User.Increment");

  const columns: Column<IIncrementHistory & { percent?: string }>[] = [
    {
      id: "date",
      label: trans("date"),
      align: "left",
      render: (value) =>
        value ? <FormattedDateTime date={value as string} format={DateFormats.DATE_ONLY} /> : "-"
    },
    {
      id: "ctc",
      label: trans("ctc"),
      align: "left",
      render: (value) => formatCTC(value as number)
    },
    {
      id: "percent",
      label: trans("change"),
      align: "left",
      render: (value) =>
        value !== undefined ? (
          <Typography color="green" display="flex" alignItems="center" gap={0.5}>
            <ArrowUpwardIcon fontSize="small" />
            {value}
            <PercentIcon fontSize="small" />
          </Typography>
        ) : (
          "-"
        )
    }
  ];

  if (options.onDelete) {
    columns.push({
      id: "actions",
      label: "",
      align: "right",
      render: (_value, row) =>
        row.increment_id ? (
          <IconButton size="small" onClick={() => options.onDelete!(row.increment_id!)}>
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        ) : null
    });
  }

  return columns;
};
