"use client";

import React, { useState, useRef } from "react";
import { Box, Typography, Grid } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { useRouter } from "next/navigation";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { RichTextEditorRef } from "mui-tiptap";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { LEAVE_TYPE } from "../constants/leaveConstants";
import { createLeave } from "../services/leaveServices";
import FormHeader from "../../access/components/FormHeader";
import ReusableEditor from "@/app/component/richText/textEditor";
import { LeaveFormField } from "../interface/leaveInterface";

const ApplyLeave: React.FC = () => {
  const router = useRouter();
  const editorRef = useRef<RichTextEditorRef>(null);
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
    severity: "info" as "info" | "success" | "error" | "warning"
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
        severity: "error"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        reasons: editorRef.current?.editor?.getHTML() || formData.reasons
      };

      const response = await createLeave(payload);

      if (response && response.success) {
        setSnackbar({
          open: true,
          message: transleave("leavesubmit"),
          severity: "success"
        });

        // Wait a bit before navigating to show the success message
        setTimeout(() => {
          router.push("/leave");
        }, 1000);
      } else {
        throw new Error(response?.message);
      }
    } catch (error) {
      console.error("Error creating leave:", error);

      const errorMessage = transleave("failedsubmit");

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error"
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
        isSubmitting={isSubmitting}
      />
      <Box sx={{ pl: 2, pr: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormField
              label={transleave("fromdate")}
              type="date"
              placeholder="dd-mm-yyyy"
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
              placeholder="dd-mm-yyyy"
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
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
              {transleave("reason")}
            </Typography>
            <ReusableEditor
              ref={editorRef}
              placeholder={transleave("enterreason")}
              onSave={(html) => handleInputChange("reasons", html)}
              content={formData.reasons}
            />
            {errors.reasons && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {errors.reasons}
              </Typography>
            )}
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
