// src/app/common/constants/styles.ts

import { DAILY_LOG_HOURS_LIMIT } from "@/app/common/constants/report";

export const getDailyLogCellStyle = (hours?: number) => {
  return hours && hours > DAILY_LOG_HOURS_LIMIT ? { color: "#ff0000" } : {};
};
