export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "assigned":
      return "success";
    case "returned":
      return "warning";
    case "serviced":
      return "info";
    default:
      return "default";
  }
};

export const getIssuesStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "open":
      return "#B1AAAA";
    case "inprogress":
      return "#FF9800";
    case "resolved":
      return "#4caf50";
    default:
      return "#9e9e9e";
  }
};

export const ASSET_TYPE = {
  LAPTOP: "Laptop",
  MOBILE: "Mobile",
  DESKTOP: "Desktop",
  ACCESS_CARDS: "Access Card",
  PRINTER: "Printer",
  FINGERPRINT_SCANNER: "Finger Print Scanner"
};

export const MODE = {
  ASSET: "asset"
};

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
