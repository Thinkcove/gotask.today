import { getMessages } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessages();
  const chatbot = messages.Chatbot;

  return {
    title: chatbot.meta.title,
    description: chatbot.meta.description
  };
}

export default function ChatbotLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
