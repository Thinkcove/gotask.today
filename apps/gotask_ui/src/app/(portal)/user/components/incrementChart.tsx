"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  Tooltip
} from "recharts";
import { Box } from "@mui/material";
import { LPA_SUFFIX } from "@/app/common/constants/user";
import { useTranslations } from "next-intl";

interface IncrementChartProps {
  chartData: {
    name: string;
    ctc: number;
    percent: number | null;
  }[];
}

const IncrementChart: React.FC<IncrementChartProps> = ({ chartData }) => {
  const trans = useTranslations("User.Increment");
  if (!chartData || chartData.length <= 1) return null;

  return (
    <Box px={2} pb={2}>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis
            fontSize={12}
            tickFormatter={(value) => `₹${value}`}
            label={{
              value: trans("ctc"),
              angle: -90,
              position: "insideLeft",
              fontSize: 12,
              dy: 60
            }}
          />
          <Tooltip
            formatter={(value: number) => `₹${value} ${LPA_SUFFIX}`}
            labelFormatter={(label) => `${label}`}
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
              formatter={(value: number) => `₹${value} ${LPA_SUFFIX}`}
              style={{ fontSize: 12 }}
            />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default IncrementChart;
