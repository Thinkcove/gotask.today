import { getMessages } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessages();
  const asset = messages.Assets;

  return {
    title: asset.meta.title,
    description: asset.meta.description
  };
}

export default function AssetLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
