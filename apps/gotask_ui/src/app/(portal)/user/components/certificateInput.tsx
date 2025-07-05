"use client";

import React, { useState } from "react";
import useSWR from "swr";
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
  certificates?: ICertificate[];
  onChange?: () => void;
}

const CertificateInput: React.FC<CertificateInputProps> = ({ userId }) => {
  const trans = useTranslations("User");
  const transuser = useTranslations("User.Certificate");
  const transInc = useTranslations("User.Increment");

  const {
    data: certificates = [],
    isLoading,
    mutate
  } = useSWR(`/user/${userId}/certificates`, () => getUserCertificates(userId));

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const emptyCert: ICertificate = { certificate_id: "", name: "", obtained_date: "", notes: "" };
  const [tempCert, setTempCert] = useState<ICertificate>(emptyCert);

  const openAddDialog = () => {
    setTempCert(emptyCert);
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEditDialog = (cert: ICertificate) => {
    setTempCert({ ...cert });
    setEditingId(cert.certificate_id ?? null);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!tempCert.name || !tempCert.obtained_date) return;

    if (editingId) {
      await updateUserCertificate(userId, editingId, tempCert);
    } else {
      await addUserCertificates(userId, [tempCert]);
    }

    setDialogOpen(false);
    setTempCert(emptyCert);
    setEditingId(null);
    await mutate();
  };

  const confirmDelete = async () => {
    if (deletingId) {
      await deleteUserCertificate(userId, deletingId);
      await mutate();
    }
    setDeletingId(null);
    setConfirmOpen(false);
  };

  return (
    <Box mt={3}>
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

      <Box
        sx={{
          maxHeight: 400,
          overflow: "auto",
          borderRadius: 2,
          px: 2,
          py: 2,
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": {
            width: "6px",
            height: "6px"
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1"
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#bbb",
            borderRadius: 8
          }
        }}
      >
        {isLoading ? (
          <Typography>{trans("loading")}</Typography>
        ) : certificates.length === 0 ? (
          <Paper elevation={1} sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
            {transuser("nocertifications")}
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {certificates.map((cert) => (
              <Grid item xs={12} sm={6} md={4} key={cert.certificate_id}>
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
                    <IconButton onClick={() => openEditDialog(cert)}>
                      <EditIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                      onClick={() => {
                        if (cert.certificate_id) {
                          setDeletingId(cert.certificate_id);
                          setConfirmOpen(true);
                        }
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
      </Box>

      {/* Add/Edit Dialog */}
      <CommonDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setTempCert(emptyCert);
          setEditingId(null);
        }}
        onSubmit={handleSave}
        title={editingId ? transuser("editcertificate") : transuser("addcertificate")}
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
        <Typography>
          {transInc("deleteincrement", {
            certificate: certificates.find((c) => c.certificate_id === deletingId)?.name || ""
          })}
        </Typography>
      </CommonDialog>
    </Box>
  );
};

export default CertificateInput;
