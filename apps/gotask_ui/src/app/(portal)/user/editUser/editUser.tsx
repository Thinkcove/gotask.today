"use client";

import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import UserInput from "@/app/(portal)/user/components/userInputs";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { IUserField, User } from "@/app/(portal)/user/interfaces/userInterface";
import { updateUser } from "@/app/(portal)/user/services/userAction";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { validateEmail } from "@/app/common/utils/common";
import { KeyedMutator } from "swr";

interface EditUserProps {
  data: IUserField;
  userID: string;
  mutate: KeyedMutator<User>;
}

const EditUser: React.FC<EditUserProps> = ({ data, userID, mutate }) => {
  const transuser = useTranslations(LOCALIZATION.TRANSITION.USER);
  const router = useRouter();

  const [formData, setFormData] = useState<IUserField>(() => ({
    first_name: data.first_name || "",
    last_name: data.last_name || "",
    name: data.name || "",
    status: data.status ?? true,
    organization: data.organization || "",
    roleId: data.roleId || "",
    user_id: data.user_id || "",
    mobile_no: data.mobile_no || "",
    joined_date: data.joined_date || new Date(),
    emp_id: data.emp_id || ""
  }));
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.first_name) newErrors.first_name = transuser("firstname");
    if (!formData.last_name) newErrors.last_name = transuser("lastname");
    if (!formData.name) newErrors.name = transuser("username");
    if (!formData.roleId) newErrors.roleId = transuser("userrole");
    if (formData.status === undefined || formData.status === null)
      newErrors.status = transuser("userstatus");
    if (!formData.user_id) newErrors.user_id = transuser("useremail");
    else if (!validateEmail(formData.user_id)) newErrors.user_id = transuser("validmail");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof IUserField, value: string | string[] | boolean) => {
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

      setTimeout(() => {
        router.push(`/user/viewUser/${userID}`);
      }, 1500);
    } catch {
      setSnackbar({
        open: true,
        message: transuser("updateerror"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  return (
    <Box sx={{ maxWidth: "1400px", mx: "auto", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box sx={{ position: "sticky", top: 0, px: 2, py: 2, zIndex: 1000, backgroundColor: "#fff" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#741B92" }}>
            {transuser("edituser")}
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => router.back()}
              sx={{
                borderRadius: "30px",
                color: "black",
                border: "2px solid #741B92",
                px: 2,
                textTransform: "none",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" }
              }}
            >
              {transuser("cancelUser")}
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                borderRadius: "30px",
                backgroundColor: "#741B92",
                color: "white",
                px: 2,
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "rgb(202, 187, 201)"
                }
              }}
            >
              {transuser("updateuser")}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Form */}
      <Box sx={{ px: 2, pb: 2, maxHeight: "calc(100vh - 150px)", overflowY: "auto" }}>
        <UserInput
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          readOnlyFields={["name"]}
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
