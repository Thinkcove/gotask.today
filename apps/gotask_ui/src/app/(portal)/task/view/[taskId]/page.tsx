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

  const t = (key: string) => messages.TaskDetailPage?.[key] ?? key;

  try {
    const res = await fetch(`${baseUrl}/getTaskById/${taskId}?metaOnly=true`, {
      cache: "no-store"
    });

    if (!res.ok) {
      return {
        title: `${t("taskNotFoundTitle")} | GoTaskToday`,
        description: t("taskNotFoundDescription")
      };
    }

    const { data: task } = await res.json();

    return {
      title: `${task.title} | ${t("title")} | GoTaskToday`,
      description: `${t("descriptionPrefix")} ${task.title} ${t("descriptionSuffix")}`
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
