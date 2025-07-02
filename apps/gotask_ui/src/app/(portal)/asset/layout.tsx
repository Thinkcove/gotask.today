import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assets | GoTaskToday",
  description: "Track and manage company assets efficiently."
};

export default function AssetLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
