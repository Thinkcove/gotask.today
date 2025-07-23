"use client";
import React, { useState } from "react";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import UserInput from "../components/userInputs";
import { createUser } from "../services/userAction";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { IUserField } from "../interfaces/userInterface";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { validateEmail } from "@/app/common/utils/common";
import { ALPHANUMERIC_REGEX } from "../../../common/constants/regex";
import FormHeader from "@/app/component/header/formHeader";

const initialFormState: IUserField = {
  first_name: "",
  last_name: "",
  emp_id: "",
  name: "",
  status: true,
  organization: [],
  roleId: "",
  user_id: "",
  mobile_no: "",
  joined_date: ""
};

const CreateUser = () => {
  const transuser = useTranslations(LOCALIZATION.TRANSITION.USER);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });
  const [formData, setFormData] = useState<IUserField>(initialFormState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // Validate required fields
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.first_name) newErrors.first_name = transuser("firstname");
    if (!formData.last_name) newErrors.last_name = transuser("lastname");
    if (!formData.name) newErrors.name = transuser("username");
    if (!formData.mobile_no) newErrors.mobile_no = transuser("mobile_num");
    if (!formData.roleId) newErrors.roleId = transuser("userrole");
    if (formData.status === undefined || formData.status === null) {
      newErrors.status = transuser("userstatus");
    }

    if (!formData.user_id) {
      newErrors.user_id = transuser("useremail");
    } else if (!validateEmail(formData.user_id)) {
      newErrors.user_id = transuser("validmail");
    }
    if (!formData.joined_date) {
      newErrors.joined_date = transuser("joineddate");
    }

    if (formData.emp_id && !ALPHANUMERIC_REGEX.test(formData.emp_id)) {
      newErrors.emp_id = transuser("empid");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (field: keyof IUserField, value: string | string[] | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await createUser(formData);

      if (response.success) {
        setSnackbar({
          open: true,
          message: transuser("successmessage"),
          severity: SNACKBAR_SEVERITY.SUCCESS
        });

        // Navigate to user list after showing success
        setTimeout(() => {
          router.push("/user");
        }, 1500);
      } else {
        setSnackbar({
          open: true,
          message: response.message || transuser("errormessage"),
          severity: SNACKBAR_SEVERITY.ERROR
        });
      }
    } catch (error) {
      console.error("Create user error:", error);
      setSnackbar({
        open: true,
        message: transuser("errormessage"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  const router = useRouter();
  const handleBack = () => router.back();
  return (
    <Box sx={{ maxWidth: "1400px", mx: "auto", display: "flex", flexDirection: "column" }}>
      {/* Sticky Header */}
      <Box sx={{ position: "sticky", top: 0, px: 2, py: 2, zIndex: 1000, backgroundColor: "#fff" }}>

        <FormHeader
          isEdit={false}
          onCancel={handleBack}
          onSubmit={handleSubmit}
          createHeading={transuser("createusernew")}
          create={transuser("createUser")}
          cancel={transuser("cancelUser")}
        />
      </Box>

      {/* Input Form */}
      <Box
        sx={{
          px: 2,
          pb: 2,
          maxHeight: "calc(100vh - 150px)",
          overflowY: "auto"
        }}
      >
        <UserInput
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          readOnlyFields={["status"]}
        />
      </Box>

      {/* Snackbar */}
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default CreateUser;
