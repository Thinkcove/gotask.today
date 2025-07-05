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
  EnhancedWorkPlannedGridProps,
  GroupedTasks,
  LeaveEntry,
  WorkPlannedEntry,
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
import { PermissionEntry } from "../../report/interface/timeLog";
import { fetchAllPermissions } from "../../report/services/reportService";
import {  calculatePermissionDuration, formatLeaveDuration } from "@/app/common/utils/leaveCalculate";
import { getLeaveColor, getPermissionColor } from "@/app/common/constants/leave";

// Enhanced interface to include permissions

const WorkPlannedCalendarGrid: React.FC<EnhancedWorkPlannedGridProps> = ({
  data,
  fromDate,
  toDate,
  leaveData,
  permissionData
}) => {
  const transworkplanned = useTranslations(LOCALIZATION.TRANSITION.WORKPLANNED);

  // Use passed leave data
  const { data: leaveResponse } = useSWR("leave", fetchAllLeaves);
  const { data: permissionResponse } = useSWR("permission", fetchAllPermissions);

  const leaves: LeaveEntry[] = leaveData && leaveData.length > 0 ? leaveData : leaveResponse || [];

  let permissions: PermissionEntry[] = [];
  if (permissionData && permissionData.length > 0) {
    permissions = permissionData;
  } else if (permissionResponse) {
    permissions = permissionResponse.data || permissionResponse;
  }


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

  // Helper function to check if two dates are the same day
  const isSameDate = (date1: string, date2: string): boolean => {
    const d1 = normalizeDate(date1);
    const d2 = normalizeDate(date2);
    return d1.getTime() === d2.getTime();
  };

  // Helper function to check if a date falls within a leave period
  const isDateInLeaveRange = (date: string, leave: LeaveEntry): boolean => {
    const checkDate = normalizeDate(date);
    const leaveStart = normalizeDate(leave.from_date);
    const leaveEnd = normalizeDate(leave.to_date);

    return checkDate >= leaveStart && checkDate <= leaveEnd;
  };

  // Improved date overlap function with proper date normalization
  const datesOverlap = (
    firstLeaveStart: string,
    firstLeaveEnd: string,
    secondLeaveStart: string,
    secondLeaveEnd: string
  ): boolean => {
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
  };

  // Helper function to check if permission date is within range
  const isPermissionInRange = (permissionDate: string): boolean => {
    const permDate = normalizeDate(permissionDate);
    const fromDateObj = normalizeDate(fromDate);
    const toDateObj = normalizeDate(toDate);

    return permDate >= fromDateObj && permDate <= toDateObj;
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

  // Helper function to get permissions for a user within the date range
  const getUserPermissionsInRange = (userId: string): PermissionEntry[] => {
    return permissions.filter(
      (permission) =>
        permission.user_id === userId && permission.date && isPermissionInRange(permission.date)
    );
  };

  // Helper function to check if a task has permission on the same date
  const getTaskPermissionsOnSameDate = (
    task: WorkPlannedEntry,
    userPermissions: PermissionEntry[]
  ): PermissionEntry[] => {
    if (!task.start_date) return [];

    return userPermissions.filter(
      (permission) =>
        permission.date && task.start_date && isSameDate(task.start_date, permission.date)
    );
  };

  // Helper function to check if a task has leave on the same date
  const getTaskLeavesOnSameDate = (
    task: WorkPlannedEntry,
    userLeaves: LeaveEntry[]
  ): LeaveEntry[] => {
    if (!task.start_date) return [];

    return userLeaves.filter(
      (leave) =>
        leave.from_date &&
        leave.to_date &&
        task.start_date &&
        isDateInLeaveRange(task.start_date, leave)
    );
  };

  // Filter data by date range BEFORE grouping
  const filteredData = data.filter(isTaskInDateRange);

  // Group filtered data by user
  const groupedData: GroupedTasks = filteredData.reduce((acc, entry) => {
    const userKey = entry.user_id;
    const userName = entry.user_name;

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

  // Add users who only have permissions but no tasks (within date range)
  permissions.forEach((permission) => {
    if (permission.date && isPermissionInRange(permission.date)) {
      const userKey = permission.user_id;
      if (!groupedData[userKey]) {
        groupedData[userKey] = {
          userName: permission.user_name,
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
  const permissionsInRange = permissions.filter(
    (permission) => permission.date && isPermissionInRange(permission.date)
  );
  const hasLeavesInRange = leavesInRange.length > 0;
  const hasPermissionsInRange = permissionsInRange.length > 0;

  if (!hasFilteredTasks && !hasLeavesInRange && !hasPermissionsInRange) {
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
              const userLeaves = getUserLeavesInRange(userKey);
              const userPermissions = getUserPermissionsInRange(userKey);

              // Create combined rows for tasks, leaves, and permissions
              const allItems: (
                | WorkPlannedEntry
                | (LeaveEntry & { isLeave: boolean })
                | (PermissionEntry & { isPermission: boolean })
              )[] = [...tasks];

              // Get all task dates to filter out leaves and permissions that overlap with tasks
              const taskDates = tasks.map((task) => task.start_date).filter(Boolean);

              // Add standalone leaves (not overlapping with task dates)
              const standaloneLeaves = userLeaves.filter(
                (leave) =>
                  !taskDates.some(
                    (taskDate) =>
                      taskDate &&
                      leave.from_date &&
                      leave.to_date &&
                      isDateInLeaveRange(taskDate, leave)
                  )
              );

              standaloneLeaves.forEach((leave) => {
                allItems.push({
                  ...leave,
                  isLeave: true
                });
              });

              // Add standalone permissions (not on same date as tasks)
              const standalonePermissions = userPermissions.filter(
                (permission) =>
                  !taskDates.some(
                    (taskDate) =>
                      taskDate && permission.date && isSameDate(taskDate, permission.date)
                  )
              );

              standalonePermissions.forEach((permission) => {
                allItems.push({
                  ...permission,
                  isPermission: true
                });
              });

              const totalRows = Math.max(allItems.length, 1);

              return Array.from({ length: totalRows }, (_, index) => {
                const item = allItems[index];
                const isFirstRow = index === 0;
                const isLeave = item && "isLeave" in item && item.isLeave;
                const isPermission = item && "isPermission" in item && item.isPermission;
                const task = !isLeave && !isPermission ? (item as WorkPlannedEntry) : null;
                const leave = isLeave ? (item as LeaveEntry & { isLeave: boolean }) : null;
                const permission = isPermission
                  ? (item as PermissionEntry & { isPermission: boolean })
                  : null;

                // Get permissions and leaves for this task if it exists
                const taskPermissions = task
                  ? getTaskPermissionsOnSameDate(task, userPermissions)
                  : [];
                const taskLeaves = task ? getTaskLeavesOnSameDate(task, userLeaves) : [];

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

                    {/* Task/Leave/Permission Column */}
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

                          {/* Display leaves for this task if they exist on the same date */}
                          {taskLeaves.length > 0 && (
                            <Box mt={1}>
                              <Typography
                                sx={{
                                  fontWeight: 600,
                                  fontSize: "0.7rem",
                                  textTransform: "uppercase",
                                  color: getLeaveColor(),
                                  mb: 0.5
                                }}
                              >
                                {transworkplanned("leave")}
                              </Typography>
                              {taskLeaves.map((taskLeave, leaveIndex) => (
                                <Chip
                                  key={leaveIndex}
                                  label={formatLeaveDuration(
                                    taskLeave.from_date,
                                    taskLeave.to_date
                                  )}
                                  size="small"
                                  sx={{
                                    backgroundColor: getLeaveColor(),
                                    color: "#fff",
                                    fontSize: "0.65rem",
                                    height: 20,
                                    borderRadius: "5px",
                                    mr: 0.5
                                  }}
                                />
                              ))}
                            </Box>
                          )}

                          {/* Display permissions for this task if they exist on the same date */}
                          {taskPermissions.length > 0 && (
                            <Box mt={1}>
                              <Typography
                                sx={{
                                  fontWeight: 600,
                                  fontSize: "0.7rem",
                                  textTransform: "uppercase",
                                  color: getPermissionColor(),
                                  mb: 0.5
                                }}
                              >
                                {transworkplanned("permission")}
                              </Typography>
                              {taskPermissions.map((perm, permIndex) => (
                                <Chip
                                  key={permIndex}
                                  label={`${calculatePermissionDuration(perm.start_time, perm.end_time)}h`}
                                  size="small"
                                  sx={{
                                    backgroundColor: getPermissionColor(),
                                    color: "#fff",
                                    fontSize: "0.65rem",
                                    height: 20,
                                    borderRadius: "5px",
                                    mr: 0.5
                                  }}
                                />
                              ))}
                            </Box>
                          )}
                        </Box>
                      ) : leave ? (
                        <Box display="flex" flexDirection="column" gap={1}>
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.7rem",
                                textTransform: "uppercase",
                                color: getLeaveColor(),
                                mb: 0.5
                              }}
                            >
                              {leave.leave_type ? transworkplanned("leave") : ""}
                            </Typography>

                            <Chip
                              label={formatLeaveDuration(leave.from_date, leave.to_date)}
                              size="small"
                              sx={{
                                backgroundColor: getLeaveColor(),
                                color: "#fff",
                                fontSize: "0.65rem",
                                height: 20,
                                borderRadius: "5px"
                              }}
                            />
                          </Box>
                        </Box>
                      ) : permission ? (
                        <Box display="flex" flexDirection="column" gap={1}>
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.7rem",
                                textTransform: "uppercase",
                                color: getPermissionColor(),
                                mb: 0.5
                              }}
                            >
                              {transworkplanned("permission")}
                            </Typography>

                            <Chip
                              label={`${calculatePermissionDuration(permission.start_time, permission.end_time)}h`}
                              size="small"
                              sx={{
                                backgroundColor: getPermissionColor(),
                                color: "#fff",
                                fontSize: "0.65rem",
                                height: 20,
                                borderRadius: "5px"
                              }}
                            />
                          </Box>
                        </Box>
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    {/* Start Date - Show task date, leave from_date, or permission date */}
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
                      ) : leave && leave.from_date ? (
                        <FormattedDateTime date={leave.from_date} format={DateFormats.DATE_ONLY} />
                      ) : permission && permission.date ? (
                        <FormattedDateTime date={permission.date} format={DateFormats.DATE_ONLY} />
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    {/* End Date - Show task date, leave to_date, or permission date */}
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
                      ) : leave && leave.to_date ? (
                        <FormattedDateTime date={leave.to_date} format={DateFormats.DATE_ONLY} />
                      ) : permission && permission.date ? (
                        <FormattedDateTime date={permission.date} format={DateFormats.DATE_ONLY} />
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    {/* Task Estimation - Only show for tasks, not leaves or permissions */}
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
