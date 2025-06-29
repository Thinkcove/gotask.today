"use client";

import React, { useState } from "react";
import { Box, Typography, IconButton, TextField, Button, Stack, Paper, Grid } from "@mui/material";
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
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2} px={2}>
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
          overflowY: "auto",
          px: 2,
          pb: 2,
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc" }
        }}
      >
        {sortedIncrements.length === 0 ? (
          <Paper
            elevation={1}
            sx={{ p: 3, mt: 2, mb: 2, textAlign: "center", color: "text.secondary" }}
          >
            {transuser("noincrements")}
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {sortedIncrements.map((inc, idx) => {
              const previous = sortedIncrements[idx + 1];
              const percentChange = previous
                ? (((inc.ctc - previous.ctc) / previous.ctc) * 100).toFixed(2)
                : null;

              return (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: "12px",
                      border: "1px solid #e0e0e0",
                      backgroundColor: "#fff"
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography fontWeight={600} fontSize={14}>
                        {transuser("increment")} {sortedIncrements.length - idx}
                      </Typography>
                      <Box>
                        <IconButton onClick={() => startEdit(idx)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setDeleteIndex(idx);
                            setConfirmOpen(true);
                          }}
                        >
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Stack spacing={1}>
                      <Typography fontSize={13}>
                        <strong>{transuser("date")}:</strong>{" "}
                        {new Date(inc.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </Typography>
                      <Typography fontSize={13}>
                        <strong>{transuser("ctc")}:</strong> ₹{inc.ctc.toLocaleString("en-IN")} L
                        {percentChange && (
                          <span style={{ color: "green", marginLeft: 8 }}>↑ {percentChange}%</span>
                        )}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>

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
          {/* Date Label */}
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

          {/* CTC Label */}
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

      {/* Delete Confirmation Dialog */}
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

      {/* Error Dialog */}
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
