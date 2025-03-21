import React from "react";
import {
  Typography,
  Paper,
  Box,
  Divider,
  Avatar,
  Tooltip,
} from "@mui/material";
import { getStatusColor } from "@/app/common/constants/task";
import { formatDate } from "@/app/common/utils/common";
import { CalendarMonth, ReadMoreTwoTone } from "@mui/icons-material";
import { TimelineDot } from "@mui/lab";

interface TaskCardProps {
  view: "projects" | "users";
  group: any;
  onTaskClick: (task: any) => void; // Callback function
}

const TaskCard: React.FC<TaskCardProps> = ({ view, group, onTaskClick }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 3,
        transition: "0.3s",
        "&:hover": { boxShadow: "0px 4px 10px rgba(156, 32, 240, 0.6)" },
        height: 350,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">
          {view === "projects" ? group.project_name : group.user_name}
        </Typography>
        {/* View More replacing the Total Tasks Chip */}
        {group.tasks.length > 3 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                cursor: "pointer",
                color: "#741B92",
              }}
              fontWeight="bold"
              // onClick={() => onViewMore(group.id)}
            >
              View {group.tasks.length - 3} more
            </Typography>
            <ReadMoreTwoTone
              sx={{
                color: "#741B92",
              }}
            />
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 1 }}>
        {group.tasks.length > 0 ? (
          <>
            {group.tasks.slice(0, 3).map((task: any) => (
              <Box
                key={task.id}
                sx={{
                  gap: 1,
                  mb: 1,
                  backgroundColor: "white",
                  borderRadius: 2,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={() => onTaskClick(task.id)}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <TimelineDot
                    sx={{
                      border: "1px solid white",
                      backgroundColor: getStatusColor(task.status),
                      margin: 0,
                    }}
                  >
                    <CalendarMonth sx={{ height: 16, width: 16 }} />
                  </TimelineDot>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="semibold">
                      {formatDate(task.due_date)}
                    </Typography>
                  </Box>
                </Box>

                {/* Dotted Line Below Calendar Icon */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 3.5 }}>
                  <Box
                    sx={{
                      height: 40,
                      borderLeft: "2px solid grey",
                      marginLeft: "13px",
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      backgroundColor: "#F9F9F9",
                      transition:
                        "background-color 0.3s ease-in-out, border-left-color 0.3s ease-in-out",
                      "&:hover": {
                        backgroundColor: getStatusColor(task.status),
                      },
                      borderRadius: 2,
                      cursor: "pointer",
                      padding: 1,
                      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Typography variant="subtitle2">{task.title}</Typography>
                    {view === "projects" && (
                      <Tooltip title={task.user_name} arrow>
                        <Avatar sx={{ height: 24, width: 24, fontSize: 12 }}>
                          {task.user_name.charAt(0).toUpperCase()}
                        </Avatar>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </>
        ) : (
          <Typography variant="body2" color="textSecondary" align="center">
            No tasks available
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default TaskCard;
