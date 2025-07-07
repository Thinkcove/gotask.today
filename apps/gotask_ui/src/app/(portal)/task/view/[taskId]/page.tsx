import type { Metadata } from "next";
import { getMessages } from "next-intl/server";
import ViewAction from "../[taskId]/client";
import { SWRConfig } from "swr";

type Props = {
  params: {
    task: any;
    taskId: string;
  };
};

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;

async function fetchTask(taskId: string, metaOnly = true) {
  const url = `${baseUrl}/getTaskById/${taskId}?metaOnly=${metaOnly}`;
  const res = await fetch(url, {
    cache: "no-store"
  });

  if (!res.ok) return null;

  const { data } = await res.json();
  return {
    ...data,
    url
  };
}

export async function generateMetadata({}: Props): Promise<Metadata> {
  // const messages = await getMessages();
  // const task = await fetchTask(params.taskId);
  // (params as any).task = task;

  if (!props) {
    return {
      title: "Not found",
      description: "No task found."
    };
  }
  console.log("task", props);
  return {};
  // return {
  //   title: `${props.title}`,
  //   description: `View details for ${props.title}`
  // };
}

export default async function Page({ params }: Props & { task?: any }) {
  const task = params.task;
  console.log("task", task);
  const key = task?.url ?? `${baseUrl}/getTaskById/${params.taskId}`;
  console.log("task.url", await task?.url);
  return (
    <SWRConfig value={{ fallback: { [key]: { data: task } } }}>
      <ViewAction taskId={params.taskId} swrKey={key} />
    </SWRConfig>
  );
}
