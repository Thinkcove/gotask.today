"use client";
import React from "react";
import { AssetList } from "../components/assetList";

const Page = () => {
  return (
    <div>
      <AssetList initialView="issues" />
    </div>
  );
};

export default Page;
