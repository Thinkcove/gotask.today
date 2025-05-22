import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { format, eachDayOfInterval, parseISO, isValid } from "date-fns";
import { GroupedLogs, TaskLog, TimeLogEntry, TimeLogGridProps } from "../interface/timeLog";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { extractHours } from "@/app/common/utils/common";

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

const TimeLogCalendarGrid: React.FC<TimeLogGridProps> = ({
  data,
  fromDate,
  toDate,
  showTasks,
  selectedProjects = []
}) => {
  const transreport = useTranslations(LOCALIZATION.TRANSITION.REPORT);
  const dateRange = getDateRange(fromDate, toDate);
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

    groupedByUser[user][project].push({
      task,
      dailyLogs: days
    });
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
        <Table stickyHeader size="small" sx={{ minWidth: 1000 }}>
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
              let userRowRendered = false;

              return projectEntries.flatMap(([project, tasks]) =>
                tasks.map((taskEntry, taskIdx) => (
                  <TableRow key={`${user}-${project}-${taskIdx}`}>
                    {!userRowRendered && (
                      <>
                        <TableCell
                          rowSpan={projectEntries.reduce((acc, [, t]) => acc + t.length, 0)}
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
                          rowSpan={projectEntries.reduce((acc, [, t]) => acc + t.length, 0)}
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
                        {taskEntry.task}
                      </TableCell>
                    )}
                    {dateRange.map((date) => {
                      const key = format(date, "yyyy-MM-dd");
                      const value = taskEntry.dailyLogs[key];
                      return (
                        <TableCell
                          key={key}
                          sx={{
                            padding: "10px",
                            textAlign: "center" as const,
                            border: "1px solid #eee"
                          }}
                        >
                          {value ? `${value}h` : ""}
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
