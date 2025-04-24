// components/StatusChart.tsx
import React from "react";
import { Box, Typography, Card, Stack, Divider } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

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
  const pieChartData = statuses.map((status) => ({
    name: status.label,
    value: statusCounts[status.label.toLowerCase().replace(/\s/g, "-")] || 0,
    color: status.color
  }));

  const total = pieChartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card
      sx={{
        width: "100%",
        boxShadow: 3,
        borderRadius: 3,
        bgcolor: "#fff",
        p: 2
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: "#741B92",
          textAlign: "center",
          mb: 2
        }}
      >
        {title}
      </Typography>

      <Box sx={{ height: 220, width: "100%", position: "relative" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              innerRadius="55%"
              labelLine={false}
              stroke="none"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center"
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#2A1237" }}>
            {total}
          </Typography>
          <Typography variant="caption" sx={{ color: "#777" }}>
            {chartTitle}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={2}>
        {pieChartData.map((entry, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderRadius: 2,
              backgroundColor: `${entry.color}1A`, // subtle tint of the status color
              border: `1px solid ${entry.color}`,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: `${entry.color}33`,
                boxShadow: `0 4px 12px ${entry.color}44`
              }
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: entry.color
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#2A1237",
                  textTransform: "capitalize"
                }}
              >
                {entry.name}
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ fontWeight: 600, color: entry.color }}>
              {entry.value}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Card>
  );
};

export default StatusChart;
