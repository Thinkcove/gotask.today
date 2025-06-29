"use client";

import React, { useState } from "react";
import { Box, Typography, IconButton, TextField, Button, Stack, Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newIncrement, setNewIncrement] = useState<IIncrementHistory>({ date: "", ctc: 0 });
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const sortedIncrements = [...increment_history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const resetForm = () => setNewIncrement({ date: "", ctc: 0 });

  const handleAddOrUpdate = () => {
    if (!newIncrement.date || newIncrement.ctc <= 0) return;

    const newDate = new Date(newIncrement.date).toISOString().split("T")[0];
    const isDuplicate = increment_history.some((i, idx) => {
      const existingDate = new Date(i.date).toISOString().split("T")[0];
      return existingDate === newDate && idx !== editIndex;
    });

    if (isDuplicate) {
      setErrorOpen(true);
      return;
    }

    const updated = [...increment_history];

    if (editIndex !== null) {
      updated[editIndex] = newIncrement;
    } else {
      updated.push(newIncrement);
    }

    onChange(updated);
    resetForm();
    setEditIndex(null);
    setOpen(false);
  };

  const handleDelete = () => {
    if (deleteIndex !== null) {
      const updated = increment_history.filter((_, i) => i !== deleteIndex);
      onChange(updated);
      setDeleteIndex(null);
      setConfirmOpen(false);
    }
  };

  const startEdit = (index: number) => {
    setEditIndex(index);
    setNewIncrement(increment_history[index]);
    setOpen(true);
  };

  return (
    <Box mt={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} px={2}>
        <Typography fontWeight={600} fontSize={16}>
          {transuser("salaryrevisionlog")}
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => {
            setEditIndex(null);
            resetForm();
            setOpen(true);
          }}
          sx={{ textTransform: "none", fontSize: 13 }}
        >
          {transuser("addnew")}
        </Button>
      </Box>

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
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontSize={12} color="text.secondary">
                      {monthYear}
                    </Typography>
                    <Box>
                      <IconButton onClick={() => startEdit(idx)} size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setDeleteIndex(idx);
                          setConfirmOpen(true);
                        }}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </Box>
                  </Box>

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

      {/* Dialogs stay same */}
      <CommonDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleAddOrUpdate}
        title={editIndex !== null ? transuser("editincrement") : transuser("addnew")}
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
              placeholder={transuser("date")}
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
                setNewIncrement({ ...newIncrement, ctc: Math.max(0, +e.target.value) })
              }
              fullWidth
            />
          </Box>
        </Stack>
      </CommonDialog>

      <CommonDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onSubmit={handleDelete}
        title={transuser("confirmdelete")}
        submitLabel={transuser("delete")}
        cancelLabel={transuser("cancel")}
      >
        <Typography>{transuser("deleteincrement")}</Typography>
      </CommonDialog>

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
