import type { Metadata } from "next";
import { getMessages } from "next-intl/server";
import ViewAction from "./client";

type Props = {
  params: Promise<{ orgId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orgId } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const messages = await getMessages();

  const t = (key: string) => messages.Organization?.meta?.[key] ?? key;

  try {
    const res = await fetch(`${baseUrl}/getOrgById/${orgId}?metaOnly=true`, {
      cache: "no-store"
    });

    if (!res.ok) {
      return {
        title: `${t("notFoundTitle")} | GoTaskToday`,
        description: t("notFoundDescription")
      };
    }

    const { data: org } = await res.json();

    return {
      title: `${org.name} | ${t("title")}`,
      description: `${t("descriptionPrefix")} ${org.name} ${t("descriptionSuffix")}`
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
