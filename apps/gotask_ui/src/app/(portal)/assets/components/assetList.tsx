import React, { useState } from "react";
import { Box, Grid, Paper } from "@mui/material";
import TaskToggle from "../../../component/toggle/toggle";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useAllAssets } from "../services/assetActions";
import Table from "../../../component/table/table"; // adjust path
import ActionButton from "@/app/component/floatingButton/actionButton";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";

export const AssetList: React.FC = () => {
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  const [selectedView, setSelectedView] = useState("Asset");
  const router = useRouter();
  const { getAll: allAssets } = useAllAssets();

  const formattedAssets = (allAssets || []).map((asset: any) => ({
    assetType: asset.typeId || "-",
    assetName: asset.deviceName || "-",
    modelName: asset.modelName || "-",
    purchaseDate: asset.dateOfPurchase ? new Date(asset.dateOfPurchase).toLocaleDateString() : "-",
    id: asset.id || "-"
  }));

  const handleView = (id: string) => {
    console.log("View ID:", id);
    // e.g., navigate to view page
    router.push(`/assets/viewAsset/${id}`);
  };

  const handleEdit = (id: string) => {
    console.log("Edit ID:", id);
    // e.g., navigate to edit page
    router.push(`/assets/editAsset/${id}`);
  };

  const assetColumns = [
    { id: "assetType", label: transasset("assets") },
    { id: "assetName", label: transasset("type") },
    { id: "modelName", label: transasset("model") },
    { id: "purchaseDate", label: transasset("purchaseDate") },
    {
      id: "actions",
      label: transasset("actions"),
      render: (_: any, row: any) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton color="primary" size="small" onClick={() => handleView(row.id)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton color="primary" size="small" onClick={() => handleEdit(row.id)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      )
    }
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
      <ActionButton
        label={transasset("createasset")}
        icon={<AddIcon sx={{ color: "white" }} />}
        onClick={() => router.push("/assets/createAsset")}
      />
    </>
  );
};

export default AssetList;
