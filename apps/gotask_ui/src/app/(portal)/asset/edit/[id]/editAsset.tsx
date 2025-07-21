import { useMemo, useState } from "react";
import { Box, Button, CircularProgress, Grid, IconButton, Typography } from "@mui/material";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { KeyedMutator } from "swr";
import { IAssetAttributes, IAssetTags, IAssetType } from "../../interface/asset";
import { createAssetAttributes, useAllTypes } from "../../services/assetActions";
import AssetInput from "../../createAsset/laptopInputs"; // Create similar to ProjectInput
import ModuleHeader from "@/app/component/header/moduleHeader";
import FormField from "@/app/component/input/formField";
import { useRouter } from "next/navigation";
import { User } from "@/app/(portal)/user/interfaces/userInterface";
import useSWR from "swr";
import { fetcherUserList } from "@/app/(portal)/user/services/userAction";
import MobileInputs from "../../createAsset/mobileInputs";
import { ASSET_TYPE } from "@/app/common/constants/asset";
import HistoryIcon from "@mui/icons-material/History";
import IssueHistoryDrawer from "../../createIssues/issuesDrawer";
import { ArrowBack } from "@mui/icons-material";
import { calculateWarrantyDate, systemTypeOptions } from "../../assetConstants";
import AccessInputs from "../../createAsset/accessInput";
import PrinterInputs from "../../createAsset/printerInputs";
import FingerprintScannerInputs from "../../createAsset/fingerPrintInputs";

interface EditAssetProps {
  data: IAssetAttributes;
  open: boolean;
  onClose: () => void;
  assetID: string;
  mutate: KeyedMutator<IAssetAttributes | null>;
}

