"use client";

import React, { useState, useEffect } from "react";
import { Box, Button, Typography, IconButton, TextField } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { logTaskTime } from "../service/taskAction";
import { KeyedMutator } from "swr";
import { ITask, TimeEntry } from "../interface/taskInterface";
import { TIME_FORMAT_PATTERNS, TIME_GUIDE_DESCRIPTION } from "../../../common/constants/timeTask";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { format, parse } from "date-fns";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";

const formatTimeString = (time: string): string => {
  if (!time) return "0d0h0m";

  const match = time.match(TIME_FORMAT_PATTERNS.DURATION_PARSE_FORMAT);

  if (!match) return "0d0h0m";

  const days = parseInt(match[1]) || 0;
  const hours = parseInt(match[2]) || 0;
  const minutes = parseInt(match[3]) || 0;

  const sign = days < 0 ? "-" : "";
  return `${sign}${Math.abs(days)}d${hours}h${minutes}m`;
};

// Utility to compare times in "h:mm a" format (e.g., "9:01 AM")
const isEndTimeAfterStartTime = (startTime: string, endTime: string): boolean => {
  if (!startTime || !endTime) return false;
  try {
    const start = parse(startTime, "h:mm a", new Date());
    const end = parse(endTime, "h:mm a", new Date());
    return end > start;
  } catch {
    return false;
  }
};

interface TimeSpentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  originalEstimate: string;
  taskId: string;
  dueDate: string;
  mutate: KeyedMutator<ITask>;
}

