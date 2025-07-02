import { Metadata } from "next";

export const metadata: Metadata = {
  title: "KPI Templates | GoTaskToday",
  description: "Define, manage, and assign KPI templates to measure performance."
};

export default function KPILayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
