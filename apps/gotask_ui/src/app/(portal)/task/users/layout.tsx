import { getMessages } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessages();
  const assignees = messages.Task.Assignees;

  return {
    title: assignees.meta.title,
    description: assignees.meta.description
  };
}

export default function AssigneesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
