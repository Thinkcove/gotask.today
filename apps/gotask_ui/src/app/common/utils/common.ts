export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ""; // Handle invalid dates
  const day = date.getUTCDate();
  const month = date.toLocaleString("en-US", { month: "short" }); // "Jan", "Feb", etc.
  return `${month} ${day}`;
};
