import { getMessages } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessages();
  const kpi = messages.KPI;

  return {
    title: kpi.meta.title,
    description: kpi.meta.description
  };
}

export default function KPILayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
