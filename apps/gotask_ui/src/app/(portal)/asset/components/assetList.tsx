import React, { useMemo, useState } from "react";
import { Box, Grid, Paper, Skeleton, Typography } from "@mui/material";
import Toggle from "../../../component/toggle/toggle";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { deleteAsset, useAllAssets, useAllTypes } from "../services/assetActions";
import Table from "../../../component/table/table";
import ActionButton from "@/app/component/floatingButton/actionButton";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { IAssetAttributes, IAssetType } from "../interface/asset";
import { getAssetColumns, IAssetDisplayRow, issueStatuses } from "../assetConstants";
import AssetIssueCards from "../createIssues/issuesCard";
import SearchBar from "@/app/component/searchBar/searchBar";
import AssetFilters from "./assetFilter";
import { SortOrder } from "@/app/common/constants/task";
import DownloadIcon from "@mui/icons-material/Download";
import { Button } from "@mui/material";
import { downloadAssetCSV } from "../download/assetcsv";
import CommonDialog from "@/app/component/dialog/commonDialog";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { PAGE_OPTIONS } from "@/app/component/table/tableConstants";
import { useAllUsers } from "../../task/service/taskAction";
import { User } from "../../task/interface/taskInterface";

interface AssetListProps {
  initialView?: "assets" | "issues";
}

