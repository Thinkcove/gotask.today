"use client";
import React, { useState } from "react";
import { Grid, Typography, Paper, Box, Button } from "@mui/material";
import { createLaptopAsset, useAllTypes } from "../services/assetActions"; // adjust path as needed
import FormField from "../../../component/input/formField"; // assuming same reusable FormField
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import LaptopInputs from "./laptopInputs";
import { useRouter } from "next/navigation";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { IAssetAttributes, IAssetType } from "../interface/asset";

interface AssetFormData {
  typeId: string;
}

export const CreateAsset: React.FC = () => {
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  const { getAll: allTypes } = useAllTypes();
  const [formData, setFormData] = useState<AssetFormData>({
    typeId: ""
  });
  const [selectedAssetType, setSelectedAssetType] = useState<IAssetType | null>(null);
  const router = useRouter();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

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

  const handleSubmit = async () => {
    if (!selectedAssetType?.id) {
      setSnackbar({
        open: true,
        message: transasset("selectTypeError"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
      return;
    }

    try {
      const payload = { ...formData, typeId: selectedAssetType.id };
      console.log("payload", payload);
      const response = await createLaptopAsset(payload);
      console.log("response", response);
      if (response?.success) {
        setSnackbar({
          open: true,
          message: transasset("successmessage"),
          severity: SNACKBAR_SEVERITY.SUCCESS
        });
        router.push("/assets");
      }
    } catch (err) {
      console.error("Failed to create asset", err);
    }
  };

  return (
    <Paper elevation={2} sx={{ padding: 8 }}>
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
          <Grid item xs={12} sm={4}>
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

          {/* Laptop Inputs inline with dropdown */}
          {selectedAssetType?.name === "Laptop" && (
            <LaptopInputs formData={formData} onChange={handleInputChange} startIndex={1} />
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
