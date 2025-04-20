import { ITimeSpentEntry } from "../../domain/model/task/timespent";

const parseTimeString = (timeString: string): number => {
  if (!timeString) return 0;
  const days = parseInt(timeString.match(/(\d+)d/)?.[1] || "0", 10);
  const hours = parseInt(timeString.match(/(\d+)h/)?.[1] || "0", 10);
  return days * 8 + hours;
};

const parseHourMinuteString = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return ((hours || 0) * 60 + (minutes || 0)) / 60;
};

const formatHoursToTimeString = (totalHours: number): string => {
  const days = Math.floor(totalHours / 8);
  const hours = totalHours % 8;
  return `${days}d${hours}h`;
};

const calculateTotalTime = (timeEntries: ITimeSpentEntry[]): number => {
  return (timeEntries || []).reduce((total, entry) => {
    return total + parseTimeString(entry.time_logged);
  }, 0);
};

const calculateRemainingTime = (estimatedTime: string, spentTime: string): string => {
  const estimatedHours = parseTimeString(estimatedTime);
  const spentHours = parseTimeString(spentTime);
  return formatHoursToTimeString(Math.max(0, estimatedHours - spentHours));
};

const isValidTimeFormat = (timeString: string): boolean => {
  return /^(\d+d)?(\d+h)?$/.test(timeString) && timeString.length > 0;
};

export const TimeUtil = {
  parseTimeString,
  parseHourMinuteString,
  formatHoursToTimeString,
  calculateTotalTime,
  calculateRemainingTime,
  isValidTimeFormat
};
