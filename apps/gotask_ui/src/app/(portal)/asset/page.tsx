import { Metadata } from "next";
import AssetsClientPage from "../asset/assetsClientPage";

// Static Metadata for Assets Page
export const metadata: Metadata = {
  title: "Assets Management | GoTaskToday",
  description: "View and manage all available organizational assets."
};

export default function AssetsPage() {
  return <AssetsClientPage />;
}
