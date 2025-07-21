"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useUser } from "@/app/userContext";
import FormHeader from "@/app/component/header/formHeader";
import { useRouter } from "next/navigation";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { PermissionPayload } from "../interface/interface";
import { createPermission } from "../services/permissionAction";
import PermissionForm from "../components/permissionForm";
import { parse, isValid } from "date-fns";
import { timeformats } from "@/app/component/dateTime/timePicker";

const Page = () => {
  const transpermission = useTranslations(LOCALIZATION.TRANSITION.PERMISSION);

  const { user } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    startDate: "",
    startTime: "",
    endTime: "",
    comments: ""
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

  const parseTime = (timeStr: string): Date | null => {
    const baseDate = new Date();
    for (const fmt of timeformats) {
      const parsed = parse(timeStr, fmt, baseDate);
      if (isValid(parsed)) return parsed;
    }
    return null;
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.startDate) newErrors.startDate = transpermission("startdaterequired");
    if (!formData.startTime) newErrors.startTime = transpermission("starttimerequired");
    if (!formData.endTime) newErrors.endTime = transpermission("endtimerequired");

    const startTimeParsed = parseTime(formData.startTime);
    const endTimeParsed = parseTime(formData.endTime);

    if (
      startTimeParsed &&
      endTimeParsed &&
      isValid(startTimeParsed) &&
      isValid(endTimeParsed) &&
      startTimeParsed >= endTimeParsed
    ) {
      newErrors.startTime = transpermission("starttimebeforeendtime");
      newErrors.endTime = transpermission("endtimebeforeendtime");
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
        comments: formData.comments
      };

      await createPermission(payload);

      showSnackbar(transpermission("successmessage"), SNACKBAR_SEVERITY.SUCCESS);

      setFormData({
        startDate: "",
        startTime: "",
        endTime: "",
        comments: ""
      });
      setErrors({});
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch {
      showSnackbar(transpermission("failedmessage"), SNACKBAR_SEVERITY.ERROR);
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
        <ModuleHeader name={transpermission("permission")} />
        <FormHeader
          isEdit={false}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          create={transpermission("create")}
          cancel={transpermission("cancel")}
          createHeading={transpermission("createpermission")}
        />
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          <PermissionForm
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
