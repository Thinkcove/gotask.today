import { getMessages } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessages();
  const project = messages.Projects;

  return {
    title: project.meta.title,
    description: project.meta.description
  };
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