const EditAsset: React.FC<EditAssetProps> = ({ data, onClose, mutate }) => {
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  const [openHistoryDrawer, setOpenHistoryDrawer] = useState(false);

  const router = useRouter();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });
  const [previousUserName, setPreviousUserName] = useState<string | null>(() => {
    return data?.tags?.userName || null;
  });

  const [isAssignedToUpdated, setIsAssignedToUpdated] = useState(false);

  const [formData, setFormData] = useState<IAssetAttributes>(() => ({
    id: data?.id,
    typeId: data?.typeId || "",
    deviceName: data?.deviceName || "",
    systemType: data?.systemType || "",
    serialNumber: data?.serialNumber || "",
    ram: data?.ram || "",
    modelName: data?.modelName || "",
    os: data?.os || "",
    storage: data?.storage || "",
    processor: data?.processor || "",
    erk: data?.erk || "",
    seller: data?.seller || "",
    dateOfPurchase: data?.dateOfPurchase || undefined,
    warrantyPeriod: data?.warrantyPeriod || "",
    warrantyDate: data?.warrantyDate || undefined,
    active: data?.active ?? true,
    created_by: data?.createdBy || "",
    updatedBy: data?.updatedBy || "",
    antivirus: data?.antivirus ?? false,
    recoveryKey: data?.recoveryKey || "",
    isEncrypted: data?.isEncrypted ?? false,
    lastServicedDate: data?.lastServicedDate || undefined,
    commentService: data?.commentService || "",
    assetType: data?.assetType || undefined,
    userId: data?.tags?.userId || "",
    tag: data.tags?.id || "",
    accessCardNo: data?.accessCardNo || "",
    personalId: data.personalId || "",
    accessCardNo2: data?.accessCardNo2 || "",
    issuedOn: data.issuedOn || "",
    Location: data.Location || "",
    connectivity: data.connectivity || "",
    printerType: data?.printerType || "",
    specialFeatures: data.specialFeatures || "",
    printerOutputType: data.printerOutputType || "",
    supportedPaperSizes: data.supportedPaperSizes || "",
    capacity: data.capacity || "",
    authenticationModes: data.authenticationModes || "",
    display: data.display || "",
    cloudAndAppBased: data?.cloudAndAppBased
  }));

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { getAll: allTypes } = useAllTypes();
  const { data: users } = useSWR("fetch-user", fetcherUserList);

  const handleBack = () => router.back();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (formData.accessCardNo) {
      if (!formData.accessCardNo)
        newErrors.accessCardNo = `${transasset("accesscardno")} ${transasset("isrequired")}`;
      if (!formData.personalId)
        newErrors.personalId = `${transasset("personalid")} ${transasset("isrequired")}`;
      if (!formData.accessCardNo2)
        newErrors.accessCardNo2 = `${transasset("accesscardno2")} ${transasset("isrequired")}`;
      if (!formData.issuedOn)
        newErrors.issuedOn = `${transasset("issuedon")} ${transasset("isrequired")}`;
    } else {
      if (!formData.typeId) newErrors.typeId = transasset("typeid");

      if (
        selectedAssetType?.name === ASSET_TYPE.LAPTOP ||
        selectedAssetType?.name === ASSET_TYPE.DESKTOP
      ) {
        if (!formData.deviceName) newErrors.deviceName = transasset("devicename");
        if (!formData.systemType) newErrors.systemType = transasset("systemtype");
        if (!formData.ram) newErrors.ram = transasset("ram");
        if (!formData.modelName) newErrors.modelName = transasset("modelname");
        if (!formData.os) newErrors.os = transasset("os");
        if (!formData.processor) newErrors.processor = transasset("processor");
      }

      if (
        selectedAssetType?.name === ASSET_TYPE.FINGERPRINT_SCANNER ||
        selectedAssetType?.name === ASSET_TYPE.PRINTER
      ) {
        if (!formData.deviceName)
          newErrors.deviceName = `${transasset("devicename")} ${transasset("isrequired")}`;
        if (!formData.modelName)
          newErrors.modelName = `${transasset("modelname")} ${transasset("isrequired")}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = <K extends keyof IAssetAttributes>(field: K, value: IAssetAttributes[K]) => {
    const newFormData = { ...formData, [field]: value };

    if (field === "userId" && value !== formData.userId) {
      const prevUser = userOptions.find((u: IAssetTags) => u.id === formData.userId);
      if (prevUser) setPreviousUserName(prevUser.name);
      setIsAssignedToUpdated(value !== data.tags?.userId);
    }

    // Auto-update warrantyDate if warrantyPeriod is changed
    if (field === "warrantyPeriod") {
      const purchaseDateStr =
        newFormData.dateOfPurchase instanceof Date
          ? newFormData.dateOfPurchase.toISOString().split("T")[0]
          : String(newFormData.dateOfPurchase);

      const newWarrantyDate = calculateWarrantyDate(purchaseDateStr, String(value));
      if (newWarrantyDate) {
        newFormData.warrantyDate = newWarrantyDate;
      }
    }

    // Auto-update warrantyDate if dateOfPurchase is changed
    if (field === "dateOfPurchase") {
      const purchaseDateStr =
        value instanceof Date ? value.toISOString().split("T")[0] : String(value);

      const newWarrantyDate = calculateWarrantyDate(
        purchaseDateStr,
        String(formData.warrantyPeriod)
      );
      if (newWarrantyDate) {
        newFormData.warrantyDate = newWarrantyDate;
      }
    }

    setFormData(newFormData);
  };

  const userOptions = useMemo(() => {
    return (
      users?.map((user: User) => ({
        id: user.id,
        name: user.name
      })) || []
    );
  }, [users]);

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const payload = {
        ...formData,
        previouslyUsedBy: previousUserName || undefined,
        ...(isAssignedToUpdated ? { isAssignedToUpdated: true } : {})
      };
      await createAssetAttributes(payload);
      await mutate();
      setSnackbar({
        open: true,
        message: transasset("updatesuccess"),
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
      onClose();
      setTimeout(() => {
        router.back();
      }, 500);
    } catch {
      setSnackbar({
        open: true,
        message: transasset("updateerror"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  const selectedAssetType = useMemo(() => {
    return allTypes.find((type: IAssetAttributes) => type.id === formData.typeId) || null;
  }, [formData.typeId, allTypes]);

  if (!formData || !users || allTypes.length === 0) {
    return (
      <>
        <ModuleHeader name={transasset("assets")} />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)"
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              textAlign: "center"
            }}
          >
            <CircularProgress size={50} thickness={4} />
          </Box>
        </Box>
      </>
    );
  }

  return (
    <>
      <ModuleHeader name={transasset("assets")} />

      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2
          }}
        >
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              mb: 2
            }}
          >
            {/* Title + Icon */}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: { xs: "center", sm: "flex-start" },
                  gap: 0.5
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton color="primary" onClick={handleBack}>
                    <ArrowBack />
                  </IconButton>
                  {/* Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: "#741B92",
                      display: "flex",
                      alignItems: "center",
                      gap: 1
                    }}
                  >
                    {transasset("updateasset")}
                  </Typography>
                </Box>
                {/* Show History link with icon */}
                {Array.isArray(data.assetHistory) && data.assetHistory.length > 0 && (
                  <Box
                    onClick={() => setOpenHistoryDrawer(true)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      color: "#741B92",
                      cursor: "pointer",
                      pl: 5
                    }}
                  >
                    <Typography variant="body2" sx={{ textDecoration: "underline" }}>
                      {transasset("showhistory")}
                    </Typography>
                    <HistoryIcon fontSize="small" />
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Buttons */}
            <Grid item xs={12} sm="auto">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", sm: "flex-end" },
                  gap: 2,
                  flexWrap: "wrap"
                }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: "30px",
                    color: "#741B92",
                    border: "2px solid #741B92",
                    px: 3,
                    textTransform: "none"
                  }}
                  onClick={() => router.back()}
                >
                  {transasset("cancel")}
                </Button>

                <Button
                  variant="contained"
                  sx={{
                    borderRadius: "30px",
                    backgroundColor: "#741B92",
                    color: "white",
                    px: 3,
                    textTransform: "none",
                    fontWeight: "bold"
                  }}
                  onClick={handleSubmit}
                >
                  {transasset("update")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            maxHeight: "calc(100vh - 180px)",
            overflowY: "auto",
            pr: 1
          }}
        >
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: "100%", display: "flex", gap: 2 }}>
                <FormField
                  label={transasset("type")}
                  type="select"
                  required
                  options={(allTypes || []).map((type: IAssetType) => ({
                    id: type.id,
                    name: type.name
                  }))}
                  placeholder={transasset("type")}
                  value={formData.typeId}
                  disabled
                  sx={{ flex: 1 }}
                />
                <FormField
                  label={transasset("assignedTo")}
                  type="select"
                  options={userOptions}
                  value={formData.userId}
                  onChange={(val) => handleChange("userId", String(val))}
                  placeholder={transasset("assignedTo")}
                  sx={{ flex: 1 }}
                />
              </Box>
            </Box>
          </Grid>
          {(selectedAssetType?.name === ASSET_TYPE.LAPTOP ||
            selectedAssetType?.name === ASSET_TYPE.DESKTOP ||
            selectedAssetType?.name === ASSET_TYPE.MOBILE) && (
            <AssetInput
              formData={formData}
              onChange={handleChange}
              errors={errors}
              selectedAssetType={selectedAssetType}
              systemTypeOptions={systemTypeOptions}
            />
          )}
          {selectedAssetType?.name === ASSET_TYPE.MOBILE && (
            <Grid item xs={12}>
              <MobileInputs
                formData={formData}
                onChange={handleChange}
                errors={errors}
                systemTypeOptions={systemTypeOptions}
              />
            </Grid>
          )}
          {selectedAssetType?.name === ASSET_TYPE.ACCESS_CARDS && (
            <AccessInputs
              formData={formData}
              onChange={handleChange}
              errors={errors}
              selectedAssetType={selectedAssetType}
            />
          )}

          {selectedAssetType?.name === ASSET_TYPE.PRINTER && (
            <PrinterInputs
              formData={formData}
              onChange={handleChange}
              errors={errors}
              selectedAssetType={selectedAssetType}
            />
          )}

          {selectedAssetType?.name === ASSET_TYPE.FINGERPRINT_SCANNER && (
            <FingerprintScannerInputs
              formData={formData}
              onChange={handleChange}
              errors={errors}
              selectedAssetType={selectedAssetType}
            />
          )}
        </Box>
      </Box>
      {openHistoryDrawer && (
        <IssueHistoryDrawer
          open={openHistoryDrawer}
          onClose={() => setOpenHistoryDrawer(false)}
          mode="asset"
          history={
            Array.isArray(data?.assetHistory)
              ? data.assetHistory.map((item) => ({
                  id: item.id ?? "",
                  issuesId: item.assetId ?? "",
                  formatted_history: item.formatted_history ?? "",
                  created_date: item.created_date ? new Date(item.created_date) : new Date(),
                  created_by: item.created_by ?? "",
                  userData: item.userData,
                  tagData: item.tagData
                }))
              : []
          }
        />
      )}

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default EditAsset;
