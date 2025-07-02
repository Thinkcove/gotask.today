"use client";
import React, { useMemo, useState } from "react";
import { Grid, Typography, Paper, Box, Button } from "@mui/material";
import { createAssetAttributes, useAllAssets, useAllTypes } from "../services/assetActions"; // adjust path as needed
import FormField from "../../../component/input/formField"; // assuming same reusable FormField
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import LaptopInputs from "./laptopInputs";
import { useRouter } from "next/navigation";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { IAssetAttributes, IAssetType } from "../interface/asset";
import { User } from "../../user/interfaces/userInterface";
import useSWR from "swr";
import { fetcherUserList } from "../../user/services/userAction";
import MobileInputs from "./mobileInputs";
import { ASSET_TYPE } from "@/app/common/constants/asset";
import { OFFICE_SYSTEM, systemTypeOptions } from "../assetConstants";
import AccessInputs from "./accessInput";

export const CreateAsset: React.FC = () => {
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  const { getAll: allTypes } = useAllTypes();
  const { data: users } = useSWR("fetch-user", fetcherUserList);
  const { mutate: assetMutate } = useAllAssets();
  const [formData, setFormData] = useState<IAssetAttributes>({
    typeId: "",
    userId: "",
    deviceName: "",
    systemType: OFFICE_SYSTEM,
    serialNumber: "",
    modelName: "",
    os: "",
    ram: "",
    storage: "",
    processor: "",
    seller: "",
    dateOfPurchase: "",
    erk: "",
    warrantyPeriod: "",
    warrantyDate: "",
    antivirus: false,
    recoveryKey: "",
    lastServicedDate: "",
    commentService: "",
    isEncrypted: false,

    //mobile
    imeiNumber: "",
    screenSize: "",
    batteryCapacity: "",
    cameraSpecs: "",
    simType: "",
    is5GSupported: false,
    insuranceProvider: "",
    insurancePolicyNumber: "",
    insuranceExpiry: "",

    //accesscard
    accessCardNo: "",
    personalId: ""
  });
  const [selectedAssetType, setSelectedAssetType] = useState<IAssetType | null>(null);
  const router = useRouter();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const userOptions = useMemo(() => {
    return (
      users?.map((user: User) => ({
        id: user.id,
        name: user.name
      })) || []
    );
  }, [users]);

  const handleAssetTypeChange = (id: string) => {
    const type = allTypes.find((t: IAssetType) => t.id === id) || null;
    setSelectedAssetType(type);
    setFormData((prev) => ({ ...prev, typeId: id }));
  };

  const handleInputChange = <K extends keyof IAssetAttributes>(
    field: K,
    value: IAssetAttributes[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (selectedAssetType?.name !== ASSET_TYPE.ACCESS_CARDS) {
      if (!formData.typeId) newErrors.typeId = transasset("typeid");
      if (!formData.deviceName)
        newErrors.deviceName = `${transasset("devicename")} ${transasset("isrequired")}`;
      if (!formData.systemType)
        newErrors.systemType = `${transasset("systemtype")} ${transasset("isrequired")}`;
      if (!formData.ram) newErrors.ram = `${transasset("ram")} ${transasset("isrequired")}`;
      if (!formData.modelName)
        newErrors.modelName = `${transasset("modelname")} ${transasset("isrequired")}`;
      if (!formData.os) newErrors.os = `${transasset("os")} ${transasset("isrequired")}`;
      if (!formData.processor)
        newErrors.processor = `${transasset("processor")} ${transasset("isrequired")}`;
    }

    if (selectedAssetType?.name === ASSET_TYPE.MOBILE) {
      if (!formData.imeiNumber)
        newErrors.imeiNumber = `${transasset("imeiNumber")} ${transasset("isrequired")}`;
    }

    if (selectedAssetType?.name === ASSET_TYPE.ACCESS_CARDS) {
      if (!formData.accessCardNo)
        newErrors.accessCardNo = `${transasset("accessCardNo")} ${transasset("isrequired")}`;
      if (!formData.personalId)
        newErrors.personalId = `${transasset("personalId")} ${transasset("isrequired")}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!selectedAssetType?.id) {
      setSnackbar({
        open: true,
        message: transasset("selectTypeError"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
      return;
    }

    try {
      const payload = { ...formData, typeId: selectedAssetType.id, userId: formData.userId };
      const response = await createAssetAttributes(payload);
      if (response?.success) {
        await assetMutate();
        setSnackbar({
          open: true,
          message: transasset("assetsuccess"),
          severity: SNACKBAR_SEVERITY.SUCCESS
        });
        router.push("/asset");
      }
    } catch (err) {
      console.error("Failed to create asset", err);
    }
  };

  return (
    <Paper elevation={2} sx={{ padding: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#741B92" }}>
          {transasset("createasset")}
        </Typography>
        {selectedAssetType && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              sx={{
                borderRadius: "30px",
                color: "black",
                border: "2px solid  #741B92",
                px: 2,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)"
                }
              }}
              onClick={() => router.back()}
            >
              {transasset("cancel")}
            </Button>
            <Button
              variant="contained"
              sx={{
                borderRadius: "30px",
                backgroundColor: " #741B92",
                color: "white",
                px: 2,
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "rgb(202, 187, 201) 100%)"
                }
              }}
              onClick={handleSubmit}
            >
              {transasset("create")}
            </Button>
          </Box>
        )}
      </Box>
      <Box sx={{ maxHeight: "calc(100vh - 180px)", overflowY: "auto", pr: 1 }}>
        <Grid container>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormField
                  label={transasset("type")}
                  type="select"
                  required
                  options={(allTypes || []).map((type: IAssetType) => ({
                    id: type.id,
                    name: type.name
                  }))}
                  placeholder={transasset("type")}
                  value={selectedAssetType?.id || ""}
                  onChange={(val) => handleAssetTypeChange(String(val))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  label={transasset("assignedTo")}
                  type="select"
                  options={userOptions}
                  value={formData.userId || ""}
                  onChange={(val) => handleInputChange("userId", String(val))}
                  placeholder={transasset("assignedTo")}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Laptop Inputs below if type is Laptop */}
          {(selectedAssetType?.name === ASSET_TYPE.LAPTOP ||
            selectedAssetType?.name === ASSET_TYPE.DESKTOP ||
            selectedAssetType?.name === ASSET_TYPE.MOBILE) && (
            <Grid item xs={12}>
              <LaptopInputs
                formData={formData}
                onChange={handleInputChange}
                startIndex={1}
                selectedAssetType={selectedAssetType}
                systemTypeOptions={systemTypeOptions}
                errors={errors}
              />
            </Grid>
          )}
          {selectedAssetType?.name === ASSET_TYPE.MOBILE && (
            <Grid item xs={12}>
              <MobileInputs
                formData={formData}
                onChange={handleInputChange}
                errors={errors}
                systemTypeOptions={systemTypeOptions}
              />
            </Grid>
          )}
          {selectedAssetType?.name === ASSET_TYPE.ACCESS_CARDS && (
            <Grid item xs={12}>
              <AccessInputs
                formData={formData}
                onChange={handleInputChange}
                errors={errors}
                selectedAssetType={selectedAssetType}
              />
            </Grid>
          )}
        </Grid>
        <CustomSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </Box>
    </Paper>
  );
};

export default CreateAsset;
