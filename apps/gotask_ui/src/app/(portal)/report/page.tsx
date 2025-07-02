import { Metadata } from "next";
import ReportClientPage from "../report/reportClientPage";

//  Static Metadata for Report Module
export const metadata: Metadata = {
  title: "Time Log Report | GoTaskToday",
  description: "Analyze and view employee time logs across tasks and projects."
};

export default function ReportPage() {
  return <ReportClientPage />;
}
