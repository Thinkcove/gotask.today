import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Management | GoTaskToday",
  description: "Manage projects, assign teams, and track progress efficiently."
};

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
