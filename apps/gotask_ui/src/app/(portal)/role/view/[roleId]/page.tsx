import type { Metadata } from "next";
import ViewAction from "./client";

type Props = {
  params: Promise<{ roleId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const { roleId } = await params;

  try {
    const res = await fetch(`${baseUrl}/roles/${roleId}?metaOnly=true`, {
      cache: "no-store"
    });

    if (!res.ok) {
      return {
        title: "Role Not Found | GoTaskToday",
        description: "This role does not exist or may have been removed."
      };
    }

    const json = await res.json();
    const role = json.data;

    return {
      title: `${role.name} | Role Details | GoTaskToday`,
      description: `View and manage access for the ${role.name} role.`
    };
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return {
      title: "Error | GoTaskToday",
      description: "Unable to fetch role details."
    };
  }
}

export default function Page() {
  return <ViewAction />;
}
