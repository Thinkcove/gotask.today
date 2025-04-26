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
