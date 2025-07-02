import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organization | GoTaskToday",
  description: "Manage company structure, departments, and details."
};

export default function OrganizationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
