import { Metadata } from "next";
import ChatbotClientPage from "../chatbot/chatbotClientPage";

// Static Metadata for Chatbot
export const metadata: Metadata = {
  title: "AI Chatbot Assistant | GoTaskToday",
  description: "Use the GoTask AI-powered chatbot for help, support, and automation."
};

export default function ChatbotPage() {
  return <ChatbotClientPage />;
}
