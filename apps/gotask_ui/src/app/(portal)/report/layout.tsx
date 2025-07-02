import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work Log | GoTaskToday",
  description: "View time logs, performance metrics, and summaries."
};

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
