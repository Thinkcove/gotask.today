import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Box,
  Typography
} from "@mui/material";
import { format, eachDayOfInterval, parseISO, isValid } from "date-fns";
import {
  EnhancedTimeLogGridPropsWithPermissions,
  GroupedLogs,
  LeaveEntry,
  PermissionEntry,
  TaskLog,
  TimeLogEntry
} from "../interface/timeLog";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { extractHours } from "@/app/common/utils/taskTime";
import StatusIndicator from "@/app/component/status/statusIndicator";
import { getStatusColor } from "@/app/common/constants/task";
import useSWR from "swr";
import { fetchAllLeaves } from "../../project/services/projectAction";
import { getLeaveColor, getPermissionColor } from "@/app/common/constants/leave";
import DateFormats from "@/app/component/dateTime/dateFormat";
import { ISO_DATE_REGEX } from "@/app/common/constants/regex";
import { calculatePermissionDuration } from "@/app/common/utils/leaveCalculate";
import { fetchAllPermissions } from "../services/reportService";
import { getDailyLogCellStyle } from "./logStyle";

const headerCellStyle = {
  position: "sticky" as const,
  top: 0,
  zIndex: 2,
  padding: "10px",
  textAlign: "center" as const,
  border: "1px solid #eee",
  borderBottom: "2px solid #ccc",
  backgroundColor: "#f5f5f5",
  color: "#333"
};

