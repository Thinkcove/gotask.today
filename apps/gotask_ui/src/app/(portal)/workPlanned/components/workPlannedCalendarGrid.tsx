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
  Typography
} from "@mui/material";
import { WorkPlannedEntry } from "../interface/workPlanned";
import StatusIndicator from "@/app/component/status/statusIndicator";
import { getStatusColor } from "@/app/common/constants/task";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import DateFormats from "@/app/component/dateTime/dateFormat";


interface WorkPlannedGridProps {
  data: WorkPlannedEntry[];
  fromDate: string;
  toDate: string;
  selectedProjects: string[];
}

// Group tasks by user
interface GroupedTasks {
  [userKey: string]: {
    userName: string;
    tasks: WorkPlannedEntry[];
    totalEstimation: number;
  };
}

const WorkPlannedCalendarGrid: React.FC<WorkPlannedGridProps> = ({
  data,
  fromDate,
  toDate,
}) => {
  

  const formatEstimation = (estimation: string | number | null | undefined) => {
    if (!estimation || estimation === null || estimation === undefined || estimation === "") {
      return "-";
    }
    return estimation.toString();
  };

  // Helper function to extract numeric value from estimation
  const getEstimationValue = (estimation: string | number | null | undefined): number => {
    if (!estimation || estimation === null || estimation === undefined || estimation === "") {
      return 0;
    }
    const numericValue = parseFloat(estimation.toString().replace(/[^\d.]/g, ''));
    return isNaN(numericValue) ? 0 : numericValue;
  };

  // Group data by user
  const groupedData: GroupedTasks = data.reduce((acc, entry) => {
    const userKey = entry.user_id || 'unknown';
    const userName = entry.user_name || "Unknown User";
    
    if (!acc[userKey]) {
      acc[userKey] = {
        userName,
        tasks: [],
        totalEstimation: 0
      };
    }
    
    acc[userKey].tasks.push(entry);
    acc[userKey].totalEstimation += getEstimationValue(entry.user_estimated);
    
    return acc;
  }, {} as GroupedTasks);

  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          No work planned data found for the selected date range
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Date range: <FormattedDateTime date={fromDate || new Date()} /> to <FormattedDateTime date={toDate || new Date()} />
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ maxHeight: 640 }}>
        <Table stickyHeader size="small" sx={{ minWidth: 650 }}>
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
                User
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
                Total Estimation
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
                Task
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
                Start Date
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
                End Date
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
                Estimation
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(groupedData).map(([userKey, userGroup]) => {
              const { userName, tasks, totalEstimation } = userGroup;
              
              return tasks.map((task, taskIndex) => (
                <TableRow 
                  key={`${userKey}-${taskIndex}`}
                >
                  {/* User Name - Only show for first task of each user */}
                  {taskIndex === 0 && (
                    <TableCell 
                      rowSpan={tasks.length}
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
                  
                  {/* Total Estimation - Only show for first task of each user */}
                  {taskIndex === 0 && (
                    <TableCell 
                      rowSpan={tasks.length}
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
                  
                
                  
                  {/* Task */}
                  <TableCell sx={{ 
                    padding: "12px", 
                    textAlign: "left", 
                    border: "1px solid #eee",
                    maxWidth: 250
                  }}>
                    <Box display="flex" flexDirection="column" gap={0.5}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          textTransform:"capitalize",
                          whiteSpace: "nowrap"
                        }}
                        title={task.task_title || "No task title"}
                      >
                        {task.task_title || "No task title"}
                      </Typography>
                      <StatusIndicator status={task.status} getColor={getStatusColor} />
                    </Box>
                         </TableCell>
                  
                  {/* Start Date */}
                  <TableCell sx={{
                    padding: "12px",
                    textAlign: "center",
                    border: "1px solid #eee",
                    fontFamily: "monospace",
                    fontSize: "0.875rem"
                  }}>
                   <FormattedDateTime date={task.start_date || new Date()} format={DateFormats.DATE_ONLY} />
                  </TableCell>
                  
                  {/* End Date */}
                  <TableCell sx={{
                    padding: "12px",
                    textAlign: "center",
                    border: "1px solid #eee",
                    fontFamily: "monospace",
                    fontSize: "0.875rem"
                  }}>
                      <FormattedDateTime date={task.end_date || new Date()} format={DateFormats.DATE_ONLY}  />
                  </TableCell>
                  
                  {/* Task Estimation */}
                  <TableCell sx={{ 
                    padding: "12px", 
                    textAlign: "center", 
                    border: "1px solid #eee",
                    background: "linear-gradient(#D6C4E4 100%)",
                    fontWeight: "bold",
                    color: "#000000"
                  }}>
                    {formatEstimation(task.user_estimated)}
                  </TableCell>
                </TableRow>
              ));
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default WorkPlannedCalendarGrid;