import type { Metadata } from "next";
import { getMessages } from "next-intl/server";
import ViewAction from "../[taskId]/client";
import { buildTaskUrl } from "./taskUtils";

type Props = {
  params: Promise<{ taskId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { taskId } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const messages = await getMessages();

  const t = (key: string) => messages.Task?.TaskDetailPage?.[key] ?? key;

  try {
    const url = buildTaskUrl(taskId, true);
    const res = await fetch(url, {
      cache: "no-store"
    });

    if (!res.ok) {
      return {
        title: t("taskNotFoundTitle"),
        description: t("taskNotFoundDescription")
      };
    }
    const { data: task } = await res.json();

    return {
      title: `${task.title} | ${t("title")}`,
      description: `${t("descriptionPrefix")} ${task.title} ${t("descriptionSuffix")}`
    };
  } catch (error) {
    return {
      title: t("errorTitle"),
      description: t("errorDescription")
    };
  }
}

export default async function Page({ params }: { params: { taskId: string } }) {
  const url = buildTaskUrl(params.taskId); 
  const res = await fetch(url, { cache: "no-store" });
  const json = await res.json();

  return <ViewAction fallbackTask={json?.data} taskId={params.taskId} />;
}
