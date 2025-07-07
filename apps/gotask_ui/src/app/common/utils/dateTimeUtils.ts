export const formatDate = (dateString: string): string => {
  if (!dateString) return "-";

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString;
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  } catch {
    return dateString;
  }
};
export const formatTime = (timeString: string): string => {
  if (!timeString) return "-";

  try {
    const [hours, minutes] = timeString.split(":");

    // Validate input
    if (!hours || !minutes) {
      return timeString;
    }

    const hour = parseInt(hours, 10);

    // Validate hour range
    if (isNaN(hour) || hour < 0 || hour > 23) {
      return timeString;
    }

    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;

    return `${displayHour}:${minutes} ${ampm}`;
  } catch {
    return timeString;
  }
};
