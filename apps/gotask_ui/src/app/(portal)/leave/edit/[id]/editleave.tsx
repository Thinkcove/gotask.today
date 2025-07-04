"use client";
import React, { useState, useRef } from "react";
import { Box, Typography, Grid } from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import FormField from "@/app/component/input/formField";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { RichTextEditorRef } from "mui-tiptap";
import ReusableEditor from "@/app/component/richText/textEditor";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { updateLeave, useGetLeaveById } from "../../services/leaveServices";
import { LEAVE_TYPE } from "../../constants/leaveConstants";
import FormHeader from "@/app/(portal)/access/components/FormHeader";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef<RichTextEditorRef>(null);
  const { data: leave, isLoading, isError } = useGetLeaveById(id as string, true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" as "info" | "success" | "error" | "warning"
  });

  const [formData, setFormData] = useState<LeaveFormField>({
    from_date: "",
    to_date: "",
    leave_type: LEAVE_TYPE.SICK,
    reasons: ""
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  if (
    leave &&
    formData.from_date === "" &&
    formData.to_date === "" &&
    formData.leave_type === LEAVE_TYPE.SICK &&
    formData.reasons === ""
  ) {
    setFormData({
      from_date: leave.from_date,
      to_date: leave.to_date,
      leave_type: leave.leave_type,
      reasons: leave.reasons || ""
    });
  }

  const handleInputChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.from_date) newErrors.from_date = transleave("fromdaterequired");
    if (!formData.to_date) newErrors.to_date = transleave("todaterequired");
    if (new Date(formData.from_date) > new Date(formData.to_date)) {
      newErrors.to_date = transleave("todateearlier");
    }
    if (!formData.leave_type) newErrors.leave_type = transleave("leavetyperequired");
    if (!formData.reasons || editorRef.current?.editor?.getText().trim() === "") {
      newErrors.reasons = transleave("reasonrequired");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !id) return;
    setIsSubmitting(true);

    try {
      const reason = editorRef.current?.editor?.getHTML() || formData.reasons;
      const payload = {
        ...formData,
        reasons: reason
      };
      await updateLeave(id as string, payload);
      setSnackbar({
        open: true,
        message: transleave("leaveupdated"),
        severity: "success"
      });
      router.push("/leave");
    } catch (error) {
      console.error("Failed to update", error);
      setSnackbar({
        open: true,
        message: transleave("errorupdate"),
        severity: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div>{transleave("loading")}</div>;
  if (isError || !leave) return <div>{transleave("errorloading")}</div>;

  return (
    <>
      <FormHeader
        isEdit={true}
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
              placeholder={transleave("dateformat")}
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
              placeholder={transleave("dateformat")}
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
              placeholder={transleave("sickc")}
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
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" sx={{ mb: 1, fontWeight: "medium" }}>
            {transleave("reason")}
            <span style={{ color: "red" }}>*</span>
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

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default EditLeave;
