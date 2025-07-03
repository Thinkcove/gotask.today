"use client";

import React, { useState,useRef } from "react";
import { Button, Box, Typography, Grid } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { LEAVE_TYPE } from "../constants/leaveConstants";
import { useRouter } from "next/navigation";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { createLeave } from "../services/leaveServices";
import ReusableEditor from "@/app/component/richText/textEditor";
import { RichTextEditorRef } from "mui-tiptap";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";


interface LeaveFormField {
  from_date: string;
  to_date: string;
  leave_type: string;
   reasons: string;
}

const ApplyLeave: React.FC = () => {
  const router = useRouter();
   const editorRef = useRef<RichTextEditorRef>(null);
  const [formData, setFormData] = useState<LeaveFormField>({
    from_date: "",
    to_date: "",
    leave_type: LEAVE_TYPE.SICK,
    reasons: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" as "info" | "success" | "error" | "warning",
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.from_date) {
      newErrors.from_date = "From Date is required";
    }
    
    if (!formData.to_date) {
      newErrors.to_date = "To Date is required";
    }
    
    if (formData.from_date && formData.to_date) {
      const fromDate = new Date(formData.from_date);
      const toDate = new Date(formData.to_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (fromDate < today) {
        newErrors.from_date = "From Date cannot be in the past";
      }
      
      if (fromDate > toDate) {
        newErrors.to_date = "To Date cannot be earlier than From Date";
      }
    }
    
    if (!formData.leave_type) {
      newErrors.leave_type = "Leave Type is required";
    }
    if (!formData.reasons || editorRef.current?.editor?.getText().trim() === "") {
      newErrors.reasons = "Reasons field is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "Please fix the validation errors",
        severity: "error",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
          const payload = {
        ...formData,
        reasons: editorRef.current?.editor?.getHTML() ?? "",
      };
      console.log("Submitting leave data:", payload);
      
      const response = await createLeave(payload);
      
      console.log("Create leave response:", response);
      
      if (response && response.success) {
        setSnackbar({
          open: true,
          message: "Leave application submitted successfully",
          severity: "success",
        });
        
        // Wait a bit before navigating to show the success message
        setTimeout(() => {
          router.push("/leave/leaves");
        }, 1000);
      } else {
        throw new Error(response?.message || "Failed to create leave");
      }
    } catch (error: any) {
      console.error("Error creating leave:", error);
      
      let errorMessage = "Failed to submit leave application";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

   const transleave = useTranslations(LOCALIZATION.TRANSITION.LEAVE);
  

  return (
    <Box
      sx={{
        maxWidth: "800px",
        margin: "0 auto",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          px: 2,
          py: 2,
          zIndex: 1000,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#741B92" }}>
            {transleave("applyleave")}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              sx={{
                borderRadius: "30px",
                color: "black",
                border: "2px solid #741B92",
                px: 2,
                textTransform: "none",
              }}
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
            {transleave("cancel")}
            </Button>
            <Button
              variant="contained"
              sx={{
                borderRadius: "30px",
                backgroundColor: "#741B92",
                color: "white",
                px: 2,
                textTransform: "none",
                fontWeight: "bold",
              }}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Box
          sx={{
            px: 2,
            pb: 2,
            maxHeight: "calc(100vh - 150px)",
            overflowY: "auto",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormField
                label={transleave("fromdate")}
                type="date"
                placeholder="dd-mm-yyyy"
                value={formData.from_date}
                onChange={(value) => {
                  const dateValue = value instanceof Date ? value.toISOString().split("T")[0] : String(value);
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
                  const dateValue = value instanceof Date ? value.toISOString().split("T")[0] : String(value);
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
                onChange={(value) => handleInputChange("leave_type", String(value).charAt(0).toUpperCase() + String(value).slice(1).toLowerCase())}
                error={errors.leave_type}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: "medium" }}>
                {transleave("reason")} <span style={{ color: "red" }}>*</span>
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
      </Box>

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default ApplyLeave;