import { getMessages } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessages();
  const dashboard = messages.Dashboard;

  return {
    title: dashboard.meta.title,
    description: dashboard.meta.description
  };
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
