import type { Metadata } from "next";
import { getMessages } from "next-intl/server";
import ViewAction from "../[taskId]/client";

type Props = {
  params: Promise<{ taskId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { taskId } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const messages = await getMessages();

  // Localization helpers
  const t = (key: string) => messages.Task?.DetailPage?.[key] ?? key;
  const tcommon = (key: string) => messages.Common?.[key] ?? key;

  try {
    const res = await fetch(`${baseUrl}/getTaskById/${taskId}?metaOnly=true`, {
      cache: "no-store"
    });

    if (!res.ok) {
      return {
        title: `${t("taskNotFoundTitle")} | ${tcommon("appName")}`,
        description: t("taskNotFoundDescription")
      };
    }

    const { data: task } = await res.json();

    return {
      title: `${task.title} | ${t("title")} | ${tcommon("appName")}`,
      description: `${t("descriptionPrefix")} ${task.title} ${t("descriptionSuffix")}`
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
