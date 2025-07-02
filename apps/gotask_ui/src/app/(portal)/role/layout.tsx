import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Role Management | GoTaskToday",
  description: "Create, update, and manage roles and access control settings."
};

export default function RoleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
