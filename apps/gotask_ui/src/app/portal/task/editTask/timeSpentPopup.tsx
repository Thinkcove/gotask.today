import React, { useState } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { logTaskTime } from "../service/taskAction";
import { KeyedMutator } from "swr";
import { ITask } from "../interface/taskInterface";

interface TimeEntry {
  date: string;
  time_logged: string;
}

interface TimeSpentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  originalEstimate: string;
  taskId: string;
  mutate: KeyedMutator<ITask>;
}

const hourOptions = Array.from({ length: 8 }, (_, i) => `${i + 1}:00`);

const TimeSpentPopup: React.FC<TimeSpentPopupProps> = ({
  isOpen,
  onClose,
  originalEstimate,
  taskId,
  mutate
}) => {
  const [timeSpent, setTimeSpent] = useState("");
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry>({ date: "", time_logged: "" });

  const isDaysFormat = (val: string) => /^\d+d$/.test(val);
  const isDaysMode = isDaysFormat(timeSpent);

  const handleTimeSpentInput = (value: string) => {
    setTimeSpent(value);
    const match = value.match(/^(\d+)d$/);
    if (match) {
      const days = parseInt(match[1], 10);
      const newEntries = Array.from({ length: days }, () => ({ date: "", time_logged: "" }));
      setTimeEntries(newEntries);
    } else {
      setTimeEntries([]);
    }
  };

  const handleEntryChange = (index: number, field: keyof TimeEntry, value: string) => {
    const updated = [...timeEntries];
    updated[index] = { ...updated[index], [field]: value };
    setTimeEntries(updated);
  };

  const handleAddEntry = () => {
    if (!currentEntry.date || !currentEntry.time_logged) return;
    const updated = [...timeEntries, currentEntry];
    setTimeEntries(updated);
    setCurrentEntry({ date: "", time_logged: "" });
    const newSpent = `${updated.length}d`;
    setTimeSpent(newSpent);
  };

  const handleDeleteEntry = (index: number) => {
    const updated = [...timeEntries];
    updated.splice(index, 1);
    setTimeEntries(updated);
    const newSpent = updated.length > 0 ? `${updated.length}d` : "";
    setTimeSpent(newSpent);
  };

  const handleSave = async () => {
    try {
      await logTaskTime(taskId, timeEntries);
      await mutate();
      onClose();
    } catch (err) {
      console.error("Error logging time:", err);
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

      <Box sx={{ display: "flex", gap: 2 }}>
        <Box sx={{ width: "100%" }}>
          <Typography variant="body2">Time Spent:</Typography>
          <input
            value={timeSpent}
            onChange={(e) => handleTimeSpentInput(e.target.value)}
            placeholder="e.g., 1d, 2d"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          />
        </Box>
      </Box>

      {/* Time Entries Section */}
      {timeSpent && (
        <Box>
          <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: 600 }}>
            Log work details:
          </Typography>

          {timeEntries.map((entry, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                p: 1,
                borderRadius: 1,
                bgcolor: "rgba(116, 27, 146, 0.05)"
              }}
            >
              <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
                <Box sx={{ width: "60%" }}>
                  <Typography variant="body2">Date {index + 1}:</Typography>
                  <input
                    type="date"
                    value={entry.date}
                    onChange={(e) => handleEntryChange(index, "date", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "6px",
                      border: "1px solid #ccc",
                      borderRadius: "4px"
                    }}
                  />
                </Box>
                <Box sx={{ width: "40%" }}>
                  <Typography variant="body2">Hours:</Typography>
                  <select
                    value={entry.time_logged}
                    onChange={(e) => handleEntryChange(index, "time_logged", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "6px",
                      border: "1px solid #ccc",
                      borderRadius: "4px"
                    }}
                  >
                    <option value="">Select hour</option>
                    {hourOptions.map((hour) => (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                </Box>
              </Box>

              {/* {!isDaysMode && ( */}
              <IconButton onClick={() => handleDeleteEntry(index)} sx={{ color: "#d32f2f", mt: 2 }}>
                <Delete fontSize="small" />
              </IconButton>
              {/* )} */}
            </Box>
          ))}

          {!isDaysMode && (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                p: 1,
                borderRadius: 1,
                bgcolor: "rgba(116, 27, 146, 0.05)"
              }}
            >
              <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
                <Box sx={{ width: "60%" }}>
                  <Typography variant="body2">New Date:</Typography>
                  <input
                    type="date"
                    value={currentEntry.date}
                    onChange={(e) => setCurrentEntry((prev) => ({ ...prev, date: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "6px",
                      border: "1px solid #ccc",
                      borderRadius: "4px"
                    }}
                  />
                </Box>
                <Box sx={{ width: "40%" }}>
                  <Typography variant="body2">Hours:</Typography>
                  <select
                    value={currentEntry.time_logged}
                    onChange={(e) =>
                      setCurrentEntry((prev) => ({ ...prev, time_logged: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      padding: "6px",
                      border: "1px solid #ccc",
                      borderRadius: "4px"
                    }}
                  >
                    <option value="">Select hour</option>
                    {hourOptions.map((hour) => (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                </Box>
              </Box>
              <IconButton onClick={handleAddEntry} sx={{ color: "#741B92", mt: 2 }}>
                <Add fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderColor: "#741B92", color: "#741B92", borderRadius: "20px" }}
        >
          Cancel
        </Button>
        {timeSpent && (
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ backgroundColor: "#741B92", color: "#fff", borderRadius: "20px" }}
          >
            Save
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default TimeSpentPopup;
