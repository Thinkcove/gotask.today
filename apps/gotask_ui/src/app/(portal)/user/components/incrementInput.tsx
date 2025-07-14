"use client";

import React, { useState, useMemo } from "react";
import useSWR from "swr";
import { Box, Typography, TextField, Button, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CommonDialog from "@/app/component/dialog/commonDialog";
import CustomTable from "@/app/component/table/table";
import { IIncrementHistory } from "../interfaces/userInterface";
import { useTranslations } from "next-intl";
import { getUserIncrements, addUserIncrement, deleteUserIncrement } from "../services/userAction";
import DateFormats from "@/app/component/dateTime/dateFormat";
import moment from "moment";
import { calculateIncrementPercent } from "@/app/common/constants/user";
import IncrementChart from "./incrementChart";
import { useIncrementColumns } from "./incrementColumn";
import Toggle from "@/app/component/toggle/toggle";
import StarIcon from "@mui/icons-material/Star";

interface IncrementInputProps {
  userId: string;
}

const IncrementInput: React.FC<IncrementInputProps> = ({ userId }) => {
  const trans = useTranslations("User.Increment");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [formData, setFormData] = useState<{ date: string; ctc: string }>({
    date: "",
    ctc: ""
  });
  const [dateError, setDateError] = useState(false);
  const [ctcError, setCtcError] = useState(false);
  const [selectedView, setSelectedView] = useState<string>("Table");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const {
    data: responseData,
    mutate,
    isLoading
  } = useSWR<IIncrementHistory[]>(`/user/${userId}/increment`, () => getUserIncrements(userId));
  const increment_history = useMemo<IIncrementHistory[]>(
    () => (Array.isArray(responseData) ? responseData : []),
    [responseData]
  );
  const sorted = useMemo(
    () =>
      [...increment_history].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    [increment_history]
  );

  const resetForm = () => {
    setFormData({ date: "", ctc: "" });
    setDateError(false);
    setCtcError(false);
  };

  const handleAddClick = () => {
    resetForm();
    setDialogOpen(true);
  };

  const isFormValid = (): boolean => {
    const isDateEmpty = !formData.date;
    const ctcValue = parseFloat(formData.ctc);
    const isCtcInvalid = isNaN(ctcValue) || ctcValue <= 0;

    setDateError(isDateEmpty);
    setCtcError(isCtcInvalid);

    return !(isDateEmpty || isCtcInvalid);
  };

  const isDuplicateDate = (formattedDate: string): boolean =>
    increment_history.some((i) => new Date(i.date).toISOString().split("T")[0] === formattedDate);

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    const formattedDate = new Date(formData.date).toISOString().split("T")[0];

    if (isDuplicateDate(formattedDate)) {
      setErrorOpen(true);
      return;
    }

    const ctcValue = parseFloat(formData.ctc);
    await addUserIncrement(userId, { ...formData, ctc: ctcValue });
    await mutate();
    resetForm();
    setDialogOpen(false);
  };
  
  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteTargetId) {
      await deleteUserIncrement(userId, deleteTargetId);
      await mutate();
      setDeleteTargetId(null);
      setDeleteDialogOpen(false);
    }
  };

  const chartData = sorted.map((item, idx, arr) => {
    const label = moment(item.date)
      .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
      .format(DateFormats.MONTH_YEAR);

    const prev = idx > 0 ? arr[idx - 1] : null;
    const percent = prev ? calculateIncrementPercent(item.ctc, prev.ctc) : null;

    return {
      name: label,
      ctc: item.ctc,
      percent
    };
  });

  const rows = [...sorted].reverse().map((inc, idx, arr) => {
    const prev = arr[idx + 1];
    const percent = prev ? calculateIncrementPercent(inc.ctc, prev.ctc)?.toFixed(2) : undefined;

    return {
      ...inc,
      percent
    };
  });

  const columns = useIncrementColumns({
    onDelete: handleDeleteClick
  });

  if (!userId || isLoading) return null;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} px={2}>
        {rows.length > 0 ? (
          <Toggle options={["Table", "Chart"]} selected={selectedView} onChange={setSelectedView} />
        ) : (
          <Box />
        )}

        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={handleAddClick}
          sx={{
            textTransform: "none",
            fontSize: 13,
            whiteSpace: "nowrap",
            minWidth: "auto",
            px: 2
          }}
        >
          {trans("addnew")}
        </Button>
      </Box>

      {rows.length === 0 ? (
        <Typography color="text.secondary">{trans("noincrements")}</Typography>
      ) : (
        <Box
          sx={{
            maxHeight: 400,
            overflow: "auto",
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": { width: "6px", height: "6px" },
            "&::-webkit-scrollbar-track": { background: "#f1f1f1" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#bbb",
              borderRadius: 8
            }
          }}
        >
          {selectedView === "Chart" ? (
            <IncrementChart chartData={chartData} />
          ) : (
            <CustomTable columns={columns} rows={rows} />
          )}
        </Box>
      )}

      {/* Add Dialog */}
      <CommonDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        title={trans("addnew")}
        submitLabel={trans("save")}
        cancelLabel={trans("cancel")}
      >
        <Stack spacing={2}>
          <Box>
            <Box position="relative" display="inline-block" mb={0.5}>
              <Typography fontSize={13} fontWeight={600}>
                {trans("date")}
              </Typography>
              <StarIcon
                sx={{
                  color: "red",
                  position: "absolute",
                  top: 2,
                  right: -10,
                  fontSize: 8
                }}
              />
            </Box>
            <TextField
              type="date"
              fullWidth
              value={formData.date}
              onChange={(e) => {
                setFormData({ ...formData, date: e.target.value });
                if (dateError) setDateError(false);
              }}
              error={dateError}
              helperText={dateError ? trans("dateisrequired") : ""}
            />
          </Box>
          <Box>
            <Box position="relative" display="inline-block" mb={0.5}>
              <Typography fontSize={13} fontWeight={600}>
                {trans("ctc")}
              </Typography>
              <StarIcon
                sx={{
                  color: "red",
                  position: "absolute",
                  top: 2,
                  right: -10,
                  fontSize: 8
                }}
              />
            </Box>
            <TextField
              type="number"
              fullWidth
              value={formData.ctc || ""}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 0) {
                  setFormData({ ...formData, ctc: e.target.value });
                }
                if (ctcError) setCtcError(false);
              }}
              error={ctcError}
              helperText={ctcError ? trans("ctcisrequired") : ""}
            />
          </Box>
        </Stack>
      </CommonDialog>

      {/* Duplicate Error Dialog */}
      <CommonDialog
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        onSubmit={() => setErrorOpen(false)}
        title={trans("errortitle")}
        cancelLabel={trans("cancel")}
      >
        <Typography>{trans("duplicateincrementdate")}</Typography>
      </CommonDialog>

      {/* Delete Confirmation Dialog */}
      <CommonDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onSubmit={confirmDelete}
        title={trans("confirmdelete")}
        submitLabel={trans("delete")}
        cancelLabel={trans("cancel")}
        submitColor="#b71c1c"
      >
        <Typography>{trans("deleteconfirmtext")}</Typography>
      </CommonDialog>
    </Box>
  );
};

export default IncrementInput;
