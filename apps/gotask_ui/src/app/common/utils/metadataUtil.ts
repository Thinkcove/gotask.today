import type { Metadata } from "next";

// Step 1: Supported entities
export type EntityType = "task" | "project" | "story" | "role";

// Step 2: API endpoint mapping
const entityEndpointMap: Record<EntityType, string> = {
  task: "public/task-meta",
  project: "projects",
  story: "stories",
  role: "roles"
};

// Step 3: Dynamic metadata generator
export async function generateDynamicMetadata(entity: EntityType, id: string): Promise<Metadata> {
  const endpoint = entityEndpointMap[entity];
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}/${id}`;

  try {
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch entity");
    }

    const data = await res.json();

    // Fallback handling
    const fallbackTitle = `${entity.charAt(0).toUpperCase() + entity.slice(1)} Details`;

    return {
      title: data.title || data.name || fallbackTitle,
      description: data.description || `View details of this ${entity}.`,
      openGraph: {
        title: data.title || data.name || fallbackTitle,
        description: data.description || `View details of this ${entity}.`,
        url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/${entity}/${id}`,
        siteName: "Go Task Today",
        type: "website"
      }
    };
  } catch (err) {
    console.error(`[Meta] Failed to fetch ${entity} (${id}):`, err);
    return {
      title: "Go Task Today",
      description: "Seamless Workflow Management"
    };
  }
}
