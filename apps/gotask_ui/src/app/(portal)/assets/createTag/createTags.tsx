"use client";
import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";
import TagInput from "./tagInput";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import CommonDialog from "@/app/component/dialog/commonDialog";
import useSWR from "swr";
import { fetcherUserList } from "../../user/services/userAction";
import { useAllAssets } from "../services/assetActions";
import { ACTION_TYPES } from "../assetConstants";
import { createAssetTags } from "../services/assetActions";
import { IAssetAttributes, IAssetTags } from "../interface/asset";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { User } from "../../user/interfaces/userInterface";

interface CreateTagProps {
  onClose: () => void;
  open: boolean;
}

export const CreateTag: React.FC<CreateTagProps> = ({ onClose, open }) => {
  const trans = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  const [formData, setFormData] = useState<IAssetTags>({
    userId: "",
    assetId: "",
    actionType: "",
    erk: "",
    previouslyUsedBy: ""
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });
  const { data: users } = useSWR("fetch-user", fetcherUserList);
  const { getAll: allAssets } = useAllAssets();
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
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

  const handleFormChange = <K extends keyof IAssetTags>(field: K, value: IAssetTags[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await createAssetTags(formData);
      if (response?.success) {
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
    <Box sx={{ width: 400, p: 3 }}>
      <CommonDialog
        open={open}
        onClose={onClose}
        onSubmit={handleSubmit}
        title={trans("createtag")}
      >
        <TagInput
          formData={formData}
          onChange={handleFormChange}
          userOptions={userOptions}
          assetOptions={assetOptions}
          previousUserOptions={previousUserOptions}
          actionTypes={actionTypes}
        />
      </CommonDialog>
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default CreateTag;
