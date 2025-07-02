import { Metadata } from "next";
import ProjectClientPage from "../project/projectClientPage";

//  Static metadata for SEO
export const metadata: Metadata = {
  title: "Project Dashboard | GoTaskToday",
  description: "Manage company projects, track progress, and assign responsibilities."
};

export default function ProjectPage() {
  return <ProjectClientPage />;
}
