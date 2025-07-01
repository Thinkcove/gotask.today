import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Link,
  Chip
} from "@mui/material";
import {
  GroupedTasks,
  LeaveEntry,
  WorkPlannedEntry,
  WorkPlannedGridProps
} from "../interface/workPlanned";
import StatusIndicator from "@/app/component/status/statusIndicator";
import { getStatusColor } from "@/app/common/constants/task";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import DateFormats from "@/app/component/dateTime/dateFormat";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { ESTIMATION_FORMAT } from "@/app/common/constants/regex";
import { formatTimeValue } from "@/app/common/utils/taskTime";
import useSWR from "swr";
import { fetchAllLeaves } from "../../project/services/projectAction";
import { getLeaveTypeColor } from "@/app/common/constants/leave";

const WorkPlannedCalendarGrid: React.FC<WorkPlannedGridProps> = ({
  data,
  fromDate,
  toDate,
  leaveData
}) => {
  const transworkplanned = useTranslations(LOCALIZATION.TRANSITION.WORKPLANNED);

  // Use passed leave data
  const { data: leaveResponse } = useSWR("leave", fetchAllLeaves);
  const leaves: LeaveEntry[] = leaveData && leaveData.length > 0 ? leaveData : leaveResponse || [];

  const MS_IN_A_DAY = 1000 * 60 * 60 * 24;

  const formatEstimation = (estimation: string | number | null | undefined) => {
    if (!estimation || estimation === null || estimation === undefined || estimation === "") {
      return "-";
    }

    // Use the formatTimeValue function from taskTime.ts
    return formatTimeValue(estimation.toString());
  };

  // Helper function to extract numeric value from estimation
  const getEstimationValue = (estimation: string | number | null | undefined): number => {
    if (!estimation || estimation === null || estimation === undefined || estimation === "") {
      return 0;
    }
    const numericValue = parseFloat(estimation.toString().replace(ESTIMATION_FORMAT, ""));
    return isNaN(numericValue) ? 0 : numericValue;
  };

  // Fixed date normalization function
  const normalizeDate = (dateString: string): Date => {
    const date = new Date(dateString);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  // Improved date overlap function with proper date normalization
  const datesOverlap = (
    firstLeaveStart: string,
    firstLeaveEnd: string,
    secondLeaveStart: string,
    secondLeaveEnd: string
  ): boolean => {
    try {
      const firstLeaveStartDate = new Date(firstLeaveStart);
      const firstLeaveEndDate = new Date(firstLeaveEnd);
      const secondLeaveStartDate = new Date(secondLeaveStart);
      const secondLeaveEndDate = new Date(secondLeaveEnd);

      // Check if all dates are valid
      if (
        isNaN(firstLeaveStartDate.getTime()) ||
        isNaN(firstLeaveEndDate.getTime()) ||
        isNaN(secondLeaveStartDate.getTime()) ||
        isNaN(secondLeaveEndDate.getTime())
      ) {
        return false;
      }

      return firstLeaveStartDate <= secondLeaveEndDate && secondLeaveStartDate <= firstLeaveEndDate;
    } catch (error) {
      console.error("Error in date overlap check:", error);
      return false;
    }
  };

  // Helper function to check if a task falls within the date range
  const isTaskInDateRange = (task: WorkPlannedEntry): boolean => {
    if (!task.start_date || !task.end_date) {
      // If task has no dates, include it (you might want to change this logic)
      return true;
    }

    return datesOverlap(task.start_date, task.end_date, fromDate, toDate);
  };

  // Helper function to get leaves for a user within the date range
  const getUserLeavesInRange = (userId: string): LeaveEntry[] => {
    return leaves.filter(
      (leave) =>
        leave.user_id === userId &&
        leave.from_date &&
        leave.to_date &&
        datesOverlap(leave.from_date, leave.to_date, fromDate, toDate)
    );
  };

  // Filter data by date range BEFORE grouping
  const filteredData = data.filter(isTaskInDateRange);

  // Group filtered data by user
  const groupedData: GroupedTasks = filteredData.reduce((acc, entry) => {
    const userKey = entry.user_id || "unknown";
    const userName = entry.user_name || "Unknown User";

    if (!acc[userKey]) {
      acc[userKey] = {
        userName,
        tasks: [],
        totalEstimation: 0,
        leaves: getUserLeavesInRange(userKey)
      };
    }

    acc[userKey].tasks.push(entry);
    acc[userKey].totalEstimation += getEstimationValue(entry.user_estimated);

    return acc;
  }, {} as GroupedTasks);

  // Add users who only have leaves but no tasks (within date range)
  leaves.forEach((leave) => {
    if (
      leave.from_date &&
      leave.to_date &&
      datesOverlap(leave.from_date, leave.to_date, fromDate, toDate)
    ) {
      const userKey = leave.user_id;
      if (!groupedData[userKey]) {
        groupedData[userKey] = {
          userName: leave.user_name,
          tasks: [],
          totalEstimation: 0,
          leaves: getUserLeavesInRange(userKey)
        };
      }
    }
  });

  // Check if there's any data to display
  const hasFilteredTasks = filteredData.length > 0;
  const leavesInRange = leaves.filter(
    (leave) =>
      leave.from_date &&
      leave.to_date &&
      datesOverlap(leave.from_date, leave.to_date, fromDate, toDate)
  );
  const hasLeavesInRange = leavesInRange.length > 0;

  if (!hasFilteredTasks && !hasLeavesInRange) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="textSecondary">
          {transworkplanned("nodata")}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          {transworkplanned("date")}
          <FormattedDateTime date={fromDate} /> {transworkplanned("to")}{" "}
          <FormattedDateTime date={toDate} />
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ maxHeight: 640 }}>
        <Table stickyHeader size="small" sx={{ minWidth: 750 }}>
          <TableHead>
            <TableRow>
              <TableCell
                rowSpan={2}
                sx={{
                  padding: "12px",
                  textAlign: "center",
                  backgroundColor: "#f5f5f5",
                  minWidth: 120,
                  position: "sticky",
                  verticalAlign: "middle",
                  top: 0,
                  zIndex: 2
                }}
              >
                {transworkplanned("user")}
              </TableCell>
              <TableCell
                rowSpan={2}
                sx={{
                  padding: "12px",
                  textAlign: "center",
                  background: "linear-gradient(#D6C4E4 100%)",
                  color: "#333",
                  fontWeight: "bold",
                  minWidth: 120,
                  position: "sticky",
                  verticalAlign: "middle",
                  top: 0,
                  zIndex: 2
                }}
              >
                {transworkplanned("testimation")}
              </TableCell>
              <TableCell
                rowSpan={2}
                sx={{
                  padding: "12px",
                  textAlign: "center",
                  backgroundColor: "#f5f5f5",
                  minWidth: 150,
                  position: "sticky",
                  verticalAlign: "middle",
                  top: 0,
                  zIndex: 2
                }}
              >
                {transworkplanned("leaveinfo")}
              </TableCell>
              <TableCell
                rowSpan={2}
                sx={{
                  padding: "12px",
                  textAlign: "center",
                  backgroundColor: "#f5f5f5",
                  minWidth: 250,
                  position: "sticky",
                  verticalAlign: "middle",
                  top: 0,
                  zIndex: 2
                }}
              >
                {transworkplanned("task")}
              </TableCell>
              <TableCell
                rowSpan={2}
                sx={{
                  padding: "12px",
                  textAlign: "center",
                  backgroundColor: "#f5f5f5",
                  minWidth: 90,
                  position: "sticky",
                  verticalAlign: "middle",
                  top: 0,
                  zIndex: 2
                }}
              >
                {transworkplanned("startdate")}
              </TableCell>
              <TableCell
                rowSpan={2}
                sx={{
                  padding: "12px",
                  textAlign: "center",
                  backgroundColor: "#f5f5f5",
                  minWidth: 90,
                  position: "sticky",
                  verticalAlign: "middle",
                  top: 0,
                  zIndex: 2
                }}
              >
                {transworkplanned("enddate")}
              </TableCell>
              <TableCell
                rowSpan={2}
                sx={{
                  padding: "12px",
                  textAlign: "center",
                  background: "linear-gradient(#D6C4E4 100%)",
                  color: "#333",
                  fontWeight: "bold",
                  minWidth: 120,
                  position: "sticky",
                  verticalAlign: "middle",
                  top: 0,
                  zIndex: 2
                }}
              >
                {transworkplanned("estimation")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(groupedData).map(([userKey, userGroup]) => {
              const { userName, tasks, totalEstimation } = userGroup;
              const totalRows = Math.max(tasks.length, 1);
              const userLeaves = getUserLeavesInRange(userKey);

              return Array.from({ length: totalRows }, (_, index) => {
                const task = tasks[index];
                const isFirstRow = index === 0;

                return (
                  <TableRow key={`${userKey}-${index}`}>
                    {/* User Name - Only show for first row of each user */}
                    {isFirstRow && (
                      <TableCell
                        rowSpan={totalRows}
                        sx={{
                          padding: "12px",
                          textAlign: "center",
                          border: "1px solid #eee",
                          fontWeight: "500",
                          verticalAlign: "middle"
                        }}
                      >
                        {userName}
                      </TableCell>
                    )}

                    {/* Total Estimation - Only show for first row of each user */}
                    {isFirstRow && (
                      <TableCell
                        rowSpan={totalRows}
                        sx={{
                          padding: "12px",
                          textAlign: "center",
                          border: "1px solid #eee",
                          background: "linear-gradient(#D6C4E4 100%)",
                          fontWeight: "bold",
                          color: "#000000",
                          verticalAlign: "middle"
                        }}
                      >
                        {totalEstimation > 0 ? `${totalEstimation}h` : "-"}
                      </TableCell>
                    )}

                    {/* Leave Information - Only show for first row of each user */}
                    {isFirstRow && (
                      <TableCell
                        rowSpan={totalRows}
                        sx={{
                          padding: "10px",
                          textAlign: "center",
                          border: "1px solid #eee",
                          verticalAlign: "middle"
                        }}
                      >
                        {userLeaves.length > 0 ? (
                          <Box display="flex" flexDirection="column" gap={1}>
                            {userLeaves.map((leave, leaveIndex) => {
                              const leaveFrom = normalizeDate(leave.from_date);
                              const leaveTo = normalizeDate(leave.to_date);
                              const days =
                                Math.ceil((leaveTo.getTime() - leaveFrom.getTime()) / MS_IN_A_DAY) +
                                1;

                              return (
                                <Box
                                  key={leave.id || leaveIndex}
                                  sx={{
                                    p: 1,
                                    backgroundColor: getLeaveTypeColor(leave.leave_type) + "20",
                                    borderRadius: "8px",
                                    border: `1px solid ${getLeaveTypeColor(leave.leave_type)}40`
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontWeight: 600,
                                      fontSize: "0.7rem",
                                      textTransform: "uppercase",
                                      color: getLeaveTypeColor(leave.leave_type),
                                      mb: 0.5
                                    }}
                                  >
                                    {leave.leave_type}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontSize: "0.7rem",
                                      display: "block",
                                      mb: 0.5
                                    }}
                                  >
                                    <FormattedDateTime
                                      date={leave.from_date}
                                      format={DateFormats.DATE_ONLY}
                                    />{" "}
                                    {transworkplanned("to")}{" "}
                                    <FormattedDateTime
                                      date={leave.to_date}
                                      format={DateFormats.DATE_ONLY}
                                    />
                                  </Typography>
                                  <Chip
                                    label={`${days} day${days > 1 ? "s" : ""}`}
                                    size="small"
                                    sx={{
                                      backgroundColor: "#B1AAAA",
                                      color: "#fff",
                                      fontSize: "0.65rem",
                                      height: 20,
                                      borderRadius: "5px"
                                    }}
                                  />
                                </Box>
                              );
                            })}
                          </Box>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    )}

                    {/* Task - Show task if exists, otherwise show empty cell */}
                    <TableCell
                      sx={{
                        padding: "12px",
                        textAlign: "left",
                        border: "1px solid #eee",
                        maxWidth: 250
                      }}
                    >
                      {task ? (
                        <Box display="flex" flexDirection="column" gap={0.5}>
                          {task.task_id ? (
                            <Link
                              href={`/task/view/${task.task_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              underline="none"
                              sx={{
                                color: "black",
                                cursor: "pointer",
                                fontWeight: 500,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                textTransform: "capitalize",
                                whiteSpace: "nowrap",
                                "&:hover": {
                                  textDecoration: "underline"
                                }
                              }}
                              title={task.task_title || transworkplanned("notask")}
                            >
                              {task.task_title || transworkplanned("notask")}
                            </Link>
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                textTransform: "capitalize",
                                whiteSpace: "nowrap"
                              }}
                              title={task.task_title || transworkplanned("notask")}
                            >
                              {task.task_title || transworkplanned("notask")}
                            </Typography>
                          )}
                          <StatusIndicator status={task.status} getColor={getStatusColor} />
                        </Box>
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    {/* Start Date */}
                    <TableCell
                      sx={{
                        padding: "12px",
                        textAlign: "center",
                        border: "1px solid #eee",
                        fontFamily: "monospace",
                        fontSize: "0.875rem"
                      }}
                    >
                      {task && task.start_date ? (
                        <FormattedDateTime date={task.start_date} format={DateFormats.DATE_ONLY} />
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    {/* End Date */}
                    <TableCell
                      sx={{
                        padding: "12px",
                        textAlign: "center",
                        border: "1px solid #eee",
                        fontFamily: "monospace",
                        fontSize: "0.875rem"
                      }}
                    >
                      {task && task.end_date ? (
                        <FormattedDateTime date={task.end_date} format={DateFormats.DATE_ONLY} />
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    {/* Task Estimation */}
                    <TableCell
                      sx={{
                        padding: "12px",
                        textAlign: "center",
                        border: "1px solid #eee",
                        background: "linear-gradient(#D6C4E4 100%)",
                        fontWeight: "bold",
                        color: "#000000"
                      }}
                    >
                      {task ? formatEstimation(task.user_estimated) : "-"}
                    </TableCell>
                  </TableRow>
                );
              });
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default WorkPlannedCalendarGrid;