const TimeSpentPopup: React.FC<TimeSpentPopupProps> = ({
  isOpen,
  onClose,
  originalEstimate,
  taskId,
  dueDate,
  mutate
}) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    { date: "", start_time: "", end_time: "" }
  ]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [dateErrors, setDateErrors] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split("T")[0];
      const initialEntries = [{ date: today, start_time: "", end_time: "" }];
      setTimeEntries(initialEntries);
      setErrorMessage("");
      setDateErrors([]);
    }
  }, [isOpen]);

  const handleEntryChange = (
    index: number,
    field: keyof TimeEntry,
    value: string | Date | null
  ) => {
    const updated = [...timeEntries];
    const updatedErrors = [...dateErrors];

    if (field === "date") {
      updatedErrors[index] = "";
      updated[index].date = value as string;

      const dueDateObj = new Date(dueDate);
      const entryDateObj = new Date(value as string);
      if (!isNaN(dueDateObj.getTime()) && entryDateObj < dueDateObj) {
        updatedErrors[index] = transtask("duedate");
      }

      setDateErrors(updatedErrors);
      setTimeEntries(updated);
      return;
    }

    if (field === "start_time" || field === "end_time") {
      const timeValue =
        value instanceof Date && !isNaN(value.getTime()) ? format(value, "h:mm a") : "";
      updated[index] = {
        ...updated[index],
        [field]: timeValue
      };

      setTimeEntries(updated);

      if (field === "end_time" && updated[index].start_time) {
        if (!isEndTimeAfterStartTime(updated[index].start_time, timeValue)) {
          setErrorMessage(transtask("endstarttime"));
        } else {
          setErrorMessage("");
        }
      }
    }
  };

  const handleDeleteEntry = (index: number) => {
    if (timeEntries.length === 1) return;
    const updated = [...timeEntries];
    const updatedErrors = [...dateErrors];
    updated.splice(index, 1);
    updatedErrors.splice(index, 1);
    setTimeEntries(updated);
    setDateErrors(updatedErrors);
  };

  const validateEntries = () => {
    for (const [index, entry] of timeEntries.entries()) {
      if (!entry.date || !entry.start_time || !entry.end_time) {
        setErrorMessage(transtask("allfieldfill"));
        return false;
      }

      if (!isEndTimeAfterStartTime(entry.start_time, entry.end_time)) {
        setErrorMessage(transtask("endstarttime"));
        return false;
      }

      if (dateErrors[index]) {
        setErrorMessage(dateErrors[index]);
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
      setErrorMessage(transtask("failedentry"));
    }
  };

  const formattedOriginalEstimate = formatTimeString(originalEstimate);

  if (!isOpen) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#fff",
          padding: 2.5,
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          zIndex: 1200,
          minWidth: 250,
          maxWidth: 380,
          width: "90vw",
          maxHeight: "90vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "#741B92" }}>
          {transtask("updatetrack")}
        </Typography>

        <Typography variant="body2" sx={{ fontStyle: "italic", color: "#666" }}>
          {transtask("originalestimate")} {formattedOriginalEstimate}
        </Typography>
        <Box sx={{ backgroundColor: "#F3E5F5", borderRadius: 1, p: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#741B92", mb: 0.5 }}>
            {transtask("timeformat")}
          </Typography>
          <Typography variant="caption" sx={{ color: "#555", whiteSpace: "pre-line" }}>
            {TIME_GUIDE_DESCRIPTION.DAY}
            {"\n"}
            {TIME_GUIDE_DESCRIPTION.HOUR}
          </Typography>
        </Box>

        {errorMessage && (
          <Typography variant="body2" sx={{ color: "#d32f2f", mb: 1 }}>
            {errorMessage}
          </Typography>
        )}

        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
            {transtask("logformat")}
          </Typography>

          {timeEntries.map((entry, index) => {
            return (
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
                  <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                    {transtask("date")}
                  </Typography>
                  <TextField
                    type="date"
                    value={entry.date}
                    onChange={(e) => handleEntryChange(index, "date", e.target.value)}
                    variant="outlined"
                    placeholder={transtask("selectname")}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100%" }}
                    error={!!dateErrors[index]}
                    helperText={dateErrors[index]}
                  />
                </Box>

                <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                  <Box sx={{ width: "50%" }}>
                    <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                      {transtask("starttime")}
                    </Typography>
                    <MobileTimePicker
                      value={
                        entry.start_time ? parse(entry.start_time, "h:mm a", new Date()) : null
                      }
                      onChange={(newValue) => handleEntryChange(index, "start_time", newValue)}
                      ampmInClock={true}
                      ampm
                      views={["hours", "minutes"]}
                      format="hh:mm a"
                      minutesStep={1}
                      slotProps={{
                        textField: {
                          variant: "outlined",
                          placeholder: "Select time",
                          sx: {
                            width: "100%",
                            "& .MuiClockNumber-root": {
                              cursor: "pointer"
                            }
                          }
                        }
                      }}
                    />
                  </Box>

                  <Box sx={{ width: "50%" }}>
                    <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                      {transtask("endtime")}
                    </Typography>
                    <MobileTimePicker
                      value={entry.end_time ? parse(entry.end_time, "h:mm a", new Date()) : null}
                      onChange={(newValue) => handleEntryChange(index, "end_time", newValue)}
                      ampmInClock={true}
                      ampm
                      format="hh:mm a"
                      views={["hours", "minutes"]}
                      minTime={
                        entry.start_time ? parse(entry.start_time, "h:mm a", new Date()) : undefined
                      }
                      minutesStep={1}
                      slotProps={{
                        textField: {
                          variant: "outlined",
                          placeholder: "Select end time",
                          sx: {
                            width: "100%",
                            "& .MuiClockNumber-root": {
                              cursor: "pointer"
                            }
                          }
                        }
                      }}
                    />
                  </Box>

                  {timeEntries.length > 1 && (
                    <IconButton
                      onClick={() => handleDeleteEntry(index)}
                      sx={{
                        color: "#d32f2f",
                        p: 0.5,
                        position: "absolute",
                        right: 10,
                        top: 65
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Box>
            );
          })}
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
            {transtask("popupcancel")}
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
            {transtask("popupsave")}
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default TimeSpentPopup;
