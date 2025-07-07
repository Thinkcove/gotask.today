"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useUser } from "@/app/userContext";
import PremissionForm from "./conponents/premissionForm";
import FormHeader from "@/app/(portal)/access/components/FormHeader";
import { useRouter } from "next/navigation";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { PermissionPayload } from "../interface/interface";
import { createPermission } from "../services/permissionAction";

const Page = () => {
  const transpermishion = useTranslations(LOCALIZATION.TRANSITION.PERMISSION);

  const { user } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    startDate: "",
    startTime: "",
    endTime: "",
    comment: ""
  });

  const [errors, setErrors] = useState<{
    startDate?: string;
    startTime?: string;
    endTime?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const showSnackbar = (message: string, severity: string) => {
    setSnackbar({
      open: true,
      message,
      severity: severity as SNACKBAR_SEVERITY
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.startDate) newErrors.startDate = transpermishion("startdaterequired");
    if (!formData.startTime) newErrors.startTime = transpermishion("starttimerequired");
    if (!formData.endTime) newErrors.endTime = transpermishion("endtimerequired");

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.startTime = transpermishion("starttimebeforeendtime");
      newErrors.endTime = transpermishion("endtimebeforeendtime");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload: PermissionPayload = {
        date: formData.startDate,
        start_time: formData.startTime,
        end_time: formData.endTime,
        comment: formData.comment
      };

      await createPermission(payload);

      showSnackbar(transpermishion("successmessage"), SNACKBAR_SEVERITY.SUCCESS);

      setFormData({
        startDate: "",
        startTime: "",
        endTime: "",
        comment: ""
      });
      setErrors({});
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch {
      showSnackbar(transpermishion("failedmessage"), SNACKBAR_SEVERITY.ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleFormDataChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          m: 0,
          p: 0,
          overflow: "hidden"
        }}
      >
        <ModuleHeader name={transpermishion("permission")} />
        <FormHeader
          isEdit={false}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          create={transpermishion("create")}
          cancel={transpermishion("cancel")}
          createHeading={transpermishion("createpermission")}
        />
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          <PremissionForm
            formData={formData}
            errors={errors}
            onFormDataChange={handleFormDataChange}
            isSubmitting={isSubmitting}
            user={user?.name}
          />
        </Box>
      </Box>
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </>
  );
};

export default Page;
