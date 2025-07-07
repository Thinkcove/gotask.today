// app/task/[taskId]/page.tsx
"use client";

import useSWR from "swr";
import TaskViewClient from "./TaskViewClient";

export default function Page() {
  return <TaskViewClient />;
}
