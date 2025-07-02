import { Metadata } from "next";
import UserClientPage from "../user/userClientPage";

// Static Metadata
export const metadata: Metadata = {
  title: "User Management | GoTaskToday",
  description: "Add, update, and manage users within the organization."
};

export default function UserPage() {
  return <UserClientPage />;
}
