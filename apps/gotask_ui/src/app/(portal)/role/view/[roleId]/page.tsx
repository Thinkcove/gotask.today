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


  const t = (key: string) => messages.Role?.RoleDetailPage?.[key] ?? key;
  const tcommon = (key: string) => messages.Common?.[key] ?? key;

  try {
    const res = await fetch(`${baseUrl}/roles/${roleId}?metaOnly=true`, {
      cache: "no-store"
    });

    if (!res.ok) {
      return {
        title: `${t("roleNotFoundTitle")} | ${tcommon("appName")}`,
        description: t("roleNotFoundDescription")
      };
    }

    const { data: role } = await res.json();

    return {
      title: `${role.name} | ${t("title")} | ${tcommon("appName")}`,
      description: `${t("descriptionPrefix")} ${role.name} ${t("descriptionSuffix")}`
    };
  } catch {
    return {
      title: `${t("errorTitle")} | ${tcommon("appName")}`,
      description: t("errorDescription")
    };
  }
}

export default function Page() {
  return <ViewAction />;
}
