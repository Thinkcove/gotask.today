import React, { useState } from "react";
import { Box, Grid, Paper } from "@mui/material";
import TaskToggle from "../../../component/toggle/toggle";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useAllAssets } from "../services/assetActions";
import Table from "../../../component/table/table";
import ActionButton from "@/app/component/floatingButton/actionButton";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { IAssetAttributes } from "../interface/asset";
import { getAssetColumns } from "../assetConstants";
import TagCards from "../createTag/tagCard";
import { CreateTag } from "../createTag/createTags";
import AssetIssueCards from "../createIssues/issuesCard";
import CreateIssue from "../createIssues/createIssues";

export const AssetList: React.FC = () => {
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  const [selectedView, setSelectedView] = useState("Asset");
  const [modalOpen, setModalOpen] = useState(false);
  const [createIssueOpen, setCreateIssueOpen] = useState(false);
  const router = useRouter();
  const { getAll: allAssets } = useAllAssets();
  const formattedAssets = (allAssets || []).map((asset: IAssetAttributes) => ({
    id: asset.id,
    assetType: asset.assetType?.name || "-",
    assetName: asset.deviceName || "-",
    modelName: asset.modelName || "-",
    purchaseDate: asset.dateOfPurchase ? new Date(asset.dateOfPurchase).toLocaleDateString() : "-"
  }));

  const handleEdit = (row: IAssetAttributes) => {
    router.push(`/assets/editAsset/${row.id}`);
  };

  const assetColumns = getAssetColumns(transasset, handleEdit);

  const handleActionClick = () => {
    if (selectedView === transasset("assets")) {
      router.push("/assets/createAsset");
    } else if (selectedView === transasset("tag")) {
      setModalOpen(true);
    } else if (selectedView === transasset("issues")) {
      setCreateIssueOpen(true);
    }
  };

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

      {/* Updated Box with reduced padding and spacing */}
      <Box sx={{ px: 2, mt: 2 }}>
        {selectedView === transasset("assets") && (
          <Grid container spacing={1} justifyContent="center">
            <Grid item xs={12} sm={12} md={11} lg={10} xl={9}>
              <Paper sx={{ p: 2, overflowX: "auto" }}>
                <Table<IAssetAttributes> columns={assetColumns} rows={formattedAssets} />
              </Paper>
            </Grid>
          </Grid>
        )}

        {selectedView === transasset("tag") && <TagCards />}

        {selectedView === transasset("issues") && <AssetIssueCards />}
      </Box>

      {/* Floating Action Button */}
      <ActionButton
        label={
          selectedView === transasset("assets")
            ? transasset("createasset")
            : selectedView === transasset("tag")
              ? transasset("createtag")
              : transasset("createissue")
        }
        icon={<AddIcon sx={{ color: "white" }} />}
        onClick={handleActionClick}
      />

      <CreateTag open={modalOpen} onClose={() => setModalOpen(false)} />
      <CreateIssue open={createIssueOpen} onClose={() => setCreateIssueOpen(false)} />
      {/* <CreateIssue onClose={() => setCreateIssueOpen(false)} /> */}
    </>
  );
};

export default AssetList;
