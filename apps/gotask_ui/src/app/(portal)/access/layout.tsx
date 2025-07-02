import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access Management | GoTaskToday",
  description: "Configure user access, permissions, and authorization settings."
};

export default function AccessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
