import { TIME_FORMAT, TIME_PERIODS } from "../constants/timeTask";
import {
  DAY_HOUR_COMBO_PATTERN,
  DAY_PATTERN,
  HOUR_PATTERN,
  MINUTE_PATTERN,
  WEEK_PATTERN
} from "../constants/regex";
import { TASK_CALCULATION, TASK_VARIATION, TASK_HOURS } from "../constants/task";

// -----------------------------
// Time Parsing & Conversion
// -----------------------------

export const parseTimeString = (timeStr: string) => {
  const weeks = parseInt(timeStr.match(WEEK_PATTERN)?.[1] || "0", 10);
  const days = parseInt(timeStr.match(DAY_PATTERN)?.[1] || "0", 10);
  const hours = parseInt(timeStr.match(HOUR_PATTERN)?.[1] || "0", 10);
  const minutes = parseInt(timeStr.match(MINUTE_PATTERN)?.[1] || "0", 10);
  return { weeks, days, hours, minutes };
};

export const convertToHours = (timeStr: string): number => {
  const { weeks, days, hours, minutes } = parseTimeString(timeStr);
  return weeks * 40 + days * TASK_HOURS + hours + minutes / 60;
};

// -----------------------------
// Time Entry Utilities
// -----------------------------

const TIME_SEPARATOR = " ";
const TIME_PART_SEPARATOR = ":";

export const isEndTimeAfterStartTime = (startTime: string, endTime: string): boolean => {
  if (!startTime || !endTime) return true;

  const parseTime = (timeStr: string) => {
    const [timePart, period] = timeStr.split(TIME_SEPARATOR);
    const [hoursStr, minutesStr] = timePart.split(TIME_PART_SEPARATOR);
    let hours = Number(hoursStr);
    const minutes = Number(minutesStr);

    if (period === TIME_PERIODS.PM && hours < TIME_FORMAT.NOON_HOUR) {
      hours += TIME_FORMAT.NOON_HOUR;
    } else if (period === TIME_PERIODS.AM && hours === TIME_FORMAT.NOON_HOUR) {
      hours = 0;
    }

    return hours * TIME_FORMAT.MINUTES_PER_HOUR + minutes;
  };

  const startMinutes = parseTime(startTime);
  const endMinutes = parseTime(endTime);

  return endMinutes > startMinutes;
};

export const extractHours = (timeStrings: string[]) =>
  timeStrings.reduce((sum, entry) => {
    const match = entry.match(DAY_HOUR_COMBO_PATTERN);
    if (match) {
      const days = parseInt(match[1], 10);
      const hours = parseInt(match[2], 10);
      return sum + days * TASK_HOURS + hours;
    }
    return sum;
  }, 0);

// -----------------------------
// Time Formatting
// -----------------------------

export const formatTimeValue = (raw: string, showNegative = false): string => {
  if (!raw || typeof raw !== "string") return "—";

  const isNegative = raw.startsWith("-");
  const cleanedRaw = isNegative ? raw.slice(1) : raw;

  const dayMatch = cleanedRaw.match(DAY_PATTERN);
  const hourMatch = cleanedRaw.match(HOUR_PATTERN);
  const minuteMatch = cleanedRaw.match(MINUTE_PATTERN);

  const days = dayMatch ? parseInt(dayMatch[1], 10) : 0;
  const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
  const minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;

  if (days === 0 && hours === 0 && minutes === 0) return "—";

  const parts = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);

  const result = parts.join(" ");
  return showNegative && isNegative ? `- ${result}` : result;
};

// -----------------------------
// Progress Calculation
// -----------------------------

export const calculateTimeProgressData = (
  estimatedTime: string,
  spentTime: string,
  userEstimated: string,
  timeEntries: Array<{ date: string; start_time: string; end_time: string }>,
  startDate: string
) => {
  const estimatedHours = convertToHours(estimatedTime || "0h0m");
  const spentHours = convertToHours(spentTime || "0h0m");
  const durationHours = convertToHours(userEstimated || "0h0m");

  const startDateObj = new Date(startDate);
  const dueDate = new Date(startDateObj.getTime() + durationHours * 60 * 60 * 1000);

  const pastDueEntries = timeEntries.filter((entry) => {
    const entryDate = new Date(entry.date);
    return entryDate > dueDate;
  });

  const spentFillPercentage =
    estimatedHours > 0
      ? Math.min(TASK_CALCULATION, (spentHours / estimatedHours) * TASK_CALCULATION)
      : spentHours > 0
        ? TASK_CALCULATION
        : 0;

  const isOverEstimate = spentHours > estimatedHours;

  const variationFillPercentage =
    isOverEstimate || pastDueEntries.length > 0
      ? Math.min(TASK_VARIATION, (spentHours - estimatedHours) * 2 + pastDueEntries.length * 2)
      : 0;

  return {
    estimatedHours,
    spentHours,
    spentFillPercentage,
    variationFillPercentage
  };
};

// -----------------------------
// Due Date Calculation
// -----------------------------
export const calculateDueDate = (startDateStr: string, estimation: string): string | null => {
  if (!startDateStr || !estimation) return null;

  let days = 0;
  let hours = 0;

  if (estimation.includes("d")) {
    const [d, hRaw] = estimation.split("d");
    days = parseInt(d, 10) || 0;
    hours = hRaw?.replace("h", "").trim() ? parseInt(hRaw.replace("h", "").trim(), 10) || 0 : 0;
  } else if (estimation.includes("h")) {
    hours = parseInt(estimation.replace("h", "").trim(), 10) || 0;
  }

  if (isNaN(days) || isNaN(hours)) return null;

  const totalDays = Math.ceil(days + hours / TASK_HOURS);
  const addDays = totalDays > 1 ? totalDays - 1 : 0;

  const startDate = new Date(startDateStr);
  startDate.setDate(startDate.getDate() + addDays);

  return startDate.toISOString().split("T")[0];
};
