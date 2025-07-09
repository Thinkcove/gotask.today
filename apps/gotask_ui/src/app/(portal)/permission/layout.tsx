import { getMessages } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessages();
  const permission = messages.Permission;

  return {
    title: permission.meta.title,
    description: permission.meta.description
  };
}

export default function PermissionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
