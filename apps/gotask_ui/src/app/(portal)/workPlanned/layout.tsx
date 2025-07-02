import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work Planned | GoTaskToday",
  description: "Monitor planned work, milestones, and schedules."
};

export default function WorkPlannedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
