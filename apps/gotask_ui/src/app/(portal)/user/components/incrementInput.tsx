"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Stack,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { IIncrementHistory } from "../interfaces/userInterface";
import { useTranslations } from "next-intl";

interface Props {
  increment_history: IIncrementHistory[];
  onChange: (updated: IIncrementHistory[]) => void;
}

const IncrementInput: React.FC<Props> = ({ increment_history, onChange }) => {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newIncrement, setNewIncrement] = useState<IIncrementHistory>({ date: "", ctc: 0 });
  const [open, setOpen] = useState(false);
  const transuser = useTranslations("User.Increment");

  const sortedIncrements = [...increment_history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleAdd = () => {
    if (!newIncrement.date || !newIncrement.ctc || newIncrement.ctc <= 0) return;
    const exists = increment_history.some((i) => i.date === newIncrement.date);
    if (exists) return alert("Duplicate increment date");
    const updated = [...increment_history, newIncrement];
    onChange(updated);
    setNewIncrement({ date: "", ctc: 0 });
    setOpen(false);
  };

  const handleUpdate = (index: number) => {
    if (!newIncrement.date || !newIncrement.ctc || newIncrement.ctc <= 0) return;
    const updated = [...increment_history];
    updated[index] = newIncrement;
    onChange(updated);
    setEditIndex(null);
    setNewIncrement({ date: "", ctc: 0 });
  };

  const handleDelete = (index: number) => {
    setDeleteIndex(index);
    setConfirmOpen(true);
  };

  const startEdit = (index: number) => {
    setEditIndex(index);
    setNewIncrement(increment_history[index]);
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setNewIncrement({ date: "", ctc: 0 });
  };
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <Box mt={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} px={2}>
        <Typography variant="h6" fontWeight={600} fontSize={16}>
          {transuser("increment_History")}
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{ textTransform: "none", fontSize: 13 }}
        >
          {transuser("add")}
        </Button>
      </Box>

      <Box
        sx={{
          maxHeight: "calc(100vh - 300px)",
          overflowY: "auto",
          px: 2,
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc" }
        }}
      >
        <Grid container spacing={2}>
          {sortedIncrements.map((inc, idx) => {
            const isEditing = editIndex === idx;
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
                    borderRadius: "12px",
                    border: "1px solid #e0e0e0",
                    backgroundColor: "#fff",
                    height: "100%"
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography fontWeight={600} fontSize={14}>
                      {transuser("increment")} {sortedIncrements.length - idx}
                    </Typography>
                    <Box>
                      {isEditing ? (
                        <IconButton onClick={cancelEdit}>
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      ) : (
                        <IconButton onClick={() => startEdit(idx)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton onClick={() => handleDelete(idx)}>
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </Box>
                  </Box>

                  {isEditing ? (
                    <Stack spacing={2}>
                      <TextField
                        label={transuser("date")}
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={newIncrement.date}
                        onChange={(e) => setNewIncrement({ ...newIncrement, date: e.target.value })}
                        fullWidth
                        size="small"
                      />
                      <TextField
                        label={transuser("ctc")}
                        type="number"
                        value={newIncrement.ctc}
                        onChange={(e) => setNewIncrement({ ...newIncrement, ctc: +e.target.value })}
                        fullWidth
                        size="small"
                      />
                      <Stack direction="row" spacing={1}>
                        <Button variant="contained" onClick={() => handleUpdate(idx)} size="small">
                          {transuser("save")}
                        </Button>
                        <Button onClick={cancelEdit} size="small">
                          {transuser("cancel")}
                        </Button>
                      </Stack>
                    </Stack>
                  ) : (
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
                        <strong>{transuser("ctc")}:</strong> ₹{inc.ctc.toLocaleString("en-IN")}
                        {percentChange && (
                          <span style={{ color: "green", marginLeft: 8 }}>↑ {percentChange}%</span>
                        )}
                      </Typography>
                    </Stack>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Add Increment Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{transuser("add_new")}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Box>
              <Typography fontSize={13} mb={0.5}>
                {transuser("date")}
              </Typography>
              <TextField
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newIncrement.date}
                onChange={(e) => setNewIncrement({ ...newIncrement, date: e.target.value })}
                fullWidth
                sx={{ "& input": { fontSize: 13 } }}
              />
            </Box>
            <Box>
              <Typography fontSize={13} mb={0.5}>
                {transuser("ctc")}
              </Typography>
              <TextField
                label={transuser("ctc")}
                type="number"
                value={newIncrement.ctc}
                onChange={(e) => {
                  const value = +e.target.value;
                  setNewIncrement({ ...newIncrement, ctc: value < 0 ? 0 : value });
                }}
                inputProps={{ min: 0 }}
                fullWidth
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>{transuser("cancel")}</Button>
          <Button variant="contained" onClick={handleAdd}>
            {transuser("save")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>{transuser("confirm_Delete")}</DialogTitle>
        <DialogContent>
          <Typography>{transuser("delete_Increment")}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>{transuser("cancel")}</Button>
          <Button
            onClick={() => {
              if (deleteIndex !== null) {
                const updated = increment_history.filter((_, i) => i !== deleteIndex);
                onChange(updated);
              }
              setConfirmOpen(false);
              setDeleteIndex(null);
            }}
            variant="contained"
          >
            {transuser("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IncrementInput;
