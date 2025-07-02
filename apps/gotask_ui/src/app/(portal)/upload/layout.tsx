import { Metadata } from "next";

export const metadata: Metadata = {
  title: "File Upload | GoTaskToday",
  description: "Upload documents and assets securely."
};

export default function UploadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
