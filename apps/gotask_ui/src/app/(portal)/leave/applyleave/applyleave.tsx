"use client";
import React, { useState } from "react";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { createLeave } from "../services/leaveAction";
import FormHeader from "../../access/components/FormHeader";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import { LeaveFormField } from "../interface/leaveInterface";
import { LEAVE_TYPE } from "@/app/common/constants/leave";
import LeaveInputs from "../component/leaveInput";

const ApplyLeave: React.FC = () => {
  const transleave = useTranslations(LOCALIZATION.TRANSITION.LEAVE);
  const router = useRouter();
  const [formData, setFormData] = useState<LeaveFormField>({
    from_date: "",
    to_date: "",
    leave_type: LEAVE_TYPE.SICK,
    reasons: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.from_date) {
      newErrors.from_date = transleave("fromdaterequired");
    }
    if (!formData.to_date) {
      newErrors.to_date = transleave("todaterequired");
    }
    if (formData.from_date && formData.to_date) {
      const fromDate = new Date(formData.from_date);
      const toDate = new Date(formData.to_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (fromDate < today) {
        newErrors.from_date = transleave("frompast");
      }
      if (fromDate > toDate) {
        newErrors.to_date = transleave("toearlier");
      }
    }
    if (!formData.leave_type) {
      newErrors.leave_type = transleave("leavetyperequired");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: transleave("valerr"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await createLeave(formData);
      setSnackbar({
        open: true,
        message: transleave("leavesubmit"),
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
      setTimeout(() => {
        router.push("/leave");
      }, 1000);
    } catch {
      setSnackbar({
        open: true,
        message: transleave("failedsubmit"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <FormHeader
        isEdit={false}
        onCancel={() => router.back()}
        onSubmit={handleSubmit}
        edit={transleave("editleave")}
        create={transleave("create")}
        cancle={transleave("cancel")}
        update={transleave("update")}
        isSubmitting={isSubmitting}
      />
      <Box sx={{ pl: 2, pr: 2 }}>
        <LeaveInputs
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
          showReasons={true}
        />
      </Box>
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default ApplyLeave;
