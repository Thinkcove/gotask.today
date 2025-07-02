import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | GoTaskToday",
  description: "View performance, activity insights, and key metrics in one place."
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
