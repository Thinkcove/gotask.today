import { Metadata } from "next";
import DashboardClientPage from "../dashboard/dashboardClientPage";

// Static metadata for Dashboard
export const metadata: Metadata = {
  title: "Dashboard | GoTaskToday",
  description: "View company-wide activity, project statuses, and quick insights all in one place."
};

export default function DashboardPage() {
  return <DashboardClientPage />;
}
