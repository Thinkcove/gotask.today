import { Metadata } from "next";
import AccessClientPage from "../access/accessClientPage";

//  Static metadata
export const metadata: Metadata = {
  title: "Access Control | GoTaskToday",
  description: "Manage permissions and access levels for users across modules."
};

export default function AccessPage() {
  return <AccessClientPage />;
}
