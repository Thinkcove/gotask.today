import { TIME_FORMAT, TIME_PERIODS } from "../../common/constants/timeTask";
import { TASK_CALCULATION, TASK_VARIATION, TASK_HOURS } from "../constants/task";

export const monthDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const day = date.getUTCDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  return `${month} ${day}`;
};

export const parseTimeString = (timeStr: string) => {
  const weeks = parseInt(timeStr.match(/(\d+)w/)?.[1] || "0", 10);
  const days = parseInt(timeStr.match(/(\d+)d/)?.[1] || "0", 10);
  const hours = parseInt(timeStr.match(/(\d+)h/)?.[1] || "0", 10);
  const minutes = parseInt(timeStr.match(/(\d+)m/)?.[1] || "0", 10);
  return { weeks, days, hours, minutes };
};

export const convertToHours = (timeStr: string): number => {
  const { weeks, days, hours, minutes } = parseTimeString(timeStr);
  return weeks * 40 + days * TASK_HOURS + hours + minutes / 60;
};

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

export const calculateTimeProgressData = (
  estimatedTime: string,
  spentTime: string,
  userEstimated: string,
  timeEntries: Array<{ date: string; start_time: string; end_time: string }>,
  startDate: string
) => {
  // Parse time strings to extract hours
  const parseTimeString = (timeStr: string) => {
    const weeks = parseInt(timeStr.match(/(\d+)w/)?.[1] || "0", 10);
    const days = parseInt(timeStr.match(/(\d+)d/)?.[1] || "0", 10);
    const hours = parseInt(timeStr.match(/(\d+)h/)?.[1] || "0", 10);
    const minutes = parseInt(timeStr.match(/(\d+)m/)?.[1] || "0", 10);
    return weeks * 40 + days * 8 + hours + minutes / 60;
  };

  // Convert time strings to hours
  const estimatedHours = parseTimeString(estimatedTime || "0h");
  const spentHours = parseTimeString(spentTime || "0h");

  let spentFillPercentage = 0;
  let variationFillPercentage = 0;

  const durationHours = parseTimeString(userEstimated || "0h");
  const startDateObj = new Date(startDate);
  const dueDate = new Date(startDateObj.getTime() + durationHours * 60 * 60 * 1000);

  const pastDueEntries = timeEntries.filter((entry) => {
    const entryDate = new Date(entry.date);
    return entryDate > dueDate;
  });

  // Calculate spent fill
  spentFillPercentage =
    estimatedHours > 0
      ? Math.min(TASK_CALCULATION, (spentHours / estimatedHours) * TASK_CALCULATION)
      : spentHours > 0
        ? TASK_CALCULATION
        : 0;

  // Determine variation
  const isOverEstimate = spentHours > estimatedHours;

  if (isOverEstimate || pastDueEntries.length > 0) {
    // You can customize this formula, here both cases add variation
    variationFillPercentage = Math.min(
      TASK_VARIATION,
      (spentHours - estimatedHours) * 2 + pastDueEntries.length * 2
    );
  }

  return {
    estimatedHours,
    spentHours,
    spentFillPercentage,
    variationFillPercentage
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string) => {
  const phoneRegex = /^\+?[1-9](?:\d\s?){7,14}$/;
  return phoneRegex.test(phone);
};

//extracthours
export const extractHours = (timeStrings: string[]) =>
  timeStrings.reduce((sum, entry) => {
    const match = entry.match(/(\d+)d(\d+)h/);
    if (match) {
      const days = parseInt(match[1], 10);
      const hours = parseInt(match[2], 10);
      return sum + days * 8 + hours;
    }
    return sum;
  }, 0);

export const formatTimeValue = (raw: string): string => {
  if (!raw || typeof raw !== "string") return "—";

  const dayMatch = raw.match(/(\d+)d/);
  const hourMatch = raw.match(/(\d+)h/);

  const days = dayMatch ? parseInt(dayMatch[1], 10) : 0;
  const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;

  if (days === 0 && hours === 0) return "—";
  if (days === 0) return `${hours}h`;
  if (hours === 0) return `${days}d`;
  return `${days}d ${hours}h`;
};

export const formatDate = (date: string) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};
