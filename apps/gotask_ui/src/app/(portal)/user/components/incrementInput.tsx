"use client";

import React, { useState } from "react";
import { Box, Typography, TextField, IconButton, Button, Stack } from "@mui/material";
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

import CustomTable, { Column } from "@/app/component/table/table";
import { IIncrementHistory } from "../interfaces/userInterface";
import { useTranslations } from "next-intl";
import CommonDialog from "@/app/component/dialog/commonDialog";
import { addUserIncrement, updateUserIncrement, deleteUserIncrement } from "../services/userAction";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import DateFormats from "@/app/component/dateTime/dateFormat";

interface IncrementHistoryProps {
  userId: string;
  increment_history: IIncrementHistory[];
  onChange: (updated: IIncrementHistory[]) => void;
}

const IncrementInput: React.FC<IncrementHistoryProps> = ({
  userId,
  increment_history,
  onChange
}) => {
  const transuser = useTranslations("User.Increment");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<IIncrementHistory>({ date: "", ctc: 0 });

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
      (i, idx) =>
        new Date(i.date).toISOString().split("T")[0] === formattedDate && idx !== editIndex
    );

    if (isDuplicate) {
      setErrorOpen(true);
      return;
    }

    let updated: IIncrementHistory[] = [];

    if (editIndex !== null) {
      await updateUserIncrement(userId, editIndex, formData);
      updated = [...increment_history];
      updated[editIndex] = formData;
    } else {
      await addUserIncrement(userId, formData);
      updated = [...increment_history, formData];
    }

    onChange(updated);
    resetForm();
    setDialogOpen(false);
  };

  const handleDelete = async (index: number) => {
    await deleteUserIncrement(userId, index);
    const updated = [...increment_history];
    updated.splice(index, 1);
    onChange(updated);
  };

  const sorted = [...increment_history].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
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

  // Table columns
  const columns: Column<IIncrementHistory & { percent?: string }>[] = [
    {
      id: "date",
      label: transuser("date"),
      align: "center",
      render: (value) =>
        value ? <FormattedDateTime date={value as string} format={DateFormats.DATE_ONLY} /> : "-"
    },
    {
      id: "ctc",
      label: transuser("ctc"),
      align: "center",
      render: (value) => `₹${(value as number).toLocaleString("en-IN")} L`
    },
    {
      id: "percent",
      label: transuser("change"),
      align: "center",
      render: (value) =>
        value !== undefined ? <Typography color="green">↑ {value}%</Typography> : "-"
    }
  ];

  // Combine reversed and percent for table rows
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
          {transuser("salaryrevisionlog")}
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={handleAddClick}
          sx={{ textTransform: "none", fontSize: 13 }}
        >
          {transuser("addnew")}
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
            width: "6px", // thinner width
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
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
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
                {/* Tooltip intentionally removed for mobile */}
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
        title={editIndex !== null ? transuser("edit") : transuser("addnew")}
        submitLabel={transuser("save")}
        cancelLabel={transuser("cancel")}
      >
        <Stack spacing={2}>
          <Box>
            <Typography fontSize={13} mb={0.5}>
              {transuser("date")}
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
              {transuser("ctc")}
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
        title={transuser("errortitle")}
        cancelLabel={transuser("cancel")}
      >
        <Typography>{transuser("duplicateincrementdate")}</Typography>
      </CommonDialog>
    </Box>
  );
};

export default IncrementInput;
