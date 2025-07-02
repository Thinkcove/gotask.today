import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
 
export type EntityType = "task" | "project" | "story" | "role";
 
const entityEndpointMap: Record<EntityType, string> = {
  task: "public/task-meta",
  project: "projects",
  story: "stories",
  role: "roles"
};
 
export async function generateDynamicMetadata(entity: EntityType, id: string): Promise<Metadata> {
  const t = await getTranslations("meta");
 
  const endpoint = entityEndpointMap[entity];
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}/${id}`;
 
  try {
    const res = await fetch(url, { cache: "no-store" });
 
    if (!res.ok) throw new Error("Failed to fetch entity");
 
    const data = await res.json();
 
    const title = data.title || data.name || t(`${entity}.title`);
    const description = data.description || t(`${entity}.description`);
 
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/${entity}/${id}`,
        siteName: t("siteName"),
        type: "website"
      }
    };
  } catch (err) {
    console.error(`[Meta] Failed to fetch ${entity} (${id}):`, err);
    return {
      title: t("defaultTitle"),
      description: t("defaultDescription")
    };
  }
}