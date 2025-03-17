"use client";
import React from "react";
import { useParams } from "next/navigation";
import { Box } from "@mui/material";
import CreateTask from "../component/createTask";

const TaskActionPage: React.FC = () => {
  const { taskAction } = useParams(); // Get the action from the URL

  return <Box>{taskAction === "createTask" && <CreateTask />}</Box>;
};

export default TaskActionPage;
