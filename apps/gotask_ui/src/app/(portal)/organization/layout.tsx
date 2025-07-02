import { getMessages } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessages();
  const org = messages.Organization;

  return {
    title: org.meta.title,
    description: org.meta.description
  };
}

export default function OrganizationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
