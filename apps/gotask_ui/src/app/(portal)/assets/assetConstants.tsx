import { IconButton } from "@mui/material";
import { IAssetAttributes } from "./interface/asset";
import EditIcon from "@mui/icons-material/Edit";

export const getAssetColumns = (
  transasset: (key: string) => string,
  onEdit: (row: IAssetAttributes) => void
) => [
  { id: "assetType", label: transasset("assets") },
  { id: "assetName", label: transasset("type") },
  { id: "modelName", label: transasset("model") },
  { id: "purchaseDate", label: transasset("purchaseDate") },
  { id: "users", label: transasset("assignedTo") },
  { id: "encrypted", label: transasset("isencrypted") },
  {
    id: "actions",
    label: transasset("actions"),
    render: (_: unknown, row: IAssetAttributes) => (
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