export const AssetList: React.FC<AssetListProps> = ({ initialView = "assets" }) => {
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  const [view, setView] = useState<"assets" | "issues">(initialView);
  const [assignedToFilter, setAssignedToFilter] = useState<string[]>([]);
  const [modelNameFilter, setModelNameFilter] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [warrantyDateFrom, setWarrantyDateFrom] = useState<string>("");
  const [warrantyDateTo, setWarrantyDateTo] = useState<string>("");
  const [systemTypeFilter, setSystemTypeFilter] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(SortOrder.DESC);
  const [assetAllocationFilter, setAssetAllocationFilter] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [assetTypeFilter, setAssetTypeFilter] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning"
  });
  const [page, setPage] = useState<number>(PAGE_OPTIONS.ZERO);
  const [rowsPerPage, setRowsPerPage] = useState<number>(PAGE_OPTIONS.DEFAULT_ROWS_25);

  const filters: Record<string, unknown> = {};

  if (warrantyDateFrom) filters.warrantyFrom = warrantyDateFrom;
  if (warrantyDateTo) filters.warrantyTo = warrantyDateTo;
  if (systemTypeFilter.length > 0) filters.systemType = systemTypeFilter;
  if (assignedToFilter.length > 0) filters.userId = assignedToFilter;
  if (assetTypeFilter.length > 0) filters.typeId = assetTypeFilter;

  const {
    getAll: allAssets,
    isLoading,
    mutate,
    total
  } = useAllAssets(sortKey, sortOrder, page + 1, rowsPerPage, filters);
  const { getAllUsers: allUsers } = useAllUsers();
  const { getAll: allTypes } = useAllTypes();

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

  const handleDeleteClick = (row: IAssetDisplayRow) => {
    setSelectedAssetId(row.id || null);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedAssetId) return;
    const res = await deleteAsset(selectedAssetId);
    if (res.success) {
      setSnackbar({ open: true, message: res.message, severity: "success" });
      mutate();
    } else {
      setSnackbar({ open: true, message: res.message, severity: "error" });
    }
    setDeleteDialogOpen(false);
    setSelectedAssetId(null);
  };

  const assetColumns = getAssetColumns(transasset, handleEdit, handleView, handleDeleteClick);

  const handleActionClick = () => {
    if (initialView === transasset("selectedAsset")) {
      router.push("/asset/createAsset");
    } else if (initialView === transasset("selectedIssues")) {
      router.push("/asset/createIssues");
    }
  };

  const allSystemTypes: string[] = useMemo(() => {
    return Array.from(
      new Set(
        allAssets
          .map((a: IAssetAttributes) => a.systemType)
          .filter((type: string): type is string => !!type)
      )
    );
  }, [allAssets]);

  const mappedAssets = allAssets.map((asset: IAssetAttributes) => ({
    id: asset.id,
    assetType: asset.assetType?.name || "-",
    deviceName: asset.deviceName || asset.accessCardNo || "-",
    modelName: asset.modelName || asset.accessCardNo2 || "-",
    warrantyDate: asset.warrantyDate ? new Date(asset.warrantyDate).toLocaleDateString() : "-",
    purchaseDate: asset.dateOfPurchase
      ? new Date(asset.dateOfPurchase).toLocaleDateString()
      : asset.issuedOn
        ? new Date(asset.issuedOn).toLocaleDateString()
        : "-",

    user:
      asset.tagData
        ?.map((t) => t.user?.name)
        .filter(Boolean)
        .join(", ") || "-",
    encrypted: asset.isEncrypted,
    previouslyUsedBy: asset.tagData?.find((tag) => !!tag.previouslyUsedBy)?.previouslyUsedBy || "-",
    issuesCount: asset.issuesCount,
    userAssetCount: asset.userAssetCount
  }));

  const clearAssetFilters = () => {
    setModelNameFilter([]);
    setAssignedToFilter([]);
    setSearchText("");
    setWarrantyDateFrom("");
    setWarrantyDateTo("");
    setSystemTypeFilter([]);
    setAssetAllocationFilter([]);
    setAssetTypeFilter([]);
  };

  const handleDownload = () => {
    const dataToDownload = allAssets;
    downloadAssetCSV(dataToDownload, transasset);
  };

  return (
    <>
      <ModuleHeader name={transasset("assets")} />
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
          {isLoading ? (
            <Skeleton variant="rectangular" sx={{ borderRadius: 1, width: "100%", height: 43 }} />
          ) : (
            <SearchBar
              value={searchText}
              onChange={setSearchText}
              placeholder={transasset("searchAsset")}
            />
          )}
        </Box>

        <Box sx={{ flexShrink: 0 }}>
          <Toggle options={toggleOptions} selected={labels[view]} onChange={handleToggleChange} />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          gap: 2,
          pr: 2,
          overflowX: "auto",
          mt: 1
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {view === "assets" ? (
            <AssetFilters
              modelNameFilter={modelNameFilter}
              assignedToFilter={assignedToFilter}
              allUsers={allUsers.map((u: User) => u.name)}
              onAssignedToChange={setAssignedToFilter}
              onClearFilters={clearAssetFilters}
              trans={transasset}
              dateFrom={warrantyDateFrom}
              dateTo={warrantyDateTo}
              onDateChange={(from, to) => {
                setWarrantyDateFrom(from);
                setWarrantyDateTo(to);
              }}
              systemTypeFilter={systemTypeFilter}
              allSystemTypes={allSystemTypes}
              onSystemTypeChange={setSystemTypeFilter}
              assetAllocationFilter={assetAllocationFilter}
              onAssetAllocationChange={setAssetAllocationFilter}
              assetTypeFilter={assetTypeFilter}
              allAssetTypes={allTypes.map((u: IAssetType) => u.name)}
              onAssetTypeChange={setAssetTypeFilter}
              loading={isLoading}
            />
          ) : (
            <AssetFilters
              modelNameFilter={[]}
              assignedToFilter={[]}
              allUsers={[]}
              onAssignedToChange={() => {}}
              onClearFilters={() => setStatusFilter([])}
              trans={transasset}
              hideModelNameFilter
              hideAssignedToFilter
              allStatuses={issueStatuses}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              loading={isLoading}
            />
          )}
        </Box>
        {initialView === transasset("selectedAsset") && !isLoading && (
          <Box
            sx={{
              flexShrink: 0,
              alignSelf: "flex-start",
              mt: 1
            }}
          >
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              sx={{
                whiteSpace: "nowrap",
                textTransform: "none",
                "& .MuiButton-startIcon": {
                  margin: { xs: 0, lg: "0 8px 0 -4px" }
                },
                minWidth: { xs: "40px", lg: "auto" },
                width: { xs: "40px", lg: "auto" },
                height: "40px",
                padding: { xs: "8px", lg: "6px 16px" },
                borderRadius: "8px",
                "& .button-text": {
                  display: { xs: "none", lg: "inline" }
                }
              }}
            >
              <span className="button-text">{transasset("download")}</span>
            </Button>
          </Box>
        )}
      </Box>
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
                    <Table<IAssetDisplayRow>
                      columns={assetColumns}
                      rows={mappedAssets}
                      onSortChange={(key, order) => {
                        setSortKey(key);
                        setSortOrder(order);
                        setPage(0);
                      }}
                      isLoading={isLoading}
                      onPageChange={(newPage, newLimit) => {
                        setPage(newPage);
                        setRowsPerPage(newLimit);
                      }}
                      totalCount={total}
                    />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {initialView === transasset("selectedIssues") && (
          <AssetIssueCards searchText={searchText} statusFilter={statusFilter} />
        )}
      </Box>

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

      <CommonDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onSubmit={confirmDelete}
        title={transasset("deleteAsset")}
        submitLabel={transasset("delete")}
      >
        <Typography variant="body1" color="text.secondary">
          {transasset("deleteconfirm")}
        </Typography>
      </CommonDialog>

      <CustomSnackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </>
  );
};

export default AssetList;
