"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, IconButton, Button, Paper, Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { ICertificate } from "../interfaces/userInterface";
import { useTranslations } from "next-intl";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import DateFormats from "@/app/component/dateTime/dateFormat";
import CommonDialog from "@/app/component/dialog/commonDialog";
import {
  getUserCertificates,
  addUserCertificates,
  updateUserCertificate,
  deleteUserCertificate
} from "../services/userAction";

interface CertificateInputProps {
  userId: string;
}

const CertificateInput: React.FC<CertificateInputProps> = ({ userId }) => {
  const trans = useTranslations("User");
  const transuser = useTranslations("User.Certificate");
  const transInc = useTranslations("User.Increment");

  const [certificates, setCertificates] = useState<ICertificate[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const emptyCert: ICertificate = { name: "", obtained_date: "", notes: "" };
  const [tempCert, setTempCert] = useState<ICertificate>(emptyCert);

  // Load certificates on mount
  useEffect(() => {
    const fetchCertificates = async () => {
      const data = await getUserCertificates(userId);
      setCertificates(data);
      setLoading(false);
    };
    fetchCertificates();
  }, [userId]);

  const openAddDialog = () => {
    setTempCert(emptyCert);
    setCurrentEditIndex(null);
    setDialogOpen(true);
  };

  const openEditDialog = (index: number) => {
    setTempCert({ ...certificates[index] });
    setCurrentEditIndex(index);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!tempCert.name || !tempCert.obtained_date) return;

    if (currentEditIndex !== null) {
      const result = await updateUserCertificate(userId, currentEditIndex, tempCert);
      if (result?.success) {
        const updated = [...certificates];
        updated[currentEditIndex] = tempCert;
        setCertificates(updated);
      }
    } else {
      const result = await addUserCertificates(userId, [tempCert]);
      if (result?.success) {
        const updated = [tempCert, ...certificates];
        setCertificates(updated);
      }
    }

    setDialogOpen(false);
    setTempCert(emptyCert);
    setCurrentEditIndex(null);
  };

  const confirmDelete = async () => {
    if (deleteIndex !== null) {
      const result = await deleteUserCertificate(userId, deleteIndex);
      if (result?.success) {
        const updated = certificates.filter((_, i) => i !== deleteIndex);
        setCertificates(updated);
      }
    }
    setDeleteIndex(null);
    setConfirmOpen(false);
  };

  return (
    <Box
      sx={{
        maxHeight: 600,
        overflowY: "auto",
        px: 2,
        py: 2,
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-thumb": { backgroundColor: "#aaa", borderRadius: 4 }
      }}
    >
      {/* Add Button */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAddDialog}
          sx={{ textTransform: "none" }}
        >
          {transuser("addcertificate")}
        </Button>
      </Box>

      {/* List of Certificates */}
      {loading ? (
        <Typography>{trans("loading")}</Typography>
      ) : certificates.length === 0 ? (
        <Paper elevation={1} sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
          {transuser("nocertifications")}
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {certificates.map((cert, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid #e0e0e0"
                }}
              >
                <Box display="flex" gap={2}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 1,
                      backgroundColor: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24
                    }}
                  >
                    🎓
                  </Box>
                  <Box>
                    <Typography fontSize={14} fontWeight={600}>
                      {cert.name}
                    </Typography>
                    <Typography fontSize={12} color="text.secondary">
                      {transuser("obtained")}:{" "}
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

                <Box>
                  <IconButton onClick={() => openEditDialog(index)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setDeleteIndex(index);
                      setConfirmOpen(true);
                    }}
                  >
                    <DeleteIcon fontSize="small" color="error" />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <CommonDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setTempCert(emptyCert);
          setCurrentEditIndex(null);
        }}
        onSubmit={handleSave}
        title={
          currentEditIndex !== null ? transuser("editcertificate") : transuser("addcertificate")
        }
        submitLabel={trans("save")}
        cancelLabel={trans("cancel")}
      >
        <Typography color="text.secondary" fontSize={14} mb={2}>
          {transuser("subtitle")}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography fontWeight={600} fontSize={14} mb={0.5}>
              {transuser("certificatename")} <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              placeholder={transuser("cname")}
              value={tempCert.name}
              onChange={(e) => setTempCert({ ...tempCert, name: e.target.value })}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Typography fontWeight={600} fontSize={14} mb={0.5}>
              {transuser("obtaineddate")}
            </Typography>
            <TextField
              type="date"
              InputLabelProps={{ shrink: true }}
              value={
                tempCert.obtained_date
                  ? new Date(tempCert.obtained_date).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => setTempCert({ ...tempCert, obtained_date: e.target.value })}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Typography fontWeight={600} fontSize={14} mb={0.5}>
              {transuser("notes")}
            </Typography>
            <TextField
              placeholder={transuser("notesplaceholder")}
              value={tempCert.notes}
              onChange={(e) => setTempCert({ ...tempCert, notes: e.target.value })}
              fullWidth
              multiline
              minRows={3}
            />
          </Grid>
        </Grid>
      </CommonDialog>

      {/* Confirm Delete Dialog */}
      <CommonDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onSubmit={confirmDelete}
        title={transInc("confirmdelete")}
        submitLabel={transInc("delete")}
        cancelLabel={transInc("cancel")}
      >
        <Typography>{transInc("deleteincrement")}</Typography>
      </CommonDialog>
    </Box>
  );
};

export default CertificateInput;
