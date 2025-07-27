import React from "react";
import { Box, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList
} from "recharts";
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
          fontWeight: 200,
          color: "#311B47"
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="h6"
        sx={{
          color: "#777",
          mb: 3
        }}
      >
        {transstatuschart("total")} {total} {chartTitle}
      </Typography>

      <Box sx={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="name" axisLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Bar dataKey="value" fill="#8849AE" radius={[10, 10, 0, 0]}>
              <LabelList
                dataKey="value"
                position="inside"
                formatter={(value: number) => {
                  const percent = total ? Math.round((value / total) * 100) : 0;
                  return `${value} (${percent}%)`;
                }}
                style={{ fill: "white", fontWeight: "bold", fontSize: 12 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default StatusChart;
