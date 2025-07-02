import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management | GoTaskToday",
  description: "Plan, assign, and track tasks across projects."
};

export default function TaskLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
