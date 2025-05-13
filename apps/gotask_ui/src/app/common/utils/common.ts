import { TIME_FORMAT, TIME_PERIODS } from "../../common/constants/timeTask";
import { TASK_CALCULATION, TASK_VARIATION, TASK_HOURS } from "../constants/task";

export const formatDate = (dateString: string): string => {
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
  dueDate: string,
  timeEntries: Array<{ date: string; start_time: string; end_time: string }>
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

  if (dueDate && timeEntries && timeEntries.length > 0) {
    const dueDateObj = new Date(dueDate);
    if (!isNaN(dueDateObj.getTime())) {
      // Check if any time entry is after the due date
      const pastDueEntries = timeEntries.filter((entry) => {
        const entryDate = new Date(entry.date);
        return entryDate > dueDateObj;
      });

      if (pastDueEntries.length > 0) {
        // If there are any past-due entries, time spent bar should not fill
        spentFillPercentage = 0;

        // Increment variation by 2% for each registration past the due date
        variationFillPercentage = pastDueEntries.length * 2;

        // Cap variation percentage at 30%
        variationFillPercentage = Math.min(TASK_VARIATION, variationFillPercentage);
      } else {
        // If all entries are on or before the due date, fill the time spent bar
        spentFillPercentage =
          estimatedHours > 0
            ? Math.min(TASK_CALCULATION, (spentHours / estimatedHours) * TASK_CALCULATION)
            : spentHours > 0
              ? TASK_CALCULATION
              : 0;
        variationFillPercentage = 0;
      }
    }
  } else {
    // If no time entries or due date, default to filling time spent bar
    spentFillPercentage =
      estimatedHours > 0
        ? Math.min(TASK_CALCULATION, (spentHours / estimatedHours) * TASK_CALCULATION)
        : spentHours > 0
          ? TASK_CALCULATION
          : 0;
    variationFillPercentage = 0;
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
