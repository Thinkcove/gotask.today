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
