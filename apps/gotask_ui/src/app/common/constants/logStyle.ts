// src/app/common/constants/styles.ts

export const getDailyLogCellStyle = (hours?: number) => {
  return hours && hours > 10 ? { color: "#ff0000" } : {};
};
