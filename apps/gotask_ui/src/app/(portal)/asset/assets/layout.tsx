import { getMessages } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessages();
  const assetMeta = messages.Assets.meta;

  return {
    title: assetMeta.title,
    description: assetMeta.description
  };
}

export default function AssetLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
