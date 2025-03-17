import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { statuses } from "@/app/common/constants/task";
import { fetchTaskStatusCounts } from "../service/taskAction";
import useSWR from "swr";

const StatusIndicator: React.FC = () => {
  const { data } = useSWR("fetch-task-status-counts", fetchTaskStatusCounts, {
    revalidateOnFocus: false,
  });
  const statusCounts = data?.data || {};

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={2}
      p={2}
    >
      {statuses.map((status, index) => (
        <React.Fragment key={status.label}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: status.color,
              }}
            />
            <Typography variant="body2">
              {status.label}:{" "}
              {statusCounts[status.label.toLowerCase().replace(/\s/g, "-")] ||
                0}
            </Typography>
          </Box>
          {index < statuses.length - 1 && (
            <Divider
              orientation="vertical"
              flexItem
              sx={{ height: 18, mx: 1 }}
            />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default StatusIndicator;
