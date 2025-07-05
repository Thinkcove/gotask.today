
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

interface IncrementInputProps {
  userId: string;
}

const IncrementInput: React.FC<IncrementInputProps> = ({ userId }) => {
  const trans = useTranslations("User.Increment");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<IIncrementHistory>({ date: "", ctc: 0 });

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
    setEditIndex(null);
  };

  const handleAddClick = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.date || formData.ctc <= 0) return;

    const formattedDate = new Date(formData.date).toISOString().split("T")[0];

    const isDuplicate = increment_history.some(
      (i: IIncrementHistory, idx: number) =>
        new Date(i.date).toISOString().split("T")[0] === formattedDate && idx !== editIndex
    );

    if (isDuplicate) {
      setErrorOpen(true);
      return;
    }

    if (editIndex !== null) {
      await updateUserIncrement(userId, editIndex, formData);
    } else {
      await addUserIncrement(userId, formData);
    }

    await mutate();
    resetForm();
    setDialogOpen(false);
  };


  const reversed = [...sorted].reverse();

  const chartData = sorted.map((item, idx, arr) => {
    const date = new Date(item.date);
    const label = date.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric"
    });

    const prev = idx > 0 ? arr[idx - 1] : null;
    const percent =
      prev && prev.ctc ? +(((item.ctc - prev.ctc) / prev.ctc) * 100).toFixed(2) : null;

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
      align: "center",
      render: (value) =>
        value ? <FormattedDateTime date={value as string} format={DateFormats.DATE_ONLY} /> : "-"
    },
    {
      id: "ctc",
      label: trans("ctc"),
      align: "center",
      render: (value) => `₹${(value as number).toLocaleString("en-IN")} L`
    },
    {
      id: "percent",
      label: trans("change"),
      align: "center",
      render: (value) =>
        value !== undefined ? <Typography color="green">↑ {value}%</Typography> : "-"
    }
  ];

  const rows = reversed.map((inc, idx) => {
    const prev = reversed[idx + 1];
    const percent =
      prev && prev.ctc ? (((inc.ctc - prev.ctc) / prev.ctc) * 100).toFixed(2) : undefined;
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
        {/* Chart */}
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

        {/* Table */}
        <Box px={2}>
          <CustomTable columns={columns} rows={rows} />
        </Box>
      </Box>

      {/* Add/Edit Dialog */}
      <CommonDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        title={editIndex !== null ? trans("edit") : trans("addnew")}
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
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, ctc: Math.max(0, +e.target.value) })}
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
