import { Box, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Column } from "@/app/component/table/table";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import { isBefore, isAfter, addDays } from "date-fns";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Tooltip from "@mui/material/Tooltip";
import LayersIcon from "@mui/icons-material/Layers";
import { ASSET_TYPE } from "@/app/common/constants/asset";
import DeleteIcon from "@mui/icons-material/Delete";

export interface IAssetDisplayRow {
  id?: string;
  assetType: string;
  deviceName: string;
  modelName: string;
  dateOfPurchase: string;
  user: string;
  encrypted?: boolean;
  warrantyDate?: string;
  previouslyUsedBy?: string;
  issuesCount?: string;
  userAssetCount?: string;
}

export const getAssetColumns = (
  transasset: (key: string) => string,
  onEdit: (row: IAssetDisplayRow) => void,
  onView: (row: IAssetDisplayRow) => void,
  onDelete: (row: IAssetDisplayRow) => void
): Column<IAssetDisplayRow>[] => [
  {
    id: "assetType",
    label: transasset("assets"),

    render: (value: string | boolean | undefined) => (
      <Box>{typeof value === "string" ? value : "-"}</Box>
    )
  },
  {
    id: "deviceName",
    label: transasset("type"),
    render: (value: string | boolean | undefined) => (typeof value === "string" ? value : "-")
  },
  {
    id: "modelName",
    label: transasset("assetid"),
    render: (value: string | boolean | undefined) => (typeof value === "string" ? value : "-")
  },
  {
    id: "warrantyDate",
    label: transasset("warrantyvalidity"),
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
            <Typography variant="body2" whiteSpace="nowrap">
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
    id: "dateOfPurchase",
    label: transasset("acquisitiondate"),
    render: (value: string | boolean | undefined) =>
      typeof value === "string" && !isNaN(Date.parse(value)) ? (
        <FormattedDateTime date={value} />
      ) : (
        "-"
      )
  },
  {
    id: "user",
    label: transasset("assignedTo"),
    render: (_value: unknown, row: IAssetDisplayRow) => {
      const userDisplay = Array.isArray(row.user)
        ? row.user.join(", ")
        : typeof row.user === "string"
          ? row.user
          : "-";
      const userAssetCount = Number(row.userAssetCount);
      const isOverloaded = !isNaN(userAssetCount) && userAssetCount > 1;
      const showLayerIcon = isOverloaded && row.assetType !== ASSET_TYPE.ACCESS_CARDS;

      return (
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" whiteSpace="nowrap">
            {userDisplay}
          </Typography>
          <Box sx={{ visibility: showLayerIcon ? "visible" : "hidden" }}>
            <Tooltip
              placement="top"
              title={
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {transasset("overutilized")} {row.userAssetCount}
                </Typography>
              }
            >
              <IconButton size="small" sx={{ p: 0.5, color: "#741B92" }}>
                <LayersIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      );
    }
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
        <IconButton onClick={() => onDelete(row)} color="error" aria-label="delete">
          <DeleteIcon />
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

export const OFFICE_SYSTEM = "Office System";

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

export const CREATED_AT = "createdAt";

export const DESC = "desc";

export const ASC = "asc";

export const ALLOCATION = ["Overutilized", "Not utilized"];

export const OVERUTILIZED = "Overutilized";

export const NOT_UTILIZED = "Not utilized";

export const authenticationModesOptions = ["Fingerprint", "Card", "Password", "Face Recognition"];

export const connectivityOptions = ["USB", "TCP/IP", "Wi-Fi"];

export const assetListFilters = "assetListFilters";

export const issuesListFilters = "issuesListFilters";

export const editstatus = "status";
export const description = "description";
export const issueType = "issueType";
export const assignedTo = "assignedTo";
export const assetId = "assetId";
export const reportedBy = "reportedBy";

export const calculateWarrantyDate = (
  purchaseDate: string,
  warrantyPeriod: string
): string | null => {
  const warrantyMonths = parseInt(warrantyPeriod);
  if (!purchaseDate || isNaN(warrantyMonths)) return null;

  const date = new Date(purchaseDate);
  date.setMonth(date.getMonth() + warrantyMonths);
  return date.toISOString().split("T")[0];
};

export const capacityOptions = ["1 Ton", "1.5 Ton", "2 Ton"];

export const typeOptions = ["Split", "Window", "Central", "Cassette", "Portable"];

export const energyRatingOptions = ["3 Star", "5 Star"];

export const ASSETS = "assets";
