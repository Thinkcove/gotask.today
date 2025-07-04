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
import {
  fetchAllLeaves,

} from "../../project/services/projectAction";
import { calculatePermissionDuration, fetchAllPermissions, formatPermissionTime, getLeaveTypeColor, getPermissionColor, LeaveBackgroundColor, PERMISSION_BACKGROUND_COLOR, PermissionEntry } from "@/app/common/constants/leave";

interface WorkPlannedGridPropsWithPermissions extends WorkPlannedGridProps {
  permissionData?: PermissionEntry[];
}

const WorkPlannedCalendarGrid: React.FC<WorkPlannedGridPropsWithPermissions> = ({
  data,
  fromDate,
  toDate,
  leaveData,
  permissionData
}) => {
  const transworkplanned = useTranslations(LOCALIZATION.TRANSITION.WORKPLANNED);

  const { data: leaveResponse } = useSWR("leave", fetchAllLeaves);
  const leaves: LeaveEntry[] = leaveData && leaveData.length > 0 ? leaveData : leaveResponse || [];

  const { data: permissionResponse } = useSWR("permission", fetchAllPermissions);
  const permissions: PermissionEntry[] =
    permissionData && permissionData.length > 0 ? permissionData : permissionResponse || [];

  const MS_IN_A_DAY = 1000 * 60 * 60 * 24;

  const formatEstimation = (estimation: string | number | null | undefined) => {
    if (!estimation || estimation === null || estimation === undefined || estimation === "") {
      return "-";
    }
    return formatTimeValue(estimation.toString());
  };

  const getEstimationValue = (estimation: string | number | null | undefined): number => {
    if (!estimation || estimation === null || estimation === undefined || estimation === "") {
      return 0;
    }
    const numericValue = parseFloat(estimation.toString().replace(ESTIMATION_FORMAT, ""));
    return isNaN(numericValue) ? 0 : numericValue;
  };

  const normalizeDate = (dateString: string): Date => {
    const date = new Date(dateString);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const datesOverlap = (
    firstStart: string,
    firstEnd: string,
    secondStart: string,
    secondEnd: string
  ): boolean => {
    try {
      const firstStartDate = new Date(firstStart);
      const firstEndDate = new Date(firstEnd);
      const secondStartDate = new Date(secondStart);
      const secondEndDate = new Date(secondEnd);

      if (
        isNaN(firstStartDate.getTime()) ||
        isNaN(firstEndDate.getTime()) ||
        isNaN(secondStartDate.getTime()) ||
        isNaN(secondEndDate.getTime())
      ) {
        return false;
      }

      return firstStartDate <= secondEndDate && secondStartDate <= firstEndDate;
    } catch (error) {
      console.error("Error in date overlap check:", error);
      return false;
    }
  };

  const isTaskInDateRange = (task: WorkPlannedEntry): boolean => {
    if (!task.start_date || !task.end_date) {
      return true;
    }
    return datesOverlap(task.start_date, task.end_date, fromDate, toDate);
  };

  const getUserLeavesInRange = (userId: string): LeaveEntry[] => {
    return leaves.filter(
      (leave) =>
        leave.user_id === userId &&
        leave.from_date &&
        leave.to_date &&
        datesOverlap(leave.from_date, leave.to_date, fromDate, toDate)
    );
  };

  const getUserPermissionsInRange = (userId: string): PermissionEntry[] => {
    return permissions.filter(
      (permission) =>
        permission.user_id === userId &&
        permission.date &&
        datesOverlap(permission.date, permission.date, fromDate, toDate)
    );
  };

  const filteredData = data.filter(isTaskInDateRange);

  interface GroupedTasksWithPermissions {
    [userKey: string]: {
      userName: string;
      tasks: WorkPlannedEntry[];
      totalEstimation: number;
      leaves: LeaveEntry[];
      permissions: PermissionEntry[];
    };
  }

  const groupedData: GroupedTasksWithPermissions = filteredData.reduce((acc, entry) => {
    const userKey = entry.user_id || "unknown";
    const userName = entry.user_name || "Unknown User";

    if (!acc[userKey]) {
      acc[userKey] = {
        userName,
        tasks: [],
        totalEstimation: 0,
        leaves: getUserLeavesInRange(userKey),
        permissions: getUserPermissionsInRange(userKey)
      };
    }

    acc[userKey].tasks.push(entry);
    acc[userKey].totalEstimation += getEstimationValue(entry.user_estimated);

    return acc;
  }, {} as GroupedTasksWithPermissions);

  // Add users who only have leaves or permissions but no tasks
  [...leaves, ...permissions].forEach((item) => {
    const userKey = item.user_id;
    const isInRange =
      "from_date" in item
        ? datesOverlap(item.from_date, item.to_date, fromDate, toDate)
        : datesOverlap(item.date, item.date, fromDate, toDate);

    if (isInRange && !groupedData[userKey]) {
      groupedData[userKey] = {
        userName: item.user_name,
        tasks: [],
        totalEstimation: 0,
        leaves: getUserLeavesInRange(userKey),
        permissions: getUserPermissionsInRange(userKey)
      };
    }
  });

  const hasFilteredTasks = filteredData.length > 0;
  const leavesInRange = leaves.filter(
    (leave) =>
      leave.from_date &&
      leave.to_date &&
      datesOverlap(leave.from_date, leave.to_date, fromDate, toDate)
  );
  const permissionsInRange = permissions.filter(
    (permission) =>
      permission.date && datesOverlap(permission.date, permission.date, fromDate, toDate)
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
                  minWidth: 150,
                  position: "sticky",
                  verticalAlign: "middle",
                  top: 0,
                  zIndex: 2
                }}
              >
                {transworkplanned("leaveinfo")}
              </TableCell>
              {/* New Permission column */}
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
                Permission Info
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
              const { userName, tasks, totalEstimation, permissions: userPermissions } = userGroup;
              const totalRows = Math.max(tasks.length, 1);
              const userLeaves = getUserLeavesInRange(userKey);

              return Array.from({ length: totalRows }, (_, index) => {
                const task = tasks[index];
                const isFirstRow = index === 0;

                return (
                  <TableRow key={`${userKey}-${index}`}>
                    {/* User Name */}
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

                    {/* Total Estimation */}
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

                    {/* Leave Information */}
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
                                    backgroundColor:
                                      getLeaveTypeColor(leave.leave_type) +
                                      LeaveBackgroundColor.num,
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

                    {/* Permission Information - New Column */}
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
                        {userPermissions.length > 0 ? (
                          <Box display="flex" flexDirection="column" gap={1}>
                            {userPermissions.map((permission, permissionIndex) => {
                              const duration = calculatePermissionDuration(
                                permission.start_time,
                                permission.end_time
                              );

                              return (
                                <Box
                                  key={permission.id || permissionIndex}
                                  sx={{
                                    p: 1,
                                    backgroundColor:
                                      getPermissionColor() + PERMISSION_BACKGROUND_COLOR.num,
                                    borderRadius: "8px",
                                    border: `1px solid ${getPermissionColor()}40`
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontWeight: 600,
                                      fontSize: "0.7rem",
                                      textTransform: "uppercase",
                                      color: getPermissionColor(),
                                      mb: 0.5
                                    }}
                                  >
                                    PERMISSION
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
                                      date={permission.date}
                                      format={DateFormats.DATE_ONLY}
                                    />
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontSize: "0.65rem",
                                      display: "block",
                                      mb: 0.5,
                                      color: "#666"
                                    }}
                                  >
                                    {formatPermissionTime(
                                      permission.start_time,
                                      permission.end_time
                                    )}
                                  </Typography>
                                  <Chip
                                    label={`${duration}h`}
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
                              );
                            })}
                          </Box>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    )}

                    {/* Task */}
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
