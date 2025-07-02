import { Metadata } from "next";
import OrganizationClientPage from "../organization/organizationClientPage";

// Static metadata for SEO
export const metadata: Metadata = {
  title: "Organization | GoTaskToday",
  description: "View and manage the organization’s departments and reporting hierarchy."
};

export default function OrganizationPage() {
  return <OrganizationClientPage />;
}
