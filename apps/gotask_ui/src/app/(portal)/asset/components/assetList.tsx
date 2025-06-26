import React, { useMemo, useState } from "react";
import { Box, Grid, Paper } from "@mui/material";
import Toggle from "../../../component/toggle/toggle";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useAllAssets } from "../services/assetActions";
import Table from "../../../component/table/table";
import ActionButton from "@/app/component/floatingButton/actionButton";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { IAssetAttributes } from "../interface/asset";
import { getAssetColumns, IAssetDisplayRow, issueStatuses } from "../assetConstants";
import AssetIssueCards from "../createIssues/issuesCard";
import CreateIssue from "../createIssues/createIssues";
import SearchBar from "@/app/component/searchBar/searchBar";
import AssetFilters from "./assetFilter";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoAssetsImage from "@assets/placeholderImages/notask.svg";

interface AssetListProps {
  initialView?: "assets" | "issues";
}

export const AssetList: React.FC<AssetListProps> = ({ initialView = "assets" }) => {
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  const [view, setView] = useState<"assets" | "issues">(initialView);
  const [assignedToFilter, setAssignedToFilter] = useState<string[]>([]);
  const [modelNameFilter, setModelNameFilter] = useState<string[]>([]);

  const [createIssueOpen, setCreateIssueOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const router = useRouter();
  const { getAll: allAssets } = useAllAssets();
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const handleEdit = (row: IAssetDisplayRow) => {
    const originalAsset = allAssets.find((a: IAssetAttributes) => a.id === row.id);
    if (originalAsset) {
      router.push(`/asset/edit/${originalAsset.id}`);
    }
  };

  const handleView = (row: IAssetDisplayRow) => {
    router.push(`/asset/view/${row.id}`);
  };

  const labels = {
    assets: transasset("assets"),
    issues: transasset("issues")
  };

  // options for toggle
  const toggleOptions = [labels.assets, labels.issues];

  const handleToggleChange = (selectedLabel: string) => {
    const nextView = labelToKey[selectedLabel];
    if (nextView !== view) {
      setView(nextView);
      router.push(`/asset/${nextView}`);
    }
  };

  // map translated label back to key
  const labelToKey = {
    [labels.assets]: "assets",
    [labels.issues]: "issues"
  } as const;

  const assetColumns = getAssetColumns(transasset, handleEdit, handleView);

  const handleActionClick = () => {
    if (initialView === transasset("selectedAsset")) {
      router.push("/asset/createAsset");
    } else if (initialView === transasset("selectedIssues")) {
      setCreateIssueOpen(true);
    }
  };

  const modelNames: string[] = useMemo(
    () =>
      Array.from(
        new Set(
          allAssets
            .map((a: IAssetAttributes) => a.modelName)
            .filter((m: string): m is string => !!m)
        )
      ),
    [allAssets]
  );

  const assignedUserNames: string[] = useMemo(
    () =>
      Array.from(
        new Set(
          allAssets.flatMap(
            (a: IAssetAttributes) =>
              a.tagData?.map((tag) => tag.user?.name).filter((n): n is string => !!n) ?? []
          )
        )
      ),
    [allAssets]
  );

  const filterAssets = (
    assets: IAssetAttributes[],
    searchText: string,
    assignedToFilter: string[],
    modelNameFilter: string[]
  ) => {
    const lowerSearch = searchText.toLowerCase();

    return assets.filter((asset) => {
      const matchBasic =
        searchText.trim() === "" ||
        [
          asset.deviceName,
          asset.serialNumber,
          asset.modelName,
          asset.os,
          asset.processor,
          asset.seller,
          asset.antivirus,
          asset.recoveryKey,
          asset.assetType?.name
        ]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(lowerSearch)) ||
        asset.tagData?.some(
          (tag) =>
            tag.user?.name?.toLowerCase().includes(lowerSearch) ||
            tag.actionType?.toLowerCase().includes(lowerSearch)
        );

      const matchAssigned =
        assignedToFilter.length === 0 ||
        asset.tagData?.some((tag) => assignedToFilter.includes(tag.user?.name || ""));

      const matchModel =
        modelNameFilter.length === 0 ||
        modelNameFilter.some((val) => val.toLowerCase() === (asset.modelName || "").toLowerCase());

      return matchBasic && matchAssigned && matchModel;
    });
  };

  const filteredAssets = filterAssets(allAssets, searchText, assignedToFilter, modelNameFilter);
  const mappedAssets = filteredAssets.map((asset) => ({
    id: asset.id,
    assetType: asset.assetType?.name || "-",
    assetName: asset.deviceName || "-",
    modelName: asset.modelName || "-",
    warrantyDate: asset.warrantyDate ? new Date(asset.warrantyDate).toLocaleDateString() : "-",
    purchaseDate: asset.dateOfPurchase ? new Date(asset.dateOfPurchase).toLocaleDateString() : "-",
    users:
      asset.tagData
        ?.map((t) => t.user?.name)
        .filter(Boolean)
        .join(", ") || "-",
    encrypted: asset.isEncrypted
  }));

  return (
    <>
      <ModuleHeader name={"assets"} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          gap: 1,
          px: 2,
          mt: 2,
          flexWrap: "nowrap"
        }}
      >
        <Box
          sx={{
            flex: "1 1 auto",
            maxWidth: "300px"
          }}
        >
          <SearchBar
            value={searchText}
            onChange={setSearchText}
            placeholder={transasset("searchAsset")}
          />
        </Box>

        <Box sx={{ flexShrink: 0 }}>
          <Toggle options={toggleOptions} selected={labels[view]} onChange={handleToggleChange} />
        </Box>
      </Box>

      <Box marginTop={"15px"}>
        {view === "assets" ? (
          <AssetFilters
            modelNameFilter={modelNameFilter}
            assignedToFilter={assignedToFilter}
            allModelNames={modelNames}
            allUsers={assignedUserNames}
            onModelNameChange={setModelNameFilter}
            onAssignedToChange={setAssignedToFilter}
            onClearFilters={() => {
              setModelNameFilter([]);
              setAssignedToFilter([]);
              setSearchText("");
            }}
            trans={transasset}
          />
        ) : (
          <AssetFilters
            modelNameFilter={[]}
            assignedToFilter={[]}
            allModelNames={[]}
            allUsers={[]}
            onModelNameChange={() => {}}
            onAssignedToChange={() => {}}
            onClearFilters={() => setStatusFilter([])}
            trans={transasset}
            hideModelNameFilter
            hideAssignedToFilter
            allStatuses={issueStatuses}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />
        )}
      </Box>

      {/* Updated Box with reduced padding and spacing */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto"
        }}
      >
        {initialView === transasset("selectedAsset") && (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              {mappedAssets.length === 0 ? (
                <EmptyState
                  imageSrc={NoAssetsImage}
                  message={
                    searchText || modelNameFilter.length || assignedToFilter.length
                      ? transasset("nodata")
                      : transasset("noasset")
                  }
                />
              ) : (
                <Paper
                  sx={{
                    p: 2,
                    overflow: "auto",
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto"
                  }}
                >
                  <Box sx={{ width: "100%", flex: 1 }}>
                    <Box sx={{ minWidth: 800 }}>
                      <Table<IAssetDisplayRow> columns={assetColumns} rows={mappedAssets} />
                    </Box>
                  </Box>
                </Paper>
              )}
            </Grid>
          </Grid>
        )}

        {initialView === transasset("selectedIssues") && (
          <AssetIssueCards searchText={searchText} statusFilter={statusFilter} />
        )}
      </Box>

      {/* Floating Action Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1300
        }}
      >
        <ActionButton
          label={
            initialView === transasset("selectedAsset")
              ? transasset("createasset")
              : initialView === transasset("tag")
                ? transasset("createtag")
                : transasset("createissue")
          }
          icon={<AddIcon sx={{ color: "white" }} />}
          onClick={handleActionClick}
        />
      </Box>
      <CreateIssue open={createIssueOpen} onClose={() => setCreateIssueOpen(false)} />
    </>
  );
};

export default AssetList;