const TimeLogCalendarGrid: React.FC<EnhancedTimeLogGridPropsWithPermissions> = ({
  data,
  fromDate,
  toDate,
  showTasks,
  selectedProjects = [],
  leaveData,
  permissionData,
  selectedUsers = []
}) => {
  const transreport = useTranslations(LOCALIZATION.TRANSITION.REPORT);

  const getDateRange = (from: string, to: string) =>
    eachDayOfInterval({ start: parseISO(from), end: parseISO(to) });

  const normalizeDate = (date: string): string => {
    if (!date) return date;

    // If already in YYYY-MM-DD format, return as-is
    if (ISO_DATE_REGEX.test(date)) {
      return date;
    }

    // If contains 'T', it's likely an ISO string with time
    if (date.includes("T")) {
      const parsed = parseISO(date);
      if (isValid(parsed)) {
        return format(parsed, DateFormats.ISO_DATE);
      }
    }

    // Fallback parse for any other format
    const parsed = parseISO(date);
    if (isValid(parsed)) {
      return format(parsed, DateFormats.ISO_DATE);
    }

    // If parsing fails, return original input
    return date;
  };

  const extractDateFromTimeLog = (entry: TimeLogEntry): string | null => {
    if (!entry?.date || typeof entry.date !== "string") {
      return null;
    }

    // Return directly if it's already in YYYY-MM-DD format
    if (ISO_DATE_REGEX.test(entry.date)) {
      return entry.date;
    }

    const parsedDate = parseISO(entry.date);
    if (isValid(parsedDate)) {
      return format(parsedDate, DateFormats.ISO_DATE);
    }

    return null;
  };

  const dateRange = getDateRange(fromDate, toDate);

  const { data: leaveResponse } = useSWR("leave", fetchAllLeaves);
  const { data: permissionResponse } = useSWR("permission", fetchAllPermissions);

  // Get leaves and permissions data
  let leaves: LeaveEntry[] = [];
  if (leaveData && leaveData.length > 0) {
    leaves = leaveData;
  } else if (leaveResponse) {
    leaves = leaveResponse.data || leaveResponse;
  }

  let permissions: PermissionEntry[] = [];
  if (permissionData && permissionData.length > 0) {
    permissions = permissionData;
  } else if (permissionResponse) {
    permissions = permissionResponse.data || permissionResponse;
  }

  const datesOverlap = (
    firstLeaveStart: string,
    firstLeaveEnd: string,
    secondLeaveStart: string,
    secondLeaveEnd: string
  ): boolean => {
    const firstStart = normalizeDate(firstLeaveStart);
    const firstEnd = normalizeDate(firstLeaveEnd);
    const secondStart = normalizeDate(secondLeaveStart);
    const secondEnd = normalizeDate(secondLeaveEnd);

    return firstStart <= secondEnd && secondStart <= firstEnd;
  };

  const isDateInLeave = (date: string, leaveFromDate: string, leaveToDate: string): boolean => {
    const checkDate = normalizeDate(date);
    const fromDate = normalizeDate(leaveFromDate);
    const toDate = normalizeDate(leaveToDate);

    return checkDate >= fromDate && checkDate <= toDate;
  };

  const isDateInPermission = (date: string, permissionDate: string): boolean => {
    const checkDate = normalizeDate(date);
    const permDate = normalizeDate(permissionDate);

    return checkDate === permDate;
  };

  const getLeaveForUserAndDate = (userId: string, date: string): LeaveEntry | null => {
    const leave = leaves.find((leave) => {
      const userMatches = leave.user_id === userId;
      const dateInRange = isDateInLeave(date, leave.from_date, leave.to_date);
      return userMatches && dateInRange;
    });

    return leave || null;
  };

  const getPermissionForUserAndDate = (userId: string, date: string): PermissionEntry | null => {
    const permission = permissions.find((permission) => {
      const userMatches = permission.user_id === userId;
      const dateMatches = isDateInPermission(date, permission.date);
      return userMatches && dateMatches;
    });

    return permission || null;
  };

  const getUserId = (userName: string): string => {
    const fromLeaves = leaves.find((l) => l.user_name === userName)?.user_id;
    if (fromLeaves) return fromLeaves;

    const fromPermissions = permissions.find((p) => p.user_name === userName)?.user_id;
    if (fromPermissions) return fromPermissions;

    const fromTimeLogs = data.find((d) => d.user_name === userName)?.user_id;
    return fromTimeLogs || "";
  };

  const filteredData = data.filter((entry) => {
    const projectMatches =
      selectedProjects.length === 0 ||
      (entry.project_id && selectedProjects.includes(entry.project_id));
    const userMatches =
      selectedUsers.length === 0 || (entry.user_id && selectedUsers.includes(entry.user_id));
    return projectMatches && userMatches;
  });

  const grouped = filteredData.reduce((acc: GroupedLogs, entry: TimeLogEntry) => {
    const user = entry.user_name;
    const project = entry.project_name || transreport("noproject");
    const task = entry.task_title || transreport("notask");

    const date = extractDateFromTimeLog(entry);
    if (!date) {
      return acc;
    }

    const timeLogged = extractHours(entry.total_time_logged || []);
    const key = [user, project, task].join("|");

    if (!acc[key]) acc[key] = {};

    if (!acc[key][date]) {
      acc[key][date] = 0;
    }
    acc[key][date] += timeLogged;

    return acc;
  }, {});

  const groupedByUser: Record<string, Record<string, TaskLog[]>> = {};

  Object.entries(grouped).forEach(([key, days]) => {
    const [user, project, task] = key.split("|");

    if (!groupedByUser[user]) groupedByUser[user] = {};
    if (!groupedByUser[user][project]) groupedByUser[user][project] = [];

    const matchedTask = filteredData.find(
      (d) =>
        d.user_name === user &&
        (d.project_name || transreport("noproject")) === project &&
        (d.task_title || transreport("notask")) === task
    );

    const taskId = matchedTask?.task_id || "";
    const status = matchedTask?.status || "";

    groupedByUser[user][project].push({
      task,
      taskId,
      status,
      dailyLogs: days
    });
  });

  // FIXED: Filter leaves and permissions by selected users and date range
  const filteredLeaves = leaves.filter((leave) => {
    const userMatches = selectedUsers.length === 0 || selectedUsers.includes(leave.user_id);
    const dateMatches = datesOverlap(leave.from_date, leave.to_date, fromDate, toDate);
    return userMatches && dateMatches;
  });

  const filteredPermissions = permissions.filter((permission) => {
    const userMatches = selectedUsers.length === 0 || selectedUsers.includes(permission.user_id);
    const dateMatches = datesOverlap(permission.date, permission.date, fromDate, toDate);
    return userMatches && dateMatches;
  });

  [...filteredLeaves, ...filteredPermissions].forEach((item) => {
    const userName = item.user_name;

    if (!groupedByUser[userName]) {
      groupedByUser[userName] = {};
    }
  });

  const totalTimePerUser: Record<string, number> = {};
  Object.entries(groupedByUser).forEach(([user, projects]) => {
    totalTimePerUser[user] = 0;
    Object.values(projects).forEach((tasks) => {
      tasks.forEach((task) => {
        (Object.values(task.dailyLogs) as number[]).forEach((hours) => {
          totalTimePerUser[user] += hours;
        });
      });
    });
  });

  const singleProjectName =
    selectedProjects.length === 1
      ? data.find((d) => d.project_id === selectedProjects[0])?.project_name ||
        transreport("noproject")
      : null;

  const renderCellContent = (
    value: number | undefined,
    leaveForDate: LeaveEntry | null,
    permissionForDate: PermissionEntry | null
  ) => {
    if (leaveForDate && permissionForDate) {
      // Both leave and permission on same date - display only leave
      return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 500,
              color: getLeaveColor()
            }}
          >
            {leaveForDate.leave_type ? transreport("leave") : ""}
          </Typography>
          {value && (
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "#333"
              }}
            >
              {value}h
            </Typography>
          )}
        </Box>
      );
    } else if (leaveForDate) {
      // Only leave
      return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 500,
              color: getLeaveColor()
            }}
          >
            {leaveForDate.leave_type ? transreport("leave") : ""}
          </Typography>
          {value && (
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "#333"
              }}
            >
              {value}h
            </Typography>
          )}
        </Box>
      );
    } else if (permissionForDate) {
      // Only permission
      return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
          <Typography
            variant="caption"
            sx={{
              color: getPermissionColor(),
              fontWeight: 500
            }}
          >
            {transreport("permission")}
          </Typography>
          <Typography
            // variant="subtitle1"
            sx={{
              fontSize: "0.8rem",
              fontWeight: 500,
              color: getPermissionColor()
            }}
          >
            {`${calculatePermissionDuration(permissionForDate.start_time, permissionForDate.end_time)} ${
              calculatePermissionDuration(
                permissionForDate.start_time,
                permissionForDate.end_time
              ) === 1
                ? "hour"
                : "hours"
            }`}
          </Typography>
          {value && (
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "#333"
              }}
            >
              {value}h
            </Typography>
          )}
        </Box>
      );
    } else {
      // Only time log
      return value ? `${value}h` : "";
    }
  };

  return (
    <>
      {singleProjectName && (
        <div style={{ padding: "10px", fontWeight: "bold", fontSize: "1.1rem" }}>
          {transreport("showproject")}: {singleProjectName}
        </div>
      )}

      <TableContainer component={Paper} sx={{ maxHeight: 640 }}>
        <Table stickyHeader size="small" sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell rowSpan={2} sx={{ ...headerCellStyle, top: 0 }}>
                {transreport("userlist")}
              </TableCell>
              <TableCell
                rowSpan={2}
                sx={{
                  ...headerCellStyle,
                  top: 0,
                  background: "linear-gradient( #D6C4E4 100%)"
                }}
              >
                {transreport("totalworklog")}
              </TableCell>

              {selectedProjects.length > 0 && (
                <TableCell rowSpan={2} sx={{ ...headerCellStyle, top: 0 }}>
                  {transreport("showproject")}
                </TableCell>
              )}
              {showTasks && (
                <TableCell rowSpan={2} sx={{ ...headerCellStyle, top: 0 }}>
                  {transreport("showtasks")}
                </TableCell>
              )}
              {Object.entries(
                dateRange.reduce(
                  (acc, date) => {
                    const key = format(date, "MMMM yyyy");
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(date);
                    return acc;
                  },
                  {} as Record<string, Date[]>
                )
              ).map(([monthYear, dates]) => (
                <TableCell
                  key={monthYear}
                  colSpan={dates.length}
                  align="center"
                  sx={{
                    ...headerCellStyle,
                    zIndex: 3,
                    backgroundColor: "#e0e0e0"
                  }}
                >
                  {monthYear}
                </TableCell>
              ))}
            </TableRow>

            <TableRow>
              {dateRange.map((date) => (
                <TableCell
                  key={date.toISOString()}
                  sx={{
                    ...headerCellStyle,
                    top: 47,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    backgroundColor: "#f9f9f9",
                    zIndex: 2
                  }}
                >
                  {format(date, "dd EEE")}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {Object.entries(groupedByUser).map(([user, projects]) => {
              const projectEntries = Object.entries(projects);
              const totalRowsForUser = Math.max(
                projectEntries.reduce((acc, [, t]) => acc + t.length, 0),
                1
              );

              const userId = getUserId(user);
              let userRowRendered = false;

              if (projectEntries.length === 0) {
                // User has no tasks but has leaves or permissions
                return (
                  <TableRow key={`${user}-no-tasks`}>
                    <TableCell
                      sx={{
                        verticalAlign: "center",
                        padding: "10px",
                        textAlign: "left" as const,
                        border: "1px solid #eee"
                      }}
                    >
                      {user}
                    </TableCell>
                    <TableCell
                      sx={{
                        verticalAlign: "center",
                        padding: "10px",
                        textAlign: "center" as const,
                        border: "1px solid #eee",
                        fontWeight: 600,
                        background: "linear-gradient( #D6C4E4 100%)"
                      }}
                    >
                      {totalTimePerUser[user] || 0}h
                    </TableCell>

                    {selectedProjects.length > 0 && (
                      <TableCell
                        sx={{
                          padding: "10px",
                          textAlign: "center" as const,
                          border: "1px solid #eee"
                        }}
                      >
                        -
                      </TableCell>
                    )}
                    {showTasks && (
                      <TableCell
                        sx={{
                          padding: "10px",
                          textAlign: "center" as const,
                          border: "1px solid #eee"
                        }}
                      >
                        -
                      </TableCell>
                    )}
                    {dateRange.map((date) => {
                      const key = format(date, DateFormats.ISO_DATE);
                      const leaveForDate = getLeaveForUserAndDate(userId, key);
                      const permissionForDate = getPermissionForUserAndDate(userId, key);

                      return (
                        <TableCell
                          key={key}
                          sx={{
                            padding: "10px",
                            textAlign: "center" as const,
                            border: "1px solid #eee"
                          }}
                        >
                          {renderCellContent(undefined, leaveForDate, permissionForDate)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              }

              return projectEntries.flatMap(([project, tasks]) =>
                tasks.map((taskEntry, taskIdx) => (
                  <TableRow key={`${user}-${project}-${taskIdx}`}>
                    {!userRowRendered && (
                      <>
                        <TableCell
                          rowSpan={totalRowsForUser}
                          sx={{
                            verticalAlign: "center",
                            padding: "10px",
                            textAlign: "left" as const,
                            border: "1px solid #eee"
                          }}
                        >
                          {user}
                        </TableCell>
                        <TableCell
                          rowSpan={totalRowsForUser}
                          sx={{
                            verticalAlign: "center",
                            padding: "10px",
                            textAlign: "center" as const,
                            border: "1px solid #eee",
                            fontWeight: 600,
                            background: "linear-gradient( #D6C4E4 100%)"
                          }}
                        >
                          {totalTimePerUser[user]}h
                        </TableCell>
                      </>
                    )}
                    {selectedProjects.length > 0 && taskIdx === 0 && (
                      <TableCell
                        rowSpan={tasks.length}
                        sx={{
                          padding: "10px",
                          textAlign: "center" as const,
                          border: "1px solid #eee"
                        }}
                      >
                        {project}
                      </TableCell>
                    )}
                    {showTasks && (
                      <TableCell
                        sx={{
                          padding: "10px",
                          textAlign: "left",
                          border: "1px solid #eee"
                        }}
                      >
                        <Box display="flex" flexDirection="column" gap={0.5}>
                          {taskEntry.taskId ? (
                            <Link
                              href={`/task/view/${taskEntry.taskId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              underline="none"
                              sx={{
                                color: "black",
                                cursor: "pointer",
                                fontWeight: 500,
                                "&:hover": {
                                  textDecoration: "underline"
                                }
                              }}
                            >
                              {taskEntry.task}
                            </Link>
                          ) : (
                            <Typography fontWeight={500}>{taskEntry.task}</Typography>
                          )}

                          <StatusIndicator status={taskEntry.status} getColor={getStatusColor} />
                        </Box>
                      </TableCell>
                    )}

                    {dateRange.map((date) => {
                      const key = format(date, DateFormats.ISO_DATE);
                      const value = taskEntry.dailyLogs[key];
                      const leaveForDate = getLeaveForUserAndDate(userId, key);
                      const permissionForDate = getPermissionForUserAndDate(userId, key);

                      return (
                        <TableCell
                          key={key}
                          sx={{
                            padding: "10px",
                            textAlign: "center",
                            border: "1px solid #eee",
                            ...getDailyLogCellStyle(value)
                          }}
                        >
                          {renderCellContent(value, leaveForDate, permissionForDate)}
                        </TableCell>
                      );
                    })}

                    {(userRowRendered = true)}
                  </TableRow>
                ))
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TimeLogCalendarGrid;
