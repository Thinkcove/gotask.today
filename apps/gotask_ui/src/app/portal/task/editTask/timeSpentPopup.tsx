"use client";

import React, { useState, useEffect } from "react";
import { Box, Button, Typography, IconButton, Autocomplete, TextField } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { logTaskTime } from "../service/taskAction";
import { KeyedMutator } from "swr";
import { ITask, TimeEntry, TimeOption } from "../interface/taskInterface";
import { isEndTimeAfterStartTime } from "@/app/common/utils/common";
import { timeOptions as importedTimeOptions } from "../../../common/constants/timeOptions";
import { TIME_GUIDE_DESCRIPTION } from "@/app/common/constants/timeTask";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

interface TimeSpentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  originalEstimate: string;
  taskId: string;
  dueDate: string;
  mutate: KeyedMutator<ITask>;
}

const timeOptions: TimeOption[] = importedTimeOptions.map((time) => ({
  label: time,
  value: time
}));

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

  const handleEntryChange = (index: number, field: keyof TimeEntry, value: string) => {
    const updated = [...timeEntries];
    const updatedErrors = [...dateErrors];

    if (field === "date") {
      updatedErrors[index] = "";
      updated[index].date = value;

      const dueDateObj = new Date(dueDate);
      const entryDateObj = new Date(value);
      if (!isNaN(dueDateObj.getTime()) && entryDateObj < dueDateObj) {
        updatedErrors[index] ="Cannot register time before the due date.";
      }

      setDateErrors(updatedErrors);
      setTimeEntries(updated);
      return;
    }

    updated[index] = {
      ...updated[index],
      [field]: value
    };

    setTimeEntries(updated);

    if (field === "end_time" && updated[index].start_time) {
      if (!isEndTimeAfterStartTime(updated[index].start_time, value)) {
        setErrorMessage(transtask("endstarttime"));
      } else {
        setErrorMessage("");
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
        {transtask("updatetrack")}
      </Typography>

      <Typography variant="body2" sx={{ fontStyle: "italic", color: "#666" }}>
        {transtask("originalestimate")} {originalEstimate || "0d0h"}
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
              <Typography variant="body2">{transtask("date")}</Typography>
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
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {transtask("starttime")}
                </Typography>
                <Autocomplete
                  disablePortal
                  options={timeOptions}
                  value={
                    entry.start_time
                      ? timeOptions.find((option) => option.value === entry.start_time) || null
                      : null
                  }
                  onChange={(event, newValue) =>
                    handleEntryChange(index, "start_time", newValue ? newValue.value : "")
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder={transtask("selectstart")}
                    />
                  )}
                  sx={{ width: "100%" }}
                  getOptionLabel={(option: TimeOption) => option.label}
                  isOptionEqualToValue={(option: TimeOption, value: TimeOption) =>
                    option.value === value.value
                  }
                  renderOption={(props, option: TimeOption) => (
                    <li {...props} key={option.value}>
                      {option.label}
                    </li>
                  )}
                />
              </Box>

              <Box sx={{ width: "50%" }}>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {transtask("endtime")}
                </Typography>
                <Autocomplete
                  disablePortal
                  options={timeOptions}
                  value={
                    entry.end_time
                      ? timeOptions.find((option) => option.value === entry.end_time) || null
                      : null
                  }
                  onChange={(event, newValue) => {
                    handleEntryChange(index, "end_time", newValue ? newValue.value : "");
                    if (entry.start_time && newValue) {
                      if (isEndTimeAfterStartTime(entry.start_time, newValue.value)) {
                        setErrorMessage("");
                      }
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" placeholder={transtask("placeholderselecttime")} />
                  )}
                  sx={{ width: "100%" }}
                  getOptionLabel={(option: TimeOption) => option.label}
                  isOptionEqualToValue={(option: TimeOption, value: TimeOption) =>
                    option.value === value.value
                  }
                  renderOption={(props, option: TimeOption) => (
                    <li {...props} key={option.value}>
                      {option.label}
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
  );
};

export default TimeSpentPopup;
