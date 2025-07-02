import { getMessages } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessages();
  const issuesMeta = messages.Assets.Issues.meta;

  return {
    title: issuesMeta.title,
    description: issuesMeta.description
  };
}

export default function IssuesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
