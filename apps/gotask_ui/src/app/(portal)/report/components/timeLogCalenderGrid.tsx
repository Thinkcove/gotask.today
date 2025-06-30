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
  EnhancedTimeLogGridProps,
  GroupedLogs,
  LeaveEntry,
  TaskLog,
  TimeLogEntry,
  TimeLogGridProps
} from "../interface/timeLog";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { extractHours } from "@/app/common/utils/taskTime";
import StatusIndicator from "@/app/component/status/statusIndicator";
import { getStatusColor } from "@/app/common/constants/task";
import useSWR from "swr";
import { fetchAllLeaves } from "../../project/services/projectAction";
import { getLeaveTypeColor } from "@/app/common/constants/leave";
import DateFormats from "@/app/component/dateTime/dateFormat";

// Add LeaveEntry interface

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

const getDateRange = (from: string, to: string) =>
  eachDayOfInterval({ start: parseISO(from), end: parseISO(to) });

const TimeLogCalendarGrid: React.FC<EnhancedTimeLogGridProps> = ({
  data,
  fromDate,
  toDate,
  showTasks,
  selectedProjects = [],
  leaveData
}) => {
  const transreport = useTranslations(LOCALIZATION.TRANSITION.REPORT);
  const dateRange = getDateRange(fromDate, toDate);

  // Use passed leave data or fetch from API
  const { data: leaveResponse } = useSWR("leave", fetchAllLeaves);
  const leaves: LeaveEntry[] = leaveData && leaveData.length > 0 ? leaveData : leaveResponse || [];

  // Helper function to check if dates overlap
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

    return firstLeaveStartDate <= secondLeaveEndDate && secondLeaveStartDate <= firstLeaveEndDate;
  };

  // Helper function to check if a specific date falls within a leave period
  const isDateInLeave = (date: string, leaveFromDate: string, leaveToDate: string): boolean => {
    const checkDate = new Date(date);
    const fromDate = new Date(leaveFromDate);
    const toDate = new Date(leaveToDate);
    return checkDate >= fromDate && checkDate <= toDate;
  };

  // Helper function to get leaves for a user within the date range

  // Helper function to get leave details for a specific user and date
  const getLeaveForUserAndDate = (userId: string, date: string): LeaveEntry | null => {
    return (
      leaves.find(
        (leave) => leave.user_id === userId && isDateInLeave(date, leave.from_date, leave.to_date)
      ) || null
    );
  };

  // Get leave type color

  const grouped = data.reduce((acc: GroupedLogs, entry: TimeLogEntry) => {
    const user = entry.user_name;
    const project = entry.project_name || transreport("noproject");
    const task = entry.task_title || transreport("notask");

    const date = isValid(parseISO(entry.date)) ? format(parseISO(entry.date), "yyyy-MM-dd") : null;
    if (!date) return acc;

    const timeLogged = extractHours(entry.total_time_logged || []);
    const key = [user, project, task].join("|");

    if (!acc[key]) acc[key] = {};
    acc[key][date] = (acc[key][date] || 0) + timeLogged;

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

  // Add users who have leaves but no time logs
  leaves.forEach((leave) => {
    if (datesOverlap(leave.from_date, leave.to_date, fromDate, toDate)) {
      const userName = leave.user_name;
      if (!groupedByUser[userName]) {
        groupedByUser[userName] = {};
      }
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

              // Get user ID by matching user name with leave data
              const userId = leaves.find((l) => l.user_name === user)?.user_id || "";

              // const userLeaves = getUserLeavesInRange(userId);
              let userRowRendered = false;

              if (projectEntries.length === 0) {
                // User has no tasks but has leaves
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
                    {/* Leave Information */}

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

                      return (
                        <TableCell
                          key={key}
                          sx={{
                            padding: "10px",
                            textAlign: "center" as const,
                            border: "1px solid #eee",
                            backgroundColor: leaveForDate
                              ? getLeaveTypeColor(leaveForDate.leave_type) + "20"
                              : "transparent"
                          }}
                        >
                          {leaveForDate ? (
                            <Box
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                              gap={0.5}
                            >
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
                            </Box>
                          ) : (
                            ""
                          )}
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
                      const key = format(date, "yyyy-MM-dd");
                      const value = taskEntry.dailyLogs[key];
                      const leaveForDate = getLeaveForUserAndDate(userId, key);

                      return (
                        <TableCell
                          key={key}
                          sx={{
                            padding: "10px",
                            textAlign: "center" as const,
                            border: "1px solid #eee",
                            backgroundColor: leaveForDate
                              ? getLeaveTypeColor(leaveForDate.leave_type) + "20"
                              : "transparent"
                          }}
                        >
                          {leaveForDate ? (
                            <Box
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                              gap={0.5}
                            >
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
                          ) : value ? (
                            `${value}h`
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
