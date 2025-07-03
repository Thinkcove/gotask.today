import { getMessages } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessages();
  const accessMessages = messages.Access;

  return {
    title: accessMessages.meta.title,
    description: accessMessages.meta.description
  };
}

export default function AccessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
