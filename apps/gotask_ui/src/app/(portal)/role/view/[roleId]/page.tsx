import type { Metadata } from "next";
import { getMessages } from "next-intl/server";
import ViewAction from "./client";

type Props = {
  params: Promise<{ roleId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { roleId } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const messages = await getMessages();

  // Localization helper
  const t = (key: string) => messages.RoleDetailPage?.[key] ?? key;

  try {
    const res = await fetch(`${baseUrl}/roles/${roleId}?metaOnly=true`, {
      cache: "no-store"
    });

    if (!res.ok) {
      return {
        title: `${t("roleNotFoundTitle")} | GoTaskToday`,
        description: t("roleNotFoundDescription")
      };
    }

    const { data: role } = await res.json();

    return {
      title: `${role.name} | ${t("title")} | GoTaskToday`,
      description: `${t("descriptionPrefix")} ${role.name} ${t("descriptionSuffix")}`
    };
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return {
      title: `${t("errorTitle")} | GoTaskToday`,
      description: t("errorDescription")
    };
  }
}

export default function Page() {
  return <ViewAction />;
}
