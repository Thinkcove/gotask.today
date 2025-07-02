"use client";

import { useState } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { KeyedMutator } from "swr";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { IUserField, User } from "../../interfaces/userInterface";
import UserInput from "../../components/userInputs";
import { updateUser } from "../../services/userAction";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { validateEmail } from "@/app/common/utils/common";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";

interface EditUserProps {
  data: IUserField;
  userID: string;
  mutate: KeyedMutator<User>;
}

const EditUser: React.FC<EditUserProps> = ({ data, userID, mutate }) => {
  const router = useRouter();
  const transuser = useTranslations(LOCALIZATION.TRANSITION.USER);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const [formData, setFormData] = useState<IUserField>({
    first_name: data.first_name || "",
    last_name: data.last_name || "",
    name: data.name || "",
    status: data.status ?? true,
    organization: data.organization || [],
    roleId: data.roleId || "",
    user_id: data.user_id || "",
    mobile_no: data.mobile_no || "",
    joined_date: data.joined_date || new Date(),
    emp_id: data.emp_id || ""
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.first_name) newErrors.first_name = transuser("firstname");
    if (!formData.last_name) newErrors.last_name = transuser("lastname");
    if (!formData.name) newErrors.name = transuser("username");
    if (!formData.roleId) newErrors.roleId = transuser("userrole");
    if (!formData.mobile_no) newErrors.mobile_no = transuser("mobileno");
    if (formData.status === undefined || formData.status === null)
      newErrors.status = transuser("userstatus");

    if (!formData.user_id) {
      newErrors.user_id = transuser("useremail");
    } else if (!validateEmail(formData.user_id)) {
      newErrors.user_id = transuser("validmail");
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setSnackbar({
        open: true,
        message: Object.values(newErrors).join("\n"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
      return false;
    }
    return true;
  };

  const handleChange = <K extends keyof IUserField>(field: K, value: IUserField[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await updateUser(userID, formData);
      await mutate();

      setSnackbar({
        open: true,
        message: transuser("updatesuccess"),
        severity: SNACKBAR_SEVERITY.SUCCESS
      });

      setTimeout(() => router.back(), 2000);
    } catch {
      setSnackbar({
        open: true,
        message: transuser("updateerror"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "1450px",
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh"
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton color="primary" onClick={() => router.back()}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#741B92" }}>
            {transuser("edituser")}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" onClick={() => router.back()} sx={{ borderRadius: 30 }}>
            {transuser("cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ borderRadius: 30, backgroundColor: "#741B92", fontWeight: "bold" }}
          >
            {transuser("save")}
          </Button>
        </Box>
      </Box>

      {/* General Info Form */}
      <Box sx={{ overflowX: "auto", width: "100%" }}>
        <UserInput
          formData={formData}
          handleChange={handleChange}
          readOnlyFields={["name"]}
          errors={errors}
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

export default EditUser;
