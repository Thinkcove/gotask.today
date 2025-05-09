import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

interface StatusItem {
  label: string;
  color: string;
}

interface Props {
  title: string;
  statusCounts: Record<string, number>;
  statuses: StatusItem[];
  chartTitle: string;
}

const StatusChart: React.FC<Props> = ({ title, statusCounts, statuses, chartTitle }) => {
  const transstatuschart = useTranslations(LOCALIZATION.TRANSITION.STATUSCHART);

  const total = Object.values(statusCounts).reduce((sum, value) => sum + value, 0);

  const barChartData = statuses.map((status) => ({
    name: status.label,
    value: statusCounts[status.label.toLowerCase().replace(/\s/g, "-")] || 0,
    color: status.color
  }));

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#fff",
        borderRadius: 3,
        p: 3,
        textAlign: "center",
        border: "1px solid #eee"
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          color: "#311B47",
          mb: 2
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: "#777",
          mb: 3
        }}
      >
        {transstatuschart("total")} {total} {chartTitle}
      </Typography>

      <Box sx={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="name" axisLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Bar dataKey="value" fill="#8849AE" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Stack spacing={2} mt={2}>
        {statuses.map((status, index) => {
          const value = statusCounts[status.label.toLowerCase().replace(/\s/g, "-")] || 0;
          const percent = total ? Math.round((value / total) * 100) : 0;

          return (
            <Box
              key={index}
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <Typography variant="body1" sx={{ color: "#333", fontWeight: 600 }}>
                {status.label}
              </Typography>
              <Typography variant="body1" sx={{ color: status.color, fontWeight: "bold" }}>
                {value} ({percent}%)
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default StatusChart;
