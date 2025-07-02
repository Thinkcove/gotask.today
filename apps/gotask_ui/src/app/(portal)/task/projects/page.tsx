import { Metadata } from "next";
import TaskProjectsClientPage from "../projects/taskProjectsClientPage";

// Static Metadata
export const metadata: Metadata = {
  title: "Task Projects | GoTaskToday",
  description: "View and manage all project-related tasks in one place."
};

export default function TaskProjectsPage() {
  return <TaskProjectsClientPage />;
}
