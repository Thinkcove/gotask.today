import { getMessages } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessages();
  const wp = messages.WorkPlanned;

  return {
    title: wp.meta.title,
    description: wp.meta.description
  };
}

export default function WorkPlannedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
