import { getMessages } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessages();
  const task = messages.Task;

  return {
    title: task.meta.title,
    description: task.meta.description
  };
}

export default function TaskLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
