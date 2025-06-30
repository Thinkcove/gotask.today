"use client";

import React, { useState } from "react";
import { Box, Typography, TextField, Button, Stack, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { IIncrementHistory } from "../interfaces/userInterface";
import { useTranslations } from "next-intl";
import CommonDialog from "@/app/component/dialog/commonDialog";

interface IncrementHistoryProps {
  increment_history: IIncrementHistory[];
  onChange: (updated: IIncrementHistory[]) => void;
}

const IncrementInput: React.FC<IncrementHistoryProps> = ({ increment_history, onChange }) => {
  const transuser = useTranslations("User.Increment");

  const [newIncrement, setNewIncrement] = useState<IIncrementHistory>({
    date: "",
    ctc: 0
  });
  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  const sortedIncrements = [...increment_history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const resetForm = () => setNewIncrement({ date: "", ctc: 0 });

  const handleAdd = () => {
    if (!newIncrement.date || newIncrement.ctc <= 0) return;

    const newDate = new Date(newIncrement.date).toISOString().split("T")[0];
    const isDuplicate = increment_history.some((i) => {
      const existingDate = new Date(i.date).toISOString().split("T")[0];
      return existingDate === newDate;
    });

    if (isDuplicate) {
      setErrorOpen(true);
      return;
    }

    const updated = [...increment_history, newIncrement];
    onChange(updated);
    resetForm();
    setOpen(false);
  };

  return (
    <Box mt={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} px={2}>
        <Typography fontWeight={600} fontSize={16}>
          {transuser("salaryrevisionlog")}
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
          sx={{ textTransform: "none", fontSize: 13 }}
        >
          {transuser("addnew")}
        </Button>
      </Box>

      {/* Display increments */}
      <Box
        sx={{
          maxHeight: "calc(100vh - 300px)",
          overflowX: "auto",
          px: 2,
          pb: 2,
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { height: "6px" },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc" }
        }}
      >
        <Grid container spacing={2} px={2} mt={1}>
          {sortedIncrements.map((inc, idx) => {
            const previous = sortedIncrements[idx + 1];
            const percentChange = previous
              ? (((inc.ctc - previous.ctc) / previous.ctc) * 100).toFixed(2)
              : null;

            const dateObj = new Date(inc.date);
            const monthYear = dateObj.toLocaleDateString("en-IN", {
              month: "short",
              year: "numeric"
            });
            const fullDate = dateObj.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            });

            return (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Box
                  sx={{
                    borderLeft: idx % 4 !== 0 ? "1px solid #e0e0e0" : "none",
                    pl: idx % 4 !== 0 ? 2 : 0
                  }}
                >
                  <Typography fontSize={12} color="text.secondary">
                    {monthYear}
                  </Typography>
                  <Typography fontSize={13}>{fullDate}</Typography>
                  <Typography fontSize={13}>
                    ₹{inc.ctc.toLocaleString("en-IN")} L{" "}
                    {percentChange && (
                      <span style={{ color: "green", marginLeft: 4 }}>↑ {percentChange}%</span>
                    )}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Add Dialog */}
      <CommonDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleAdd}
        title={transuser("addnew")}
        submitLabel={transuser("save")}
        cancelLabel={transuser("cancel")}
      >
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {transuser("addincdesc")}
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Typography fontSize={13} mb={0.5} mt={1}>
              {transuser("date")}
            </Typography>
            <TextField
              type="date"
              InputLabelProps={{ shrink: true }}
              value={newIncrement.date}
              onChange={(e) => setNewIncrement({ ...newIncrement, date: e.target.value })}
              fullWidth
            />
          </Box>
          <Box>
            <Typography fontSize={13} mb={0.5}>
              {transuser("ctc")}
            </Typography>
            <TextField
              type="number"
              value={newIncrement.ctc}
              onChange={(e) =>
                setNewIncrement({
                  ...newIncrement,
                  ctc: Math.max(0, +e.target.value)
                })
              }
              fullWidth
            />
          </Box>
        </Stack>
      </CommonDialog>

      {/* Duplicate Entry Error Dialog */}
      <CommonDialog
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        onSubmit={() => setErrorOpen(false)}
        title={transuser("errortitle")}
        cancelLabel=""
      >
        <Typography>{transuser("duplicateincrementdate")}</Typography>
      </CommonDialog>
    </Box>
  );
};

export default IncrementInput;
