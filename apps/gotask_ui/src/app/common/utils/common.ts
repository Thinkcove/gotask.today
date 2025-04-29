import { TIME_FORMAT, TIME_PERIODS } from "../../common/constants/timeTask";

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ""; // Handle invalid dates
  const day = date.getUTCDate();
  const month = date.toLocaleString("en-US", { month: "short" }); // "Jan", "Feb", etc.
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
  return weeks * 40 + days * 8 + hours + minutes / 60;
};

// Define constants needed for time comparison
const TIME_SEPARATOR = " ";
const TIME_PART_SEPARATOR = ":";

export const isEndTimeAfterStartTime = (startTime: string, endTime: string): boolean => {
  if (!startTime || !endTime) return true; // Skip validation if times aren't selected yet

  // Parse times to compare
  const parseTime = (timeStr: string) => {
    const [timePart, period] = timeStr.split(TIME_SEPARATOR);
    const [hoursStr, minutesStr] = timePart.split(TIME_PART_SEPARATOR);
    let hours = Number(hoursStr);
    const minutes = Number(minutesStr);

    // Convert to 24-hour format for comparison
    if (period === TIME_PERIODS.PM && hours < TIME_FORMAT.NOON_HOUR) {
      hours += TIME_FORMAT.NOON_HOUR;
    } else if (period === TIME_PERIODS.AM && hours === TIME_FORMAT.NOON_HOUR) {
      hours = 0;
    }

    return hours * TIME_FORMAT.MINUTES_PER_HOUR + minutes; // Return minutes since midnight
  };

  const startMinutes = parseTime(startTime);
  const endMinutes = parseTime(endTime);

  return endMinutes > startMinutes;
};

export const calculateTimeProgressData = (estimatedTime: string, spentTime: string) => {
  // Parse time strings to extract hours
  const parseTimeString = (timeStr: string) => {
    const weeks = parseInt(timeStr.match(/(\d+)w/)?.[1] || "0", 10);
    const days = parseInt(timeStr.match(/(\d+)d/)?.[1] || "0", 10);
    const hours = parseInt(timeStr.match(/(\d+)h/)?.[1] || "0", 10);
    const minutes = parseInt(timeStr.match(/(\d+)m/)?.[1] || "0", 10);
    return weeks * 40 + days * 8 + hours + minutes / 60; // Converting to hours
  };

  // Convert time strings to hours

  const estimatedHours = parseTimeString(estimatedTime || "0h");
  const spentHours = parseTimeString(spentTime || "0h");
  const variationHours = spentHours - estimatedHours;

  // Calculate percentages for progress bar visualization
  const spentFillPercentage =
    estimatedHours > 0 ? Math.min(70, (spentHours / estimatedHours) * 70) : spentHours > 0 ? 70 : 0;

  const variationFillPercentage =
    variationHours > 0 ? Math.min(30, (variationHours / (estimatedHours || 1)) * 30) : 0;

  const totalFillPercentage = spentFillPercentage + variationFillPercentage;

  return {
    estimatedHours,
    spentHours,
    variationHours,
    spentFillPercentage,
    variationFillPercentage,
    totalFillPercentage
  };
};
