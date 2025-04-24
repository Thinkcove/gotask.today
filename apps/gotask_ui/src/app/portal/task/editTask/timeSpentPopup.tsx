import React, { useState, useEffect } from "react";
import { Box, Button, Typography, IconButton, Autocomplete, TextField } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { logTaskTime } from "../service/taskAction";
import { KeyedMutator } from "swr";
import { ITask } from "../interface/taskInterface";

interface TimeEntry {
  date: string;
  start_time: string;
  end_time: string;
}

interface TimeSpentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  originalEstimate: string;
  taskId: string;
  mutate: KeyedMutator<ITask>;
}

// Updated time options with AM/PM indicators
const timeOptions = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM"
];

const TimeSpentPopup: React.FC<TimeSpentPopupProps> = ({
  isOpen,
  onClose,
  originalEstimate,
  taskId,
  mutate
}) => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    { date: "", start_time: "", end_time: "" }
  ]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split("T")[0];
      const initialEntries = [{ date: today, start_time: "", end_time: "" }];
      setTimeEntries(initialEntries);
      setErrorMessage("");
    }
  }, [isOpen]);

  const handleEntryChange = (index: number, field: keyof TimeEntry, value: string) => {
    const updated = [...timeEntries];
    updated[index] = { ...updated[index], [field]: value };
    setTimeEntries(updated);
  };

  const handleDeleteEntry = (index: number) => {
    if (timeEntries.length === 1) return;
    const updated = [...timeEntries];
    updated.splice(index, 1);
    setTimeEntries(updated);
  };

  // Helper function to check if end time is after start time
  const isEndTimeAfterStartTime = (startTime: string, endTime: string): boolean => {
    if (!startTime || !endTime) return true; // Skip validation if times aren't selected yet

    // Parse times to compare
    const parseTime = (timeStr: string) => {
      const [timePart, period] = timeStr.split(" ");
      // Fixed here - using const for both hours and minutes
      const [hoursStr, minutesStr] = timePart.split(":");
      let hours = Number(hoursStr);
      const minutes = Number(minutesStr);

      // Convert to 24-hour format for comparison
      if (period === "PM" && hours < 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0;
      }

      return hours * 60 + minutes; // Return minutes since midnight
    };

    const startMinutes = parseTime(startTime);
    const endMinutes = parseTime(endTime);

    return endMinutes > startMinutes;
  };

  const validateEntries = () => {
    for (const entry of timeEntries) {
      if (!entry.date || !entry.start_time || !entry.end_time) {
        setErrorMessage("Please fill in all fields: date, start time, and end time are required.");
        return false;
      }

      if (!isEndTimeAfterStartTime(entry.start_time, entry.end_time)) {
        setErrorMessage("End time must be after start time.");
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    try {
      if (!validateEntries()) {
        return;
      }

      // Modified format to include start_time and end_time explicitly
      const formattedEntries = timeEntries.map((entry) => ({
        date: entry.date,
        start_time: entry.start_time,
        end_time: entry.end_time
      }));

      await logTaskTime(taskId, formattedEntries);
      await mutate();
      onClose();
    } catch (err) {
      console.error("Error logging time:", err);
      setErrorMessage("Failed to save time entry. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#fff",
        padding: 3,
        borderRadius: 2,
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        zIndex: 1200,
        minWidth: 320,
        maxWidth: 550,
        maxHeight: "90vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "#741B92" }}>
        Update Time Tracking
      </Typography>

      <Typography variant="body2" sx={{ fontStyle: "italic", color: "#666" }}>
        The original estimate for the issue was {originalEstimate || "0d0h"}
      </Typography>
      <Box sx={{ backgroundColor: "#F3E5F5", borderRadius: 1, p: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#741B92", mb: 0.5 }}>
          Time Format Guide
        </Typography>
        <Typography variant="caption" sx={{ color: "#555", whiteSpace: "pre-line" }}>
          d = day{"\n"}h = hour
        </Typography>
      </Box>

      {errorMessage && (
        <Typography variant="body2" sx={{ color: "#d32f2f", mb: 1 }}>
          {errorMessage}
        </Typography>
      )}

      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Log work details:
        </Typography>

        {timeEntries.map((entry, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mb: 2,
              position: "relative",
              pb: 2,
              borderBottom: index < timeEntries.length - 1 ? "1px dashed #ddd" : "none"
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Typography variant="body2">Date:</Typography>
              <TextField
                type="date"
                value={entry.date}
                onChange={(e) => handleEntryChange(index, "date", e.target.value)}
                variant="outlined"
                placeholder="Select a date"
                InputLabelProps={{ shrink: true }}
                sx={{ width: "100%" }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
              <Box sx={{ width: "50%" }}>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  Start Time
                </Typography>
                <Autocomplete
                  disablePortal
                  options={timeOptions}
                  value={entry.start_time || null}
                  onChange={(event, newValue) =>
                    handleEntryChange(index, "start_time", newValue || "")
                  }
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" placeholder="Select start time" />
                  )}
                  sx={{ width: "100%" }}
                  getOptionLabel={(option) => option}
                  isOptionEqualToValue={(option, value) => option === value}
                  renderOption={(props, option) => (
                    <li {...props} key={option}>
                      {option}
                    </li>
                  )}
                />
              </Box>

              <Box sx={{ width: "50%" }}>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  End Time
                </Typography>
                <Autocomplete
                  disablePortal
                  options={timeOptions}
                  value={entry.end_time || null}
                  onChange={(event, newValue) => {
                    handleEntryChange(index, "end_time", newValue || "");
                    // Clear error when user selects a new value
                    if (entry.start_time && newValue) {
                      if (isEndTimeAfterStartTime(entry.start_time, newValue)) {
                        setErrorMessage("");
                      }
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" placeholder="Select end time" />
                  )}
                  sx={{ width: "100%" }}
                  getOptionLabel={(option) => option}
                  isOptionEqualToValue={(option, value) => option === value}
                  renderOption={(props, option) => (
                    <li {...props} key={option}>
                      {option}
                    </li>
                  )}
                />
              </Box>

              {timeEntries.length > 1 && (
                <IconButton
                  onClick={() => handleDeleteEntry(index)}
                  sx={{
                    color: "#d32f2f",
                    p: 0.5,
                    position: "absolute",
                    right: -10,
                    top: 65
                  }}
                  aria-label="Delete entry"
                >
                  <Delete fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#741B92",
            color: "#741B92",
            borderRadius: "20px",
            textTransform: "uppercase"
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            backgroundColor: "#741B92",
            color: "#fff",
            borderRadius: "20px",
            textTransform: "uppercase"
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default TimeSpentPopup;
