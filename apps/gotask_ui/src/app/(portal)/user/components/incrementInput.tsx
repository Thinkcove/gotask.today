"use client";

import React, { useState, useMemo } from "react";
import useSWR from "swr";
import { Box, Typography, TextField, Button, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CommonDialog from "@/app/component/dialog/commonDialog";
import CustomTable from "@/app/component/table/table";
import { IIncrementHistory } from "../interfaces/userInterface";
import { useTranslations } from "next-intl";
import { getUserIncrements, addUserIncrement, updateUserIncrement } from "../services/userAction";
import DateFormats from "@/app/component/dateTime/dateFormat";
import moment from "moment";
import { calculateIncrementPercent } from "@/app/common/constants/user";
import IncrementChart from "./incrementChart";
import { useIncrementColumns } from "./incrementColumn";
import Toggle from "@/app/component/toggle/toggle"; // make sure you import your Toggle component

interface IncrementInputProps {
  userId: string;
}

const IncrementInput: React.FC<IncrementInputProps> = ({ userId }) => {
  const trans = useTranslations("User.Increment");
  const columns = useIncrementColumns();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<IIncrementHistory>({
    date: "",
    ctc: 0
  });
  const [dateError, setDateError] = useState(false);
  const [ctcError, setCtcError] = useState(false);
  const [selectedView, setSelectedView] = useState<string>("Table");

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

  if (!userId || isLoading) return null;

  const resetForm = () => {
    setFormData({ date: "", ctc: 0 });
    setEditId(null);
    setDateError(false);
    setCtcError(false);
  };

  const handleAddClick = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    const isDateEmpty = !formData.date;
    const isCtcInvalid = formData.ctc <= 0;

    setDateError(isDateEmpty);
    setCtcError(isCtcInvalid);

    if (isDateEmpty || isCtcInvalid) return;

    const formattedDate = new Date(formData.date).toISOString().split("T")[0];

    const isDuplicate = increment_history.some(
      (i) =>
        new Date(i.date).toISOString().split("T")[0] === formattedDate && i.increment_id !== editId
    );

    if (isDuplicate) {
      setErrorOpen(true);
      return;
    }

    if (editId) {
      await updateUserIncrement(userId, Number(editId), formData);
    } else {
      await addUserIncrement(userId, formData);
    }

    await mutate();
    resetForm();
    setDialogOpen(false);
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
    return { ...inc, percent };
  });

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} px={2}>
        {rows.length > 0 && (
          <Box>
            <Toggle
              options={["Table", "Chart"]}
              selected={selectedView}
              onChange={setSelectedView}
            />
          </Box>
        )}
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={handleAddClick}
          sx={{ textTransform: "none", fontSize: 13 }}
        >
          {trans("addnew")}
        </Button>
      </Box>

      {/* Chart / Table View */}
      {rows.length === 0 ? (
        <Box sx={{ color: "text.secondary" }}>
          <Typography>{trans("noincrements")}</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            maxHeight: 400,
            overflow: "auto",
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
          {selectedView === "Chart" ? (
            <IncrementChart chartData={chartData} />
          ) : (
            <Box>
              <CustomTable columns={columns} rows={rows} />
            </Box>
          )}
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <CommonDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        title={editId ? trans("edit") : trans("addnew")}
        submitLabel={trans("save")}
        cancelLabel={trans("cancel")}
      >
        <Stack spacing={2}>
          <Box>
            <Typography fontSize={13} mb={0.5}>
              {trans("date")}
            </Typography>
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
            <Typography fontSize={13} mb={0.5}>
              {trans("ctc")}
            </Typography>
            <TextField
              type="number"
              fullWidth
              value={formData.ctc}
              onChange={(e) => {
                const value = Math.max(0, +e.target.value);
                setFormData({ ...formData, ctc: value });
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
    </Box>
  );
};

export default IncrementInput;
