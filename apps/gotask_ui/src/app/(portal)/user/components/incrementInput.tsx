"use client";

import React, { useState, useMemo } from "react";
import useSWR from "swr";
import { Box, Typography, TextField, Button, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList
} from "recharts";
import CommonDialog from "@/app/component/dialog/commonDialog";
import CustomTable, { Column } from "@/app/component/table/table";
import { IIncrementHistory } from "../interfaces/userInterface";
import { useTranslations } from "next-intl";
import { getUserIncrements, addUserIncrement, updateUserIncrement } from "../services/userAction";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import DateFormats from "@/app/component/dateTime/dateFormat";
import moment from "moment";
import { calculateIncrementPercent } from "@/app/common/constants/user";
import formatCTC from "@/app/common/utils/formatCtc";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import PercentIcon from "@mui/icons-material/Percent";

interface IncrementInputProps {
  userId: string;
}

const IncrementInput: React.FC<IncrementInputProps> = ({ userId }) => {
  const trans = useTranslations("User.Increment");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<IIncrementHistory>({
    increment_id: "",
    date: "",
    ctc: 0
  });
  const [dateError, setDateError] = useState(false);
  const [ctcError, setCtcError] = useState(false);

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
    setFormData({ increment_id: "", date: "", ctc: 0 });
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

  const reversed = [...sorted].reverse();

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

  const columns: Column<IIncrementHistory & { percent?: string }>[] = [
    {
      id: "date",
      label: trans("date"),
      align: "left",
      render: (value) =>
        value ? <FormattedDateTime date={value as string} format={DateFormats.DATE_ONLY} /> : "-"
    },
    {
      id: "ctc",
      label: trans("ctc"),
      align: "left",
      render: (value) => formatCTC(value as number)
    },
    {
      id: "percent",
      label: trans("change"),
      align: "left",
      render: (value) =>
        value !== undefined ? (
          <Typography color="green" display="flex" alignItems="center" gap={0.5}>
            <ArrowUpwardIcon fontSize="small" />
            {value}
            <PercentIcon fontSize="small" />
          </Typography>
        ) : (
          "-"
        )
    }
  ];

  const rows = [...sorted].reverse().map((inc, idx, arr) => {
    const prev = arr[idx + 1];
    const percent = prev ? calculateIncrementPercent(inc.ctc, prev.ctc)?.toFixed(2) : undefined;
    return { ...inc, percent };
  });

  return (
    <Box mt={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} px={2}>
        <Typography fontWeight={600} fontSize={16}>
          {trans("salaryrevisionlog")}
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={handleAddClick}
          sx={{ textTransform: "none", fontSize: 13 }}
        >
          {trans("addnew")}
        </Button>
      </Box>

      {/* Chart and Table */}
      <Box
        sx={{
          maxHeight: 400,
          overflow: "auto",
          border: "1px solid #ddd",
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
        {chartData.length > 1 && (
          <Box px={2} pb={2}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis
                  fontSize={12}
                  tickFormatter={(value) => `₹${value}`}
                  label={{
                    value: "CTC (Lakh)",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 12,
                    dy: 60
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ctc"
                  stroke="#1976d2"
                  strokeWidth={2.2}
                  dot={{ r: 4, strokeWidth: 2, stroke: "#1976d2", fill: "#fff" }}
                >
                  <LabelList
                    dataKey="ctc"
                    position="top"
                    formatter={(value: number) => `₹${value} L`}
                    style={{ fontSize: 12 }}
                  />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}

        <Box px={2}>
          <CustomTable columns={columns} rows={rows} />
        </Box>
      </Box>

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
