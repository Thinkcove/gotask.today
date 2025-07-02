import { Metadata } from "next";
import KPIClientPage from "../kpi/kpiClientPage";

// Static Metadata for SEO
export const metadata: Metadata = {
  title: "KPI Templates | GoTaskToday",
  description:
    "Manage Key Performance Indicator (KPI) templates for employee evaluations and goals."
};

export default function KPIPage() {
  return <KPIClientPage />;
}
