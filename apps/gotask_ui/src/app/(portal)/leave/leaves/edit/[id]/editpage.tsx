"use client";
import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import FormField from "@/app/component/input/formField";
import { LEAVE_TYPE } from "../../constants/leaveConstants";
import { useGetLeaveById, updateLeave } from "../../services/leaveServices";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { RichTextEditorRef } from "mui-tiptap";
import ReusableEditor from "@/app/component/richText/textEditor";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

interface LeaveFormField {
  from_date: string;
  to_date: string;
  leave_type: string;
   reasons: string;
}




const EditLeave: React.FC = () => {
     const transleave = useTranslations(LOCALIZATION.TRANSITION.LEAVE);
  const router = useRouter();
  const { id } = useParams();
   const editorRef = useRef<RichTextEditorRef>(null);
  const { data: leave, isLoading, isError } = useGetLeaveById(id as string, true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" as "info" | "success" | "error" | "warning",
  });

  const [formData, setFormData] = useState<LeaveFormField>({
    from_date: "",
    to_date: "",
    leave_type: LEAVE_TYPE.SICK,
     reasons: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (leave) {
      setFormData({
        from_date: leave.from_date,
        to_date: leave.to_date,
        leave_type: leave.leave_type,
         reasons: leave.reasons || "",
      });
    }
  }, [leave]);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
      if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.from_date) newErrors.from_date = "From Date is required";
    if (!formData.to_date) newErrors.to_date = "To Date is required";
    if (new Date(formData.from_date) > new Date(formData.to_date)) {
      newErrors.to_date = "To Date cannot be earlier than From Date";
    }
    if (!formData.leave_type) newErrors.leave_type = "Leave Type is required";
     if (!formData.reasons || editorRef.current?.editor?.getText().trim() === "") {
      newErrors.reasons = "Reasons field is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !id) return;

    try {
         const payload = {
        ...formData,
        reasons: editorRef.current?.editor?.getHTML() ?? "",
      };
      await updateLeave(id as string, payload);
      setSnackbar({
        open: true,
        message: "Leave updated successfully",
        severity: "success",
      });
      router.push("/leave/leaves");
    } catch (e) {
      setSnackbar({
        open: true,
        message: "Error updating leave",
        severity: "error",
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || !leave) return <div>Error loading leave</div>;

 
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
            {transleave("editleave")}
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
            >
              {transleave("save")}
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
                onChange={(value) =>
                  handleInputChange(
                    "from_date",
                    value instanceof Date ? value.toISOString().split("T")[0] : String(value)
                  )
                }
                error={errors.from_date}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label={transleave("todate")}
                type="date"
                placeholder="dd-mm-yyyy"
                value={formData.to_date}
                onChange={(value) =>
                  handleInputChange(
                    "to_date",
                    value instanceof Date ? value.toISOString().split("T")[0] : String(value)
                  )
                }
                error={errors.to_date}
              />
            </Grid>
            <Grid item xs={12}>
              <FormField
                label={transleave("leavetype")}
                type="select"
                options={Object.values(LEAVE_TYPE).map((s) => s.toUpperCase())}
                required
                placeholder="SICK"
                value={formData.leave_type.toUpperCase()}
                onChange={(value) => handleInputChange("leave_type", String(value).charAt(0).toUpperCase() + String(value).slice(1).toLowerCase())}
                error={errors.leave_type}
              />
            </Grid>
             </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: "medium" }}>
                {transleave("reason")}<span style={{ color: "red" }}>*</span>
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

export default EditLeave;