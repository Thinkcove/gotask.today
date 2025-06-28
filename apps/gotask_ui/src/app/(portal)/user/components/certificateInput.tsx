"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { ICertificate } from "../interfaces/userInterface";
import { useTranslations } from "next-intl";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import DateFormats from "@/app/component/dateTime/dateFormat";

interface CertificateInputProps {
  userId: string;
  certificates: ICertificate[];
  onChange: (updated: ICertificate[]) => void;
}

const CertificateInput: React.FC<CertificateInputProps> = ({  certificates, onChange }) => {
  const trans = useTranslations("User");
  const transuser = useTranslations("User.Certificate_sec");
  const transInc = useTranslations("User.Increment");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);
  const [newCert, setNewCert] = useState<ICertificate>({
    name: "",
    obtained_date: "",
    notes: ""
  });

  const handleAdd = () => {
    setCurrentEditIndex(null);
    setNewCert({ name: "", obtained_date: "", notes: "" });
    setDialogOpen(true);
  };

  const handleEdit = (index: number) => {
    setCurrentEditIndex(index);
    setNewCert({ ...certificates[index] });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!newCert.name || !newCert.obtained_date) return;

    const updated = [...certificates];
    if (currentEditIndex !== null) {
      updated[currentEditIndex] = newCert; // Update
    } else {
      updated.unshift(newCert); // Add
    }

    onChange(updated);
    setDialogOpen(false);
    setCurrentEditIndex(null);
    setNewCert({ name: "", obtained_date: "", notes: "" });
  };

  const handleRemove = (index: number) => {
    setDeleteIndex(index);
    setConfirmOpen(true);
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  return (
    <Box
      sx={{
        maxHeight: 600,
        overflowY: "auto",
        px: 2,
        py: 2,
        pb: 2,
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#aaa",
          borderRadius: "4px"
        }
      }}
    >
      {/* Top Header */}
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{ textTransform: "none" }}
        >
          {transuser("addcertificate")}
        </Button>
      </Box>

      {/* Certificate List */}
      <Grid
        container
        spacing={2}
        sx={{
          maxHeight: 400,
          overflowY: "auto",
          pr: 1,
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc" }
        }}
      >
        {certificates.map((cert, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={0}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                backgroundColor: "#fff",
                p: 2,
                height: "100%"
              }}
            >
              {/* Left: Certificate info */}
              <Box display="flex" alignItems="flex-start" gap={2}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 1,
                    backgroundColor: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    color: "#888"
                  }}
                >
                  🎓
                </Box>

                <Box>
                  <Typography fontSize={14} fontWeight={600}>
                    {cert.name}
                  </Typography>
                  <Typography fontSize={12} color="text.secondary">
                    {transuser("obtaineddate")}:{" "}
                    {cert.obtained_date ? (
                      <FormattedDateTime
                        date={cert.obtained_date}
                        format={DateFormats.MONTH_YEAR}
                      />
                    ) : (
                      "N/A"
                    )}
                  </Typography>

                  {cert.notes && (
                    <Typography fontSize={12} color="text.secondary" mt={0.5}>
                      {cert.notes}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Right: Actions */}
              <Box>
                <IconButton onClick={() => handleEdit(index)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={() => handleRemove(index)}>
                  <DeleteIcon fontSize="small" color="error" />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for Add/Edit */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentEditIndex !== null ? transuser("editcertificate") : transuser("addcertificate")}
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            maxHeight: 400,
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc", borderRadius: 2 }
          }}
        >
          <Typography color="text.secondary" fontSize={14} mb={2}>
            {transuser("subtitle")}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography fontWeight={600} fontSize={14} mb={0.5}>
                {transuser("certificatename")}
                <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                placeholder={transuser("c_name")}
                value={newCert.name}
                onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <Typography fontWeight={600} fontSize={14} mb={0.5}>
                {transuser("obtaineddate")}
              </Typography>
              <TextField
                type="date"
                placeholder={transuser("d_format")}
                InputLabelProps={{ shrink: true }}
                value={
                  newCert.obtained_date
                    ? new Date(newCert.obtained_date).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => setNewCert({ ...newCert, obtained_date: e.target.value })}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <Typography fontWeight={600} fontSize={14} mb={0.5}>
                {transuser("notes")}
              </Typography>
              <TextField
                placeholder={transuser("notes_placeholder")}
                value={newCert.notes}
                onChange={(e) => setNewCert({ ...newCert, notes: e.target.value })}
                fullWidth
                multiline
                minRows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: "none" }}>
            {trans("cancel")}
          </Button>
          <Button variant="contained" onClick={handleSave} sx={{ textTransform: "none", px: 3 }}>
            {trans("save")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>{transInc("confirm_Delete")}</DialogTitle>
        <DialogContent>
          <Typography>{transInc("delete_Increment")}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>{transInc("cancel")}</Button>
          <Button
            onClick={() => {
              if (deleteIndex !== null) {
                const updated = certificates.filter((_, i) => i !== deleteIndex);
                onChange(updated);
              }
              setConfirmOpen(false);
              setDeleteIndex(null);
            }}
            variant="contained"
          >
            {transInc("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CertificateInput;
