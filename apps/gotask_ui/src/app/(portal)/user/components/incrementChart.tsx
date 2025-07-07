"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList
} from "recharts";
import { Box } from "@mui/material";

interface IncrementChartProps {
  chartData: {
    name: string;
    ctc: number;
    percent: number | null;
  }[];
}

const IncrementChart: React.FC<IncrementChartProps> = ({ chartData }) => {
  if (!chartData || chartData.length <= 1) return null;

  return (
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
  );
};

export default IncrementChart;
