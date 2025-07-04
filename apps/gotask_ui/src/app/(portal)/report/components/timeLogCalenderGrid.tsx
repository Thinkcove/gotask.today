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
import {
  calculatePermissionDuration,
  fetchAllPermissions,
  getLeaveTypeColor,
  getPermissionColor,
  LeaveBackgroundColor,
  PERMISSION_BACKGROUND_COLOR
} from "@/app/common/constants/leave";

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
  permissionData
}) => {
  const transreport = useTranslations(LOCALIZATION.TRANSITION.REPORT);

  const getDateRange = (from: string, to: string) =>
    eachDayOfInterval({ start: parseISO(from), end: parseISO(to) });

  const normalizeDate = (date: string): string => {
    try {
      if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return date;
      }

      if (date.includes("T")) {
        const parsedDate = parseISO(date);
        if (isValid(parsedDate)) {
          return format(parsedDate, "yyyy-MM-dd");
        }
      }

      const parsedDate = parseISO(date);
      if (isValid(parsedDate)) {
        return format(parsedDate, "yyyy-MM-dd");
      }

      console.warn("Could not normalize date:", date);
      return date;
    } catch (error) {
      console.error("Error normalizing date:", date, error);
      return date;
    }
  };

  const extractDateFromTimeLog = (entry: TimeLogEntry): string | null => {
    try {
      if (!entry.date) {
        console.warn("Entry has no date:", entry);
        return null;
      }

      if (typeof entry.date === "string" && entry.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return entry.date;
      }

      if (typeof entry.date === "string") {
        const parsedDate = parseISO(entry.date);
        if (isValid(parsedDate)) {
          return format(parsedDate, "yyyy-MM-dd");
        }
      }

      console.warn("Could not extract date from time log entry:", entry);
      return null;
    } catch (error) {
      console.error("Error extracting date from time log:", entry, error);
      return null;
    }
  };
  const dateRange = getDateRange(fromDate, toDate);
  console.log("data", data);

  console.log(
    "Date range:",
    dateRange.map((d) => format(d, "yyyy-MM-dd"))
  );

  const { data: leaveResponse } = useSWR("leave", fetchAllLeaves);
  const { data: permissionResponse } = useSWR("permission", fetchAllPermissions);

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

  const grouped = data.reduce((acc: GroupedLogs, entry: TimeLogEntry) => {
    const user = entry.user_name;
    const project = entry.project_name || transreport("noproject");
    const task = entry.task_title || transreport("notask");

    const date = extractDateFromTimeLog(entry);
    if (!date) {
      console.warn("Skipping entry with invalid date:", entry);
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

    const matchedTask = data.find(
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

  [...leaves, ...permissions].forEach((item) => {
    const userName = item.user_name;
    const isInRange =
      "from_date" in item
        ? datesOverlap(item.from_date, item.to_date, fromDate, toDate)
        : datesOverlap(item.date, item.date, fromDate, toDate);

    if (isInRange && !groupedByUser[userName]) {
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
      // Both leave and permission on same date
      return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.5rem",
              fontWeight: 500,
              color: getLeaveTypeColor(leaveForDate.leave_type)
            }}
          >
            {leaveForDate.leave_type.toUpperCase()}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.5rem",
              fontWeight: 500,
              color: "#009688"
            }}
          >
            PERMISSION
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.5rem",
              fontWeight: 500,
              color: "#009688"
            }}
          >
            {calculatePermissionDuration(permissionForDate.start_time, permissionForDate.end_time)}h
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
              fontSize: "0.6rem",
              fontWeight: 500,
              color: getLeaveTypeColor(leaveForDate.leave_type)
            }}
          >
            {leaveForDate.leave_type.toUpperCase()}
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
              fontSize: "0.6rem",
              fontWeight: 500,
              color: getPermissionColor()
            }}
          >
            PERMISSION
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.6rem",
              fontWeight: 500,
              color: getPermissionColor()
            }}
          >
            {calculatePermissionDuration(permissionForDate.start_time, permissionForDate.end_time)}h
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

  const getCellBackgroundColor = (
    leaveForDate: LeaveEntry | null,
    permissionForDate: PermissionEntry | null
  ): string => {
    if (leaveForDate && permissionForDate) {
      // Create a gradient for both leave and permission
      return `linear-gradient(135deg, ${getLeaveTypeColor(leaveForDate.leave_type)}${LeaveBackgroundColor.num} 50%, ${getPermissionColor()}${PERMISSION_BACKGROUND_COLOR.num} 50%)`;
    } else if (leaveForDate) {
      return getLeaveTypeColor(leaveForDate.leave_type) + LeaveBackgroundColor.num;
    } else if (permissionForDate) {
      return getPermissionColor() + PERMISSION_BACKGROUND_COLOR.num;
    }
    return "transparent";
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
                      const key = format(date, "yyyy-MM-dd");
                      const leaveForDate = getLeaveForUserAndDate(userId, key);
                      const permissionForDate = getPermissionForUserAndDate(userId, key);

                      return (
                        <TableCell
                          key={key}
                          sx={{
                            padding: "10px",
                            textAlign: "center" as const,
                            border: "1px solid #eee",
                            background: getCellBackgroundColor(leaveForDate, permissionForDate)
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
                      // FIXED: Ensure consistent date formatting
                      const key = format(date, "yyyy-MM-dd");
                      const value = taskEntry.dailyLogs[key];
                      const leaveForDate = getLeaveForUserAndDate(userId, key);
                      const permissionForDate = getPermissionForUserAndDate(userId, key);

                      return (
                        <TableCell
                          key={key}
                          sx={{
                            padding: "10px",
                            textAlign: "center" as const,
                            border: "1px solid #eee",
                            background: getCellBackgroundColor(leaveForDate, permissionForDate)
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
