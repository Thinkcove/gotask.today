"use client";

import React, { useState } from "react";
import { Box, Grid } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { useRouter } from "next/navigation";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { LEAVE_TYPE } from "../constants/leaveConstants";
import { createLeave } from "../services/leaveAction";
import FormHeader from "../../access/components/FormHeader";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import { LeaveFormField } from "../interface/leaveInterface";


const ApplyLeave: React.FC = () => {
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
    severity:SNACKBAR_SEVERITY.INFO
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

    if (!formData.reasons) {
      newErrors.reasons = transleave("reasonrequired");
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
      const payload = {
        ...formData
      };

      await createLeave(payload);

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

  const transleave = useTranslations(LOCALIZATION.TRANSITION.LEAVE);

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
        showhistory={""}
        isSubmitting={isSubmitting}
      />
      <Box sx={{ pl: 2, pr: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormField
              label={transleave("fromdate")}
              type="date"
              placeholder={transleave( "dateformat")}
              value={formData.from_date}
              onChange={(value) => {
                const dateValue =
                  value instanceof Date ? value.toISOString().split("T")[0] : String(value);
                handleInputChange("from_date", dateValue);
              }}
              error={errors.from_date}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              label={transleave("todate")}
              type="date"
              placeholder={transleave( "dateformat")}
              value={formData.to_date}
              onChange={(value) => {
                const dateValue =
                  value instanceof Date ? value.toISOString().split("T")[0] : String(value);
                handleInputChange("to_date", dateValue);
              }}
              error={errors.to_date}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormField
              label={transleave("leavetype")}
              type="select"
              options={Object.values(LEAVE_TYPE).map((s) => s.toUpperCase())}
              required
              placeholder={transleave("selecttype")}
              value={formData.leave_type.toUpperCase()}
              onChange={(value) =>
                handleInputChange(
                  "leave_type",
                  String(value).charAt(0).toUpperCase() + String(value).slice(1).toLowerCase()
                )
              }
              error={errors.leave_type}
            />
          </Grid>
          <Grid item xs={12}>
            <FormField
              label={transleave("reason")}
              type="text"
              placeholder={transleave("enterreason")}
              value={formData.reasons}
              onChange={(val) => handleInputChange("reasons", String(val))}
              error={errors.reasons}
              required
              multiline
            />
          </Grid>
        </Grid>
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
