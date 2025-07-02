import { getMessages } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessages();
  const role = messages.Role;

  return {
    title: role.meta.title,
    description: role.meta.description
  };
}

export default function RoleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
