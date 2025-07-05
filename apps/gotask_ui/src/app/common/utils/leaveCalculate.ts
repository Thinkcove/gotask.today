import { TIME_PERIOD } from "../constants/regex";

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
