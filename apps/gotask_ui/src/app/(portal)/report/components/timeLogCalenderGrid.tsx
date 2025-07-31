import React, { useMemo } from "react";
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
  Typography,
  Grid
} from "@mui/material";
import { format, eachDayOfInterval, parseISO } from "date-fns";
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
import { getLogIndicatorColor, getStatusColor } from "@/app/common/constants/task";
import useSWR from "swr";
import { fetchAllLeaves } from "../../project/services/projectAction";
import { getLeaveColor, getPermissionColor } from "@/app/common/constants/leave";
import DateFormats from "@/app/component/dateTime/dateFormat";
import {
  datesOverlap,
  extractDateFromTimeLog,
  formatPermissionDuration,
  normalizeDate
} from "@/app/common/utils/leaveCalculate";
import { fetchAllPermissions } from "../services/reportService";
import { getDailyLogCellStyle } from "./logStyle";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoSearchResultsImage from "../../../../../public/assets/placeholderImages/nofilterdata.svg";
import { TimeSpentStatus } from "../../workPlanned/components/timeSpentStatus";
import { hourStatusItems } from "@/app/common/constants/actualTime";

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

  // FIXED: Memoize date range calculation
  const dateRange = useMemo(
    () => eachDayOfInterval({ start: parseISO(fromDate), end: parseISO(toDate) }),
    [fromDate, toDate]
  );

  const { data: leaveResponse } = useSWR("leave", fetchAllLeaves);
  const { data: permissionResponse } = useSWR("permission", fetchAllPermissions);

  // FIXED: Memoize leaves and permissions data processing
  const leaves: LeaveEntry[] = useMemo(() => {
    if (leaveData && leaveData.length > 0) {
      return leaveData;
    } else if (leaveResponse) {
      return leaveResponse.data || leaveResponse;
    }
    return [];
  }, [leaveData, leaveResponse]);

  const permissions: PermissionEntry[] = useMemo(() => {
    if (permissionData && permissionData.length > 0) {
      return permissionData;
    } else if (permissionResponse) {
      return permissionResponse.data || permissionResponse;
    }
    return [];
  }, [permissionData, permissionResponse]);

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

  // FIXED: Memoize filtered data
  const filteredData = useMemo(() => {
    return data.filter((entry) => {
      const projectMatches =
        selectedProjects.length === 0 ||
        (entry.project_id && selectedProjects.includes(entry.project_id));
      const userMatches =
        selectedUsers.length === 0 || (entry.user_id && selectedUsers.includes(entry.user_id));
      return projectMatches && userMatches;
    });
  }, [data, selectedProjects, selectedUsers]);

  // FIXED: Memoize users with valid projects calculation
  const usersWithValidProjects = useMemo(() => {
    if (selectedProjects.length === 0) {
      // If no projects selected, return all users from filtered data
      const validUserIds = filteredData
        .filter((task) => task.user_id) // Filter out entries without user_id
        .map((task) => task.user_id!); // Use non-null assertion since we filtered above
      return [...new Set(validUserIds)];
    }
    // Get users who have tasks in the selected projects within date range
    const usersWithProjects = filteredData
      .filter(
        (task) => task.project_id && selectedProjects.includes(task.project_id) && task.user_id
      )
      .map((task) => task.user_id!); // Use non-null assertion
    return [...new Set(usersWithProjects)];
  }, [filteredData, selectedProjects]);

  // FIXED: Memoize user selection check function
  const checkIfUserIsSelected = useMemo(() => {
    return (userId: string): boolean => {
      // First check if user has tasks in selected projects (or no project filter)
      const hasValidProjects = usersWithValidProjects.includes(userId);

      // If no projects are selected, only apply user filter
      if (selectedProjects.length === 0) {
        return selectedUsers.length === 0 || selectedUsers.includes(userId);
      }

      // If projects are selected, user must have tasks in those projects
      if (!hasValidProjects) {
        return false;
      }

      // Then apply user filter if specified
      if (selectedUsers.length === 0) {
        return true;
      }

      return selectedUsers.includes(userId);
    };
  }, [usersWithValidProjects, selectedProjects, selectedUsers]);

  // FIXED: Memoize filtered leaves and permissions
  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) => {
      const userMatches = checkIfUserIsSelected(leave.user_id);
      const dateMatches = datesOverlap(leave.from_date, leave.to_date, fromDate, toDate);
      return userMatches && dateMatches;
    });
  }, [leaves, checkIfUserIsSelected, fromDate, toDate]);

  const filteredPermissions = useMemo(() => {
    return permissions.filter((permission) => {
      const userMatches = checkIfUserIsSelected(permission.user_id);
      const dateMatches = datesOverlap(permission.date, permission.date, fromDate, toDate);
      return userMatches && dateMatches;
    });
  }, [permissions, checkIfUserIsSelected, fromDate, toDate]);

  // FIXED: Memoize the main data processing
  const { groupedByUser, totalTimePerUser } = useMemo(() => {
    const grouped = filteredData.reduce((acc: GroupedLogs, entry: TimeLogEntry) => {
      const user = entry.user_name;
      const project = entry.project_name || transreport("noproject");
      const task = entry.task_title || transreport("notask");

      // Only entries that passed the filter get grouped
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

      // Find matching task from FILTERED data (not original data)
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

    // FIXED: Add users with leaves/permissions only if they pass selection criteria
    [...filteredLeaves, ...filteredPermissions].forEach((item) => {
      const userName = item.user_name;
      const userId = item.user_id;

      // Only add the user if they pass the project selection criteria
      if (checkIfUserIsSelected(userId) && !groupedByUser[userName]) {
        groupedByUser[userName] = {};
      }
    });

    // Calculate total time per user
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

    return { grouped, groupedByUser, totalTimePerUser };
  }, [filteredData, filteredLeaves, filteredPermissions, checkIfUserIsSelected, transreport]);

  // FIXED: Memoize single project name
  const singleProjectName = useMemo(() => {
    return selectedProjects.length === 1
      ? data.find((d) => d.project_id === selectedProjects[0])?.project_name ||
          transreport("noproject")
      : null;
  }, [selectedProjects, data, transreport]);

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
            sx={{
              fontSize: "0.8rem",
              fontWeight: 500,
              color: getPermissionColor()
            }}
          >
            {formatPermissionDuration(permissionForDate.start_time, permissionForDate.end_time)}
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

  const hasData =
    filteredData.length > 0 || filteredLeaves.length > 0 || filteredPermissions.length > 0;

  if (!hasData) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Grid item xs={12}>
          <EmptyState imageSrc={NoSearchResultsImage} message={transreport("nodata")} />
        </Grid>
      </Box>
    );
  }
  return (
    <>
      {singleProjectName && (
        <div style={{ padding: "10px", fontWeight: "bold", fontSize: "1.1rem" }}>
          {transreport("showproject")}: {singleProjectName}
        </div>
      )}
      <TimeSpentStatus items={hourStatusItems} />
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: { xs: "calc(68vh - 300px)", md: "calc(100vh - 150px)" },
          overflowY: "auto",
          overflowX: "auto"
        }}
      >
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
                          {leaveForDate || permissionForDate ? (
                            renderCellContent(value, leaveForDate, permissionForDate)
                          ) : value ? (
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              sx={{ height: "100%" }}
                            >
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  backgroundColor: getLogIndicatorColor(value),
                                  marginRight: "4px"
                                }}
                              />
                              <Typography
                                variant="caption"
                                sx={{
                                  fontSize: "0.75rem",
                                  color: "#000000",
                                  lineHeight: 1,
                                  minWidth: "24px",
                                  textAlign: "left"
                                }}
                              >
                                {value}h
                              </Typography>
                            </Box>
                          ) : (
                            ""
                          )}
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
