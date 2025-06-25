"use client";
import { useParams } from "next/navigation";
import ViewAsset from "./viewAsset";

const ViewAssetPage = () => {
  const params = useParams();
  const id = params?.id as string;

  if (!id) return null;

  return <ViewAsset id={id} />;
};

export default ViewAssetPage;
