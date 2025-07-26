import { TimeLogEntry } from "@/app/(portal)/report/interface/timeLog";
import { ESTIMATION_FORMAT, ISO_DATE_REGEX, TIME_PERIOD } from "../constants/regex";
import { formatTimeValue } from "./taskTime";
import DateFormats from "@/app/component/dateTime/dateFormat";
import { format, eachDayOfInterval, parseISO, isValid } from "date-fns";

export const normalizeDate = (dateString: string): Date => {
  const date = new Date(dateString);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const calculatePermissionDuration = (startTime: string, endTime: string): number => {
  const parseTime = (time: string): number => {
    const cleanTime = time.replace(TIME_PERIOD, "");
    const [hours, minutes] = cleanTime.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes;

    if (time.toUpperCase().includes("PM") && hours !== 12) {
      totalMinutes += 12 * 60;
    } else if (time.toUpperCase().includes("AM") && hours === 12) {
      totalMinutes -= 12 * 60;
    }

    return totalMinutes;
  };

  const startMinutes = parseTime(startTime);
  const endMinutes = parseTime(endTime);
  const durationMinutes = endMinutes - startMinutes;

  return Math.round((durationMinutes / 60) * 100) / 100;
};

export const calculateLeaveDuration = (fromDate: string, toDate: string): number => {
  const startDate = normalizeDate(fromDate);
  const endDate = normalizeDate(toDate);

  const diffInMs = endDate.getTime() - startDate.getTime();

  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1;

  return diffInDays;
};

export const formatLeaveDuration = (fromDate: string, toDate: string): string => {
  const days = calculateLeaveDuration(fromDate, toDate);
  return `${days} day${days > 1 ? "s" : ""}`;
};

export const formatText = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatPermissionDuration = (startTime: string, endTime: string): string => {
  const hours = calculatePermissionDuration(startTime, endTime);
  return `${hours} hour${hours === 1 ? "" : "s"}`;
};

export const getTimeSpentColor = (
  spent: string | number | null | undefined,
  estimated: string | number | null | undefined
): string => {
  const spentValue = spent !== null && spent !== undefined ? parseFloat(spent.toString()) : NaN;
  const estimatedValue =
    estimated !== null && estimated !== undefined ? parseFloat(estimated.toString()) : NaN;

  if (isNaN(spentValue) || isNaN(estimatedValue)) return "black";

  if (spentValue > estimatedValue) return "#dd1428ff";
  if (spentValue < estimatedValue) return "#20bf25ff";
  if (spentValue === estimatedValue) return "#ead30cff";

  return "#8715deff";
};

export const datesOverlap = (
  firstLeaveStart: string,
  firstLeaveEnd: string,
  secondLeaveStart: string,
  secondLeaveEnd: string
): boolean => {
  const firstLeaveStartDate = new Date(firstLeaveStart);
  const firstLeaveEndDate = new Date(firstLeaveEnd);
  const secondLeaveStartDate = new Date(secondLeaveStart);
  const secondLeaveEndDate = new Date(secondLeaveEnd);

  // Check if all dates are valid
  if (
    isNaN(firstLeaveStartDate.getTime()) ||
    isNaN(firstLeaveEndDate.getTime()) ||
    isNaN(secondLeaveStartDate.getTime()) ||
    isNaN(secondLeaveEndDate.getTime())
  ) {
    return false;
  }

  return firstLeaveStartDate <= secondLeaveEndDate && secondLeaveStartDate <= firstLeaveEndDate;
};

export const formatEstimation = (estimation: string | number | null | undefined) => {
  if (!estimation || estimation === null || estimation === undefined || estimation === "") {
    return "-";
  }

  // Use the formatTimeValue function from taskTime.ts
  return formatTimeValue(estimation.toString());
};
export const getEstimationValue = (estimation: string | number | null | undefined): number => {
  if (!estimation || estimation === null || estimation === undefined || estimation === "") {
    return 0;
  }
  const numericValue = parseFloat(estimation.toString().replace(ESTIMATION_FORMAT, ""));
  return isNaN(numericValue) ? 0 : numericValue;
};
export const isSameDate = (date1: string, date2: string): boolean => {
  const fromDate = normalizeDate(date1);
  const toDate = normalizeDate(date2);
  return fromDate.getTime() === toDate.getTime();
};
export const extractDateFromTimeLog = (entry: TimeLogEntry): string | null => {
  if (!entry?.date || typeof entry.date !== "string") {
    return null;
  }

  // Return directly if it's already in YYYY-MM-DD format
  if (ISO_DATE_REGEX.test(entry.date)) {
    return entry.date;
  }

  const parsedDate = parseISO(entry.date);
  if (isValid(parsedDate)) {
    return format(parsedDate, DateFormats.ISO_DATE);
  }

  return null;
};
