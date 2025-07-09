export const buildTaskUrl = (taskId: string, metaOnly = false) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const query = metaOnly ? "?metaOnly=true" : "";
  return `${baseUrl}/getTaskById/${taskId}${query}`;
};
