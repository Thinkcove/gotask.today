import { getMessages } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessages();
  const upload = messages.Upload;

  return {
    title: upload.meta.title,
    description: upload.meta.description
  };
}

export default function UploadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
