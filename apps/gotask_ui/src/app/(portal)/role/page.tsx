
import { Metadata } from "next";
import RoleClientPage from "../role/roleClientPage";

// Static Metadata
export const metadata: Metadata = {
  title: "Role Management | GoTaskToday",
  description: "Create, update, and manage employee roles and access levels in the organization."
};

export default function RolePage() {
  return <RoleClientPage />;
}
