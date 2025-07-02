// constants/kpiConstants.ts
export const MEASUREMENT_CRITERIA_OPTIONS = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 }
];



export const KPI_FREQUENCY = {
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  ANNUALLY: "Annually",
  WEEKLY:"Weekly"
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
