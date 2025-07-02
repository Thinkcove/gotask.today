import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Assistant | GoTaskToday",
  description: "Interact with your virtual assistant to get quick answers and help."
};

export default function ChatbotLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
