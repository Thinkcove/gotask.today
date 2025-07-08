import React, { useMemo, useState } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import Toggle from "../../../component/toggle/toggle";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { deleteAsset, useAllAssets } from "../services/assetActions";
import Table from "../../../component/table/table";
import ActionButton from "@/app/component/floatingButton/actionButton";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { IAssetAttributes } from "../interface/asset";
import {
  getAssetColumns,
  IAssetDisplayRow,
  issueStatuses,
  NOT_UTILIZED,
  OVERUTILIZED
} from "../assetConstants";
import AssetIssueCards from "../createIssues/issuesCard";
import SearchBar from "@/app/component/searchBar/searchBar";
import AssetFilters from "./assetFilter";
import { SortOrder } from "@/app/common/constants/task";
import DownloadIcon from "@mui/icons-material/Download";
import { Button } from "@mui/material";
import { downloadAssetCSV } from "../download/assetcsv";
import CommonDialog from "@/app/component/dialog/commonDialog";
import CustomSnackbar from "@/app/component/snackBar/snackbar";

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
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);

  const {
    getAll: allAssets,
    isLoading,
    mutate,
    total
  } = useAllAssets(
    sortKey,
    sortOrder,
    {
      assignedToFilter,
      modelNameFilter,
      warrantyDateFrom,
      warrantyDateTo,
      systemTypeFilter,
      assetAllocationFilter,
      assetTypeFilter
    },
    page + 1, // API expects 1-based page
    rowsPerPage
  );

  console.log("total", total);

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

  const assignedUserNames: string[] = useMemo(() => {
    const users = Array.from(
      new Set(
        allAssets.flatMap(
          (a: IAssetAttributes) =>
            a.tagData?.map((tag) => tag.user?.name).filter((n): n is string => !!n) ?? []
        )
      )
    ) as string[];

    return users.sort((a, b) => a.localeCompare(b));
  }, [allAssets]);

  const allSystemTypes: string[] = useMemo(() => {
    return Array.from(
      new Set(
        allAssets
          .map((a: IAssetAttributes) => a.systemType)
          .filter((type: string): type is string => !!type)
      )
    );
  }, [allAssets]);

  const allAssetTypes: string[] = useMemo(() => {
    return Array.from(
      new Set(
        allAssets
          .map((a: IAssetAttributes) => a.assetType?.name)
          .filter((type: string): type is string => !!type)
      )
    );
  }, [allAssets]);

  const filterAssets = (
    assets: IAssetAttributes[],
    searchText: string,
    assignedToFilter: string[],
    modelNameFilter: string[],
    warrantyFrom?: string,
    warrantyTo?: string
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

      const warrantyDate = asset.warrantyDate ? new Date(asset.warrantyDate) : null;
      const matchWarranty =
        (!warrantyFrom || (warrantyDate && warrantyDate >= new Date(warrantyFrom))) &&
        (!warrantyTo || (warrantyDate && warrantyDate <= new Date(warrantyTo)));

      const matchSystemType =
        systemTypeFilter.length === 0 || systemTypeFilter.includes(asset.systemType || "");

      const matchAssetAllocation =
        assetAllocationFilter.length === 0 ||
        assetAllocationFilter.some((option) => {
          if (option === OVERUTILIZED) {
            return Number(asset.userAssetCount) > 1;
          }
          if (option === NOT_UTILIZED) {
            return !asset.tagData?.some((tag) => !!tag.user?.name);
          }
          return true;
        });

      const matchAssetType =
        assetTypeFilter.length === 0 || assetTypeFilter.includes(asset.assetType?.name || "");

      return (
        matchBasic &&
        matchAssigned &&
        matchModel &&
        matchWarranty &&
        matchSystemType &&
        matchAssetAllocation &&
        matchAssetType
      );
    });
  };

  const filteredAssets = filterAssets(
    allAssets,
    searchText,
    assignedToFilter,
    modelNameFilter,
    warrantyDateFrom,
    warrantyDateTo
  );

  const mappedAssets = filteredAssets.map((asset) => ({
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
  };

  const appliedAnyFilter = () => {
    return (
      assignedToFilter.length > 0 ||
      warrantyDateFrom !== "" ||
      warrantyDateTo !== "" ||
      systemTypeFilter.length > 0 ||
      assetAllocationFilter.length > 0 ||
      assetTypeFilter.length > 0
    );
  };

  const handleDownload = () => {
    const dataToDownload = appliedAnyFilter() ? filteredAssets : allAssets;
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
              allUsers={assignedUserNames}
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
              allAssetTypes={allAssetTypes}
              onAssetTypeChange={setAssetTypeFilter}
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
            />
          )}
        </Box>
        {initialView === transasset("selectedAsset") && (
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
                        setPage(0); // Reset to first page on sort change
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
