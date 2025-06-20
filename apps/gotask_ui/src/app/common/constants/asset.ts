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
      return "error";
    case "resolved":
    case "closed":
      return "success";
    default:
      return "default";
  }
};

export const ASSET_TYPE = {
  LAPTOP: "Laptop",
  MOBILE: "Mobile"
};
