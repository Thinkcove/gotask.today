import React, { useState } from "react";
import { Box, Typography, Grid, Paper, TextField, Button } from "@mui/material";
import TaskToggle from "../../../component/toggle/toggle";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useAllAssets } from "../services/assetActions";
import Table from "../../../component/table/table"; // adjust path

export const AssetList: React.FC = () => {
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  const [selectedView, setSelectedView] = useState("Asset");

  const { getAll: allAssets } = useAllAssets();

  const formattedAssets = (allAssets || []).map((asset: any) => ({
    assetType: asset.typeId || "-",
    assetName: asset.deviceName || "-",
    modelName: asset.modelName || "-",
    purchaseDate: asset.dateOfPurchase ? new Date(asset.dateOfPurchase).toLocaleDateString() : "-",
    id: asset.id || "-"
  }));

  const assetColumns = [
    { id: "assetType", label: transasset("assets") },
    { id: "assetName", label: transasset("type") },
    { id: "modelName", label: transasset("model") },
    { id: "purchaseDate", label: transasset("purchaseDate") },
    { id: "actions", label: transasset("actions") }
  ];

  return (
    <>
      <ModuleHeader name={transasset("asset")} />
      <Box sx={{ px: 3, mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <TaskToggle
          options={[transasset("assets"), transasset("tag"), transasset("issues")]}
          selected={selectedView}
          onChange={setSelectedView}
        />
      </Box>

      <Box sx={{ px: 2, mt: 4 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={12} md={11} lg={10} xl={9}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {selectedView === transasset("assets") && (
                <Paper sx={{ p: 2, overflowX: "auto" }}>
                  <Table columns={assetColumns} rows={formattedAssets} />
                </Paper>
              )}

              {selectedView === transasset("tag")}

              {selectedView === transasset("issues")}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AssetList;
