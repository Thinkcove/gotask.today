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

const CertificateInput: React.FC<CertificateInputProps> = ({ userId, certificates, onChange }) => {
  const trans = useTranslations("User");
  const transuser = useTranslations("User.Certificate_sec");

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
    const updated = [...certificates];
    updated.splice(index, 1);
    onChange(updated);
  };

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
      <Box
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
          <Paper
            key={index}
            elevation={0}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 2,
              border: "1px solid #e0e0e0",
              backgroundColor: "#fff",
              p: 2,
              mb: 2,
              width: "30%"
            }}
          >
            {/* Left: Certificate info */}
            <Box display="flex" alignItems="center" gap={2}>
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
                    <FormattedDateTime date={cert.obtained_date} format="MMMM YYYY" />
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
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Paper>
        ))}
      </Box>

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
                placeholder="Please enter your certification name"
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
                placeholder="DD/MM/YYYY"
                InputLabelProps={{ shrink: true }}
                value={
                  newCert.obtained_date
                    ? new Date(newCert.obtained_date).toISOString().split("T")[0] // Ensures format YYYY-MM-DD
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
                placeholder="Add any optional notes"
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
    </Box>
  );
};

export default CertificateInput;
