export const getAssetColumns = (transasset: (key: string) => string) => [
  { id: "assetType", label: transasset("assets") },
  { id: "assetName", label: transasset("type") },
  { id: "modelName", label: transasset("model") },
  { id: "purchaseDate", label: transasset("purchaseDate") },
  {
    id: "actions",
    label: transasset("actions")
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
