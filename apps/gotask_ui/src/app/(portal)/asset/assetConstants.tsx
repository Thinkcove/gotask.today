import { Box, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Column } from "@/app/component/table/table";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import { isBefore, isAfter, addDays } from "date-fns";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Tooltip from "@mui/material/Tooltip";

export interface IAssetDisplayRow {
  id?: string;
  assetType: string;
  assetName: string;
  modelName: string;
  purchaseDate: string;
  users: string;
  encrypted?: boolean;
  warrantyDate?: string;
  previouslyUsedBy?: string;
  issues?: string;
}

export const getAssetColumns = (
  transasset: (key: string) => string,
  onEdit: (row: IAssetDisplayRow) => void,
  onView: (row: IAssetDisplayRow) => void
): Column<IAssetDisplayRow>[] => [
  {
    id: "assetType",
    label: transasset("assets"),

    render: (value: string | boolean | undefined) => (
      <Box>{typeof value === "string" ? value : "-"}</Box>
    )
  },
  {
    id: "assetName",
    label: transasset("type"),
    render: (value: string | boolean | undefined) => (typeof value === "string" ? value : "-")
  },
  {
    id: "warrantyDate",
    label: transasset("warrantyDate"),
    render: (value: string | boolean | undefined) => {
      if (typeof value === "string" && !isNaN(Date.parse(value))) {
        const warrantyDate = new Date(value);
        const today = new Date();

        const isExpired = isBefore(warrantyDate, today);
        const within10Days =
          isAfter(warrantyDate, today) && isBefore(warrantyDate, addDays(today, 10));

        const showWarning = isExpired || within10Days;
        const label = isExpired
          ? transasset("expired")
          : within10Days
            ? transasset("expiringon")
            : "";

        return (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography whiteSpace="nowrap">
              <FormattedDateTime date={value} />
            </Typography>

            {showWarning && (
              <Tooltip
                placement="top"
                title={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {label}&nbsp;
                    <FormattedDateTime date={value} />
                  </Typography>
                }
              >
                <WarningAmberIcon
                  fontSize="small"
                  sx={{
                    cursor: "default",
                    color: isExpired ? "#D32F2F" : "#ED6C02",
                    verticalAlign: "middle"
                  }}
                />
              </Tooltip>
            )}
          </Box>
        );
      }

      return "-";
    }
  },
  {
    id: "modelName",
    align: "center" as const,
    label: transasset("model"),
    render: (value: string | boolean | undefined) => (typeof value === "string" ? value : "-")
  },
  {
    id: "purchaseDate",
    align: "center" as const,
    label: transasset("purchaseDate"),
    render: (value: string | boolean | undefined) =>
      typeof value === "string" && !isNaN(Date.parse(value)) ? (
        <FormattedDateTime date={value} />
      ) : (
        "-"
      )
  },
  {
    id: "previouslyUsedBy",
    align: "center" as const,
    label: transasset("previouslyused"),
    render: (value: string | boolean | undefined) => (typeof value === "string" ? value : "-")
  },
  {
    id: "users",
    align: "center" as const,
    label: transasset("assignedTo"),
    render: (value: string | string[] | boolean | undefined) =>
      Array.isArray(value) ? value.join(", ") : typeof value === "string" ? value : "-"
  },
  {
    id: "issues",
    align: "center" as const,
    label: transasset("issuesCount"),
    render: (value: unknown) =>
      typeof value === "number" || typeof value === "string" ? `${value}` : "-"
  },
  {
    id: "actions",
    label: transasset("actions"),
    align: "center" as const,
    render: (_: unknown, row: IAssetDisplayRow) => (
      <>
        <IconButton onClick={() => onEdit(row)} color="primary" aria-label="edit">
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => onView(row)} color="primary" aria-label="view">
          <VisibilityIcon />
        </IconButton>
      </>
    )
  }
];

export const ACTION_TYPES = [
  { id: "Assigned", name: "Assigned" },
  { id: "Returned", name: "Returned" },
  { id: "Serviced", name: "Serviced" }
];

export const statusOptions = [
  { id: "Open", name: "Open" },
  { id: "InProgress", name: "In Progress" },
  { id: "Resolved", name: "Resolved" }
];

export const commonIssueTypes = [
  { id: "Processor Issue", name: "Processor Issue" },
  { id: "OS Issue", name: "OS Issue" },
  { id: "RAM Fault", name: "RAM Fault" },
  { id: "Screen Damage", name: "Screen Damage" },
  { id: "Battery Issue", name: "Battery Issue" },
  { id: "Network Issue", name: "Network Issue" },
  { id: "Performance Lag", name: "Performance Lag" },
  { id: "Hardware Failure", name: "Hardware Failure" },
  { id: "Software Crash", name: "Software Crash" }
];

export const issueStatuses = ["Open", "InProgress", "Resolved"];

export const systemTypeOptions = ["Office System", "Personal System"];
