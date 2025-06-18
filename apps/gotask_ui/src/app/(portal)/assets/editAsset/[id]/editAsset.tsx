import { useMemo, useState } from "react";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import CommonDialog from "@/app/component/dialog/commonDialog";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { KeyedMutator } from "swr";
import { IAssetAttributes, IAsset, IAssetType, IAssetTags } from "../../interface/asset";
import {
  createAssetAttributes,
  useAllAssets,
  useAllTags,
  useAllTypes
} from "../../services/assetActions";
import AssetInput from "../../createAsset/laptopInputs"; // Create similar to ProjectInput
import ModuleHeader from "@/app/component/header/moduleHeader";
import FormField from "@/app/component/input/formField";
import { useRouter } from "next/navigation";
import { createAssetTags } from "../../services/assetActions";
import { ACTION_TYPES } from "../../assetConstants";
import { User } from "@/app/(portal)/user/interfaces/userInterface";
import useSWR from "swr";
import { fetcherUserList } from "@/app/(portal)/user/services/userAction";
import TagInput from "../../createTag/tagInput";

interface EditAssetProps {
  data: IAssetAttributes;
  open: boolean;
  onClose: () => void;
  assetID: string;
  mutate: KeyedMutator<IAsset>;
}

const EditAsset: React.FC<EditAssetProps> = ({ data, onClose, mutate }) => {
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  const router = useRouter();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });
  const [openTagInput, setOpenTagInput] = useState(false);
  const { getAll: allAssets } = useAllAssets();
  const { mutate: tagMutate } = useAllTags();
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

  const [tagData, setTagData] = useState<IAssetTags>({
    userId: "",
    assetId: "",
    actionType: "",
    erk: "",
    previouslyUsedBy: ""
  });

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
    if (!formData.storage) newErrors.storage = transasset("storage");
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

  const assetOptions = useMemo(() => {
    return (
      allAssets?.map((asset: IAssetAttributes) => ({
        id: asset.id,
        name: asset.deviceName
      })) || []
    );
  }, [allAssets]);

  const previousUserOptions = userOptions;
  const actionTypes = ACTION_TYPES;

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

  const handleTagChange = <K extends keyof IAssetTags>(field: K, value: IAssetTags[K]) => {
    setTagData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagSubmit = async () => {
    try {
      const response = await createAssetTags(tagData);
      if (response?.success) {
        await tagMutate();
        setSnackbar({
          open: true,
          message: transasset("successmessage"),
          severity: SNACKBAR_SEVERITY.SUCCESS
        });
      }
      onClose();
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  return (
    <>
      <ModuleHeader name="asset" />

      <Paper elevation={2} sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#741B92" }}>
            {transasset("updateasset")}
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
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
                  value={formData.userId || ""}
                  onChange={(val) => handleChange("userId", String(val))}
                  placeholder={transasset("assignedTo")}
                  sx={{ flex: 1 }}
                />
              </Box>
            </Box>
          </Grid>
          <CommonDialog
            open={openTagInput}
            onSubmit={handleTagSubmit}
            onClose={() => setOpenTagInput(false)}
            title="Tag Asset to User"
          >
            <TagInput
              formData={tagData}
              onChange={handleTagChange}
              userOptions={userOptions}
              assetOptions={assetOptions}
              previousUserOptions={previousUserOptions}
              actionTypes={actionTypes}
            />
          </CommonDialog>

          <AssetInput formData={formData} onChange={handleChange} errors={errors} />
        </Box>
      </Paper>

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
