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
  Grid
} from "@mui/material";
import {
  EnhancedWorkPlannedGridProps,
  GroupedTasks,
  LeaveEntry,
  WorkPlannedEntry
} from "../interface/workPlanned";
import StatusIndicator from "@/app/component/status/statusIndicator";
import { getStatusColor } from "@/app/common/constants/task";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import DateFormats from "@/app/component/dateTime/dateFormat";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import useSWR from "swr";
import { fetchAllLeaves } from "../../project/services/projectAction";
import { PermissionEntry } from "../../report/interface/timeLog";
import { fetchAllPermissions } from "../../report/services/reportService";
import {
  datesOverlap,
  formatEstimation,
  formatLeaveDuration,
  formatPermissionDuration,
  formatText,
  getEstimationValue,
  isSameDate,
  normalizeDate
} from "@/app/common/utils/leaveCalculate";
import { getLeaveColor } from "@/app/common/constants/leave";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoSearchResultsImage from "../../../../../public/assets/placeholderImages/nofilterdata.svg";
import { TimeSpentStatus } from "./timeSpentStatus";
import { TimeSpentIndicator } from "./timeSpentIndicator";

const WorkPlannedCalendarGrid: React.FC<EnhancedWorkPlannedGridProps> = ({
  data,
  fromDate,
  toDate,
  permissionData,
  isUserSelected = [],
  selectedProjects = []
}) => {
  const transworkplanned = useTranslations(LOCALIZATION.TRANSITION.WORKPLANNED);

  // Use passed leave data
  const { data: leaveResponse } = useSWR("leave", fetchAllLeaves);
  const { data: permissionResponse } = useSWR("permission", fetchAllPermissions);

  const leaves: LeaveEntry[] = leaveResponse || [];

  let permissions: PermissionEntry[] = [];
  if (permissionData && permissionData.length > 0) {
    permissions = permissionData;
  } else if (permissionResponse) {
    permissions = permissionResponse.data || permissionResponse;
  }

  const isDateInLeaveRange = (date: string, leave: LeaveEntry): boolean => {
    const checkDate = normalizeDate(date);
    const leaveStart = normalizeDate(leave.from_date);
    const leaveEnd = normalizeDate(leave.to_date);

    return checkDate >= leaveStart && checkDate <= leaveEnd;
  };

  const isPermissionInRange = (permissionDate: string): boolean => {
    const permDate = normalizeDate(permissionDate);
    const fromDateObj = normalizeDate(fromDate);
    const toDateObj = normalizeDate(toDate);

    return permDate >= fromDateObj && permDate <= toDateObj;
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
        permission.user_id === userId && permission.date && isPermissionInRange(permission.date)
    );
  };

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

  // Filter data by date range AND project filter BEFORE grouping
  const filteredData = data.filter((task) => {
    const isInDateRange = isTaskInDateRange(task);

    // If no projects selected, only filter by date
    if (selectedProjects.length === 0) {
      return isInDateRange;
    }

    // If projects selected, filter by both date and project
    return isInDateRange && task.project_id && selectedProjects.includes(task.project_id);
  });

  // Get users who have tasks in selected projects
  const getUsersWithSelectedProjects = (): string[] => {
    if (selectedProjects.length === 0) {
      // If no projects selected, return all users from filtered data
      return [...new Set(filteredData.map((task) => task.user_id))];
    }

    // Get users who have tasks in the selected projects within date range
    const usersWithProjects = filteredData
      .filter((task) => task.project_id && selectedProjects.includes(task.project_id))
      .map((task) => task.user_id);

    return [...new Set(usersWithProjects)];
  };

  const usersWithValidProjects = getUsersWithSelectedProjects();

  const checkIfUserIsSelected = (userId: string): boolean => {
    // First check if user has tasks in selected projects (or no project filter)
    const hasValidProjects = usersWithValidProjects.includes(userId);

    // If no projects are selected, only apply user filter
    if (selectedProjects.length === 0) {
      return isUserSelected.length === 0 || isUserSelected.includes(userId);
    }

    // If projects are selected, user must have tasks in those projects
    if (!hasValidProjects) {
      return false;
    }

    // Then apply user filter if specified
    if (isUserSelected.length === 0) {
      return true;
    }

    return isUserSelected.includes(userId);
  };

  // Group filtered data by user (only users that pass the selection criteria)
  const groupedData: GroupedTasks = filteredData.reduce((acc, entry) => {
    const userKey = entry.user_id;
    const userName = entry.user_name;

    // Only include users that pass the selection criteria
    if (!checkIfUserIsSelected(userKey)) {
      return acc;
    }

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

  // Add users who only have leaves but no tasks (within date range AND user selection AND project criteria)
  leaves.forEach((leave) => {
    if (
      leave.from_date &&
      leave.to_date &&
      datesOverlap(leave.from_date, leave.to_date, fromDate, toDate) &&
      checkIfUserIsSelected(leave.user_id)
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

  // Add users who only have permissions but no tasks (within date range AND user selection AND project criteria)
  permissions.forEach((permission) => {
    if (
      permission.date &&
      isPermissionInRange(permission.date) &&
      checkIfUserIsSelected(permission.user_id)
    ) {
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
        <Grid item xs={12}>
          <EmptyState imageSrc={NoSearchResultsImage} message={transworkplanned("nodata")} />
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* Legend for time spent indicators */}
      <TimeSpentStatus />
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}
      >
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
                {transworkplanned("actualstartdate")}
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
                  backgroundColor: "#f5f5f5",
                  minWidth: 90,
                  position: "sticky",
                  verticalAlign: "middle",
                  top: 0,
                  zIndex: 2
                }}
              >
                {transworkplanned("actualenddate")}
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
              <TableCell
                rowSpan={2}
                sx={{
                  padding: "12px",
                  textAlign: "center",
                  color: "#333",
                  fontWeight: "bold",
                  minWidth: 120,
                  position: "sticky",
                  verticalAlign: "middle",
                  top: 0,
                  zIndex: 2
                }}
              >
                {transworkplanned("actualtime")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(groupedData).map(([userKey, userGroup]) => {
              const { userName, tasks, totalEstimation } = userGroup;
              console.log("totalEstimation", totalEstimation);
              
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

              return Array.from({ length: totalRows }, (_, index: number) => {
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
                            <Box mt={1} display="flex" alignItems="center" gap={1}>
                              <Typography
                                sx={{
                                  fontWeight: 400,
                                  color: getLeaveColor()
                                }}
                              >
                                {formatText(transworkplanned("leave"))}
                              </Typography>
                              {"-"}
                              {taskLeaves.map((taskLeave, leaveIndex) => (
                                <Typography
                                  key={leaveIndex}
                                  variant="subtitle1"
                                  sx={{
                                    color: getLeaveColor()
                                  }}
                                >
                                  {formatLeaveDuration(taskLeave.from_date, taskLeave.to_date)}{" "}
                                </Typography>
                              ))}
                            </Box>
                          )}

                          {/* Display permissions for this task if they exist on the same date */}
                          {taskPermissions.length > 0 && (
                            <Box mt={1} display="flex" alignItems="center">
                              <Typography
                                sx={{
                                  fontWeight: 400,
                                  color: getLeaveColor(),
                                  textTransform: "none"
                                }}
                              >
                                {formatText(transworkplanned("permission"))}
                              </Typography>
                              {"-"}
                              {taskPermissions.map((perm, permIndex) => (
                                <Typography
                                  key={permIndex}
                                  variant="subtitle1"
                                  sx={{
                                    fontWeight: 500,
                                    color: getLeaveColor()
                                  }}
                                >
                                  {`${formatPermissionDuration(perm.start_time, perm.end_time)}`}
                                </Typography>
                              ))}
                            </Box>
                          )}
                        </Box>
                      ) : leave ? (
                        <Box display="flex" gap={1} alignItems="center">
                          <Typography
                            sx={{
                              fontWeight: 400,
                              color: getLeaveColor()
                            }}
                          >
                            {leave.leave_type ? formatText(transworkplanned("leave")) : ""}
                          </Typography>
                          {"-"}
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 500,
                              color: getLeaveColor()
                            }}
                          >
                            {formatLeaveDuration(leave.from_date, leave.to_date)}
                          </Typography>
                        </Box>
                      ) : permission ? (
                        <Box display="flex" gap={1} alignItems="center">
                          <Typography
                            sx={{
                              fontWeight: 400,
                              color: getLeaveColor(),
                              textTransform: "none"
                            }}
                          >
                            {formatText(transworkplanned("permission"))}
                          </Typography>
                          {"-"}
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 500,
                              color: getLeaveColor()
                            }}
                          >
                            {`${formatPermissionDuration(permission.start_time, permission.end_time)}`}
                          </Typography>
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
                    <TableCell
                      sx={{
                        padding: "12px",
                        textAlign: "center",
                        border: "1px solid #eee",
                        fontFamily: "monospace",
                        fontSize: "0.875rem"
                      }}
                    >
                      {task && task.actual_start_date ? (
                        <FormattedDateTime
                          date={task.actual_start_date}
                          format={DateFormats.DATE_ONLY}
                        />
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
                    <TableCell
                      sx={{
                        padding: "12px",
                        textAlign: "center",
                        border: "1px solid #eee",
                        fontFamily: "monospace",
                        fontSize: "0.875rem"
                      }}
                    >
                      {task && task.actual_end_date ? (
                        <FormattedDateTime
                          date={task.actual_end_date}
                          format={DateFormats.DATE_ONLY}
                        />
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

                    {/* Actual Time with Color Indicator */}
                    <TableCell
                      sx={{
                        padding: "12px",
                        textAlign: "center",
                        border: "1px solid #eee",
                        fontWeight: "bold"
                      }}
                    >
                      {task ? (
                        <>
                          <TimeSpentIndicator
                            spent={task.time_spent_total}
                            estimated={task.user_estimated}
                          />
                        </>
                      ) : (
                        "-"
                      )}

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
