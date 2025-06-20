import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Column } from "@/app/component/table/table";

export interface IAssetDisplayRow {
  id?: string;
  assetType: string;
  assetName: string;
  modelName: string;
  purchaseDate: string;
  users: string;
  encrypted?: boolean;
}

export const getAssetColumns = (
  transasset: (key: string) => string,
  onEdit: (row: IAssetDisplayRow) => void
): Column<IAssetDisplayRow>[] => [
  {
    id: "assetType",
    label: transasset("assets"),
    render: (value: string | boolean | undefined) => (typeof value === "string" ? value : "-")
  },
  {
    id: "assetName",
    label: transasset("type"),
    render: (value: string | boolean | undefined) => (typeof value === "string" ? value : "-")
  },
  {
    id: "modelName",
    label: transasset("model"),
    render: (value: string | boolean | undefined) => (typeof value === "string" ? value : "-")
  },
  {
    id: "purchaseDate",
    label: transasset("purchaseDate"),
    render: (value: string | boolean | undefined) => (typeof value === "string" ? value : "-")
  },
  {
    id: "users",
    label: transasset("assignedTo"),
    render: (value: string | string[] | boolean | undefined) =>
      Array.isArray(value) ? value.join(", ") : typeof value === "string" ? value : "-"
  },
  {
    id: "encrypted",
    label: transasset("isencrypted"),
    render: (value: string | boolean | undefined) => (value === true ? "Encrypted" : "-")
  },
  {
    id: "actions",
    label: transasset("actions"),
    render: (_: unknown, row: IAssetDisplayRow) => (
      <IconButton onClick={() => onEdit(row)} color="primary" aria-label="edit">
        <EditIcon />
      </IconButton>
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
