import { useMemo, useState } from "react";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { KeyedMutator } from "swr";
import { IAssetAttributes, IAssetType } from "../../interface/asset";
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
import HistoryDrawer from "@/app/(portal)/task/editTask/taskHistory";
import HistoryIcon from "@mui/icons-material/History";

interface EditAssetProps {
  data: IAssetAttributes;
  open: boolean;
  onClose: () => void;
  assetID: string;
  mutate: KeyedMutator<IAssetAttributes | null>;
}

const EditAsset: React.FC<EditAssetProps> = ({ data, onClose, mutate }) => {
  console.log("useAssetById", data.assetHistory);
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  const [openHistoryDrawer, setOpenHistoryDrawer] = useState(false);

  const router = useRouter();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });
  const [formData, setFormData] = useState<IAssetAttributes>(() => ({
    id: data?.id,
    typeId: data?.typeId || "",
    deviceName: data?.deviceName || "",
    serialNumber: data?.serialNumber || "",
    ram: data?.ram || "",
    modelName: data?.modelName || "",
    os: data?.os || "",
    storage: data?.storage || "",
    processor: data?.processor || "",
    seller: data?.seller || "",
    dateOfPurchase: data?.dateOfPurchase || undefined,
    warrantyPeriod: data?.warrantyPeriod || "",
    warrantyDate: data?.warrantyDate || undefined,
    active: data?.active ?? true,
    createdBy: data?.createdBy || "",
    updatedBy: data?.updatedBy || "",
    antivirus: data?.antivirus || "",
    recoveryKey: data?.recoveryKey || "",
    isEncrypted: data?.isEncrypted ?? false,
    lastServicedDate: data?.lastServicedDate || undefined,
    commentService: data?.commentService || "",
    assetType: data?.assetType || undefined,
    userId: data?.tags?.userId || "",
    tag: data.tags?.id || ""
  }));

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { getAll: allTypes } = useAllTypes();
  const { data: users } = useSWR("fetch-user", fetcherUserList);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.id) newErrors.id = transasset("id");
    if (!formData.typeId) newErrors.typeId = transasset("typeid");
    if (!formData.deviceName) newErrors.deviceName = transasset("devicename");
    if (!formData.ram) newErrors.ram = transasset("ram");
    if (!formData.modelName) newErrors.modelName = transasset("modelname");
    if (!formData.os) newErrors.os = transasset("os");
    if (!formData.processor) newErrors.processor = transasset("processor");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = <K extends keyof IAssetAttributes>(field: K, value: IAssetAttributes[K]) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
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
      await createAssetAttributes(formData);
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

  return (
    <>
      <ModuleHeader name={transasset("assets")} />

      <Paper elevation={2} sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2
          }}
        >
          {/* <Typography variant="h6" sx={{ fontWeight: "bold", color: "#741B92" }}>
            {transasset("updateasset")}
          </Typography>
          <Box
            sx={{
              textDecoration: "underline",
              display: "flex",
              gap: 1,
              color: "#741B92",
              px: 2,
              mt: -1,
              mb: 2,
              alignItems: "center",
              cursor: "pointer"
            }}
            onClick={() => setOpenHistoryDrawer(true)}
          >
            <HistoryIcon />
          </Box> */}

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
                  alignItems: "center",
                  gap: 1,
                  justifyContent: { xs: "center", sm: "flex-start" },
                  color: "#741B92",
                  cursor: "pointer"
                }}
                onClick={() => setOpenHistoryDrawer(true)}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#741B92" }}>
                  {transasset("updateasset")}
                </Typography>
                <HistoryIcon fontSize="medium" />
                <Typography variant="body2">{transasset("showhistory")}</Typography>
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
            selectedAssetType?.name === ASSET_TYPE.MOBILE) && (
            <AssetInput
              formData={formData}
              onChange={handleChange}
              errors={errors}
              selectedAssetType={selectedAssetType}
            />
          )}
          {selectedAssetType?.name === ASSET_TYPE.MOBILE && (
            <Grid item xs={12}>
              <MobileInputs formData={formData} onChange={handleChange} errors={errors} />
            </Grid>
          )}
        </Box>
      </Paper>
      {openHistoryDrawer && (
        <HistoryDrawer
          open={openHistoryDrawer}
          onClose={() => setOpenHistoryDrawer(false)}
          history={data.assetHistory}
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
