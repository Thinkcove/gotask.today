"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from "recharts";
import { Box } from "@mui/material";

interface StatusItem {
  label: string;
  color: string;
}

interface Props {
  statusCounts?: Record<string, number>;
  statuses: StatusItem[];
  title: string;
  chartTitle: string;
}

const StatusChart: React.FC<Props> = ({ statusCounts = {}, statuses }) => {
  const total = Object.values(statusCounts).reduce((sum, value) => sum + value, 0);

  const barChartData = statuses.map((status) => ({
    name: status.label,
    value: statusCounts?.[status.label.toLowerCase().replace(/\s/g, "-")] ?? 0,
    fill: status.color
  }));

  return (
    <Box sx={{ height: 250 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={barChartData} barSize={35}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value">
            {barChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default StatusChart;
