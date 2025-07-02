import { generateDynamicMetadata } from "@/app/common/utils/metadataUtil";
import ViewAction from "./viewAction";

export async function generateMetadata(props: { params: { taskId?: string } }) {
  const taskId = props.params?.taskId;

  //  fallback for safety
  if (!taskId) {
    return {
      title: "Go Task Today",
      description: "Task not found"
    };
  }

  return await generateDynamicMetadata("task", taskId);
}

export default function Page() {
  return <ViewAction />;
}
