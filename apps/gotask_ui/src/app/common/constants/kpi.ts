// constants/kpiConstants.ts
export const MEASUREMENT_CRITERIA_OPTIONS = [1, 2, 3, 4];

export const KPI_FREQUENCY = {
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  ANNUALLY: "Annually"
};

export const STATUS_OPTIONS = ["Active", "Inactive"];

export const mildStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "#e8f5e9";
    case "inactive":
      return "#fbe9e7";
    default:
      return "rgba(211, 211, 211, 0.3)";
  }
};
