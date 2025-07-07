import { getMessages } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessages();
  const leave = messages.Leave;

  return {
    title: leave.meta.title,
    description: leave.meta.description
  };
}

export default function LeaveLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
