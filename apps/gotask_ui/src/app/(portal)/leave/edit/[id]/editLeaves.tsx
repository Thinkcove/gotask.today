"use client";
import React, { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { updateLeave, useGetLeaveById } from "../../services/leaveAction";
import { LEAVE_TYPE } from "@/app/common/constants/leave";
import { LeaveFormField } from "../../interface/leaveInterface";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import LeaveInputs from "../../component/leaveInput";
import FormHeader from "@/app/component/header/formHeader";

const EditLeave: React.FC = () => {
  const transleave = useTranslations(LOCALIZATION.TRANSITION.LEAVE);
  const router = useRouter();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: leave, isLoading } = useGetLeaveById(id as string, true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });
  const [formData, setFormData] = useState<LeaveFormField>({
    from_date: "",
    to_date: "",
    leave_type: LEAVE_TYPE.SICK,
    reasons: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Initialize formData with fetched leave data
  if (
    leave &&
    formData.from_date === "" &&
    formData.to_date === "" &&
    formData.leave_type === LEAVE_TYPE.SICK &&
    formData.reasons === ""
  ) {
    setFormData({
      from_date: leave.from_date ? new Date(leave.from_date).toISOString().split("T")[0] : "",
      to_date: leave.to_date ? new Date(leave.to_date).toISOString().split("T")[0] : "",
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
    if (formData.from_date && formData.to_date) {
      if (new Date(formData.from_date) > new Date(formData.to_date)) {
        newErrors.to_date = transleave("todateearlier");
      }
    }
    if (!formData.leave_type) newErrors.leave_type = transleave("leavetyperequired");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !id) return;
    setIsSubmitting(true);
    try {
      await updateLeave(id as string, formData);
      setSnackbar({
        open: true,
        message: transleave("leaveupdated"),
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
      setTimeout(() => {
        router.push("/leave");
      }, 1000);
    } catch (error: unknown) {
      // Type narrowing to ensure error has a message property
      const errorMessage =
        error instanceof Error &&
        error.message === "A leave request already exists for the specified date range"
          ? transleave("overlaperror")
          : transleave("errorupdate");
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: SNACKBAR_SEVERITY.ERROR
      });
      if (
        error instanceof Error &&
        error.message === "A leave request already exists for the specified date range"
      ) {
        setTimeout(() => {
          router.push("/leave");
        }, 1000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)"
        }}
      >
        <CircularProgress size={50} thickness={4} />
      </Box>
    );
  }

  return (
    <>
      <FormHeader
        isEdit={true}
        onCancel={() => router.back()}
        onSubmit={handleSubmit}
        editheading={transleave("editleave")}
        create={transleave("create")}
        cancel={transleave("cancel")}
        update={transleave("update")}
        showhistory={""}
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

export default EditLeave;
