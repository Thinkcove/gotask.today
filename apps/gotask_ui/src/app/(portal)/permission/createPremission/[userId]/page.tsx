"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useAllProjects } from "@/app/(portal)/task/service/taskAction";
import { useUser } from "@/app/userContext";
import PremissionForm from "./conponents/premissionForm";
import FormHeader from "@/app/(portal)/access/components/FormHeader";
import { useParams, useRouter } from "next/navigation";
import { createPermission, PermissionPayload } from "../../services/permissionAction";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";

const Page = () => {
  const params = useParams();
  const { user } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    startDate: "",
    startTime: "",
    endTime: ""
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

    // Validate required fields
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";

    // Validate time range for same day
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.startTime = "Start time must be before end time on the same day";
      newErrors.endTime = "End time must be after start time on the same day";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // For single day permission
      const payload: PermissionPayload = {
        date: formData.startDate,
        start_time: formData.startTime,
        end_time: formData.endTime
      };

      await createPermission(payload);

      showSnackbar("Permission request submitted successfully!", SNACKBAR_SEVERITY.SUCCESS);

      // Reset form
      setFormData({
        startDate: "",
        startTime: "",
        endTime: ""
      });
      setErrors({});

      // Navigate back after successful creation
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      console.error("Error creating permission:", error);
      showSnackbar(
        "Failed to submit permission request. Please try again.",
        SNACKBAR_SEVERITY.ERROR
      );
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
        {params?.userId === user?.id && <ModuleHeader name={user?.name} />}
        <FormHeader
          isEdit={false}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          edit={"editPremishion"}
          create={"create"}
          cancle={"cancel"}
          update={"update"}
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
