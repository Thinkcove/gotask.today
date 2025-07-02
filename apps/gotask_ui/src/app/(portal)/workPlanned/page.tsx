import { Metadata } from "next";
import WorkPlannedClientPage from "../workPlanned/workPlannedClientPage";

// Static Metadata
export const metadata: Metadata = {
  title: "Work Planned Report | GoTaskToday",
  description: "Track and review planned work reports for projects and teams."
};

export default function WorkPlannedPage() {
  return <WorkPlannedClientPage />;
}
