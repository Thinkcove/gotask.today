import { Metadata } from "next";
import UploadClientPage from "../upload/uploadClientPage";

// Static Metadata for Upload module
export const metadata: Metadata = {
  title: "Document Uploads | GoTaskToday",
  description: "Upload and manage employee-related documents and files securely."
};

export default function UploadPage() {
  return <UploadClientPage />;
}
