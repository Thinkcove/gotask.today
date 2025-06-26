"use client";
import { useParams } from "next/navigation";
import ViewIssue from "./viewIssues";

const ViewIssuePage = () => {
  const { id } = useParams();
  if (!id) return null;

  return <ViewIssue id={id as string} />;
};

export default ViewIssuePage;
