"use client";

import React from "react";
import { AssetList } from "./components/assetList";

const AssetsClientPage = () => {
  return (
    <div>
      <AssetList initialView="assets" />
    </div>
  );
};

export default AssetsClientPage;
