export const getUserStatusColor = (status: boolean): string => {
  return status ? "#4CAF50" : "#F44336"; // Green for active, red for inactive
};

export const statusOptions = [
  { id: "true", name: "Active" },
  { id: "false", name: "In Active" }
];

export const PROFICIENCY_MAXIMUM = 3;
export const MINIMUM_EXPERIENCE_REQUIRED = 1;
export const DEFAULT_PROFICIENCY = 0;

export function calculateIncrementPercent(current: number, previous: number): number | null {
  if (!previous || previous === 0) return null;
  const percent = ((current - previous) / previous) * 100;
  return +percent.toFixed(2);
}
