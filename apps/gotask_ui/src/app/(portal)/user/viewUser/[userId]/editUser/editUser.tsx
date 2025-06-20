"use client";

import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import UserInput from "@/app/(portal)/user/components/userInputs";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { IUserField } from "@/app/(portal)/user/interfaces/userInterface";
import { getUserById, updateUser } from "@/app/(portal)/user/services/userAction";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { validateEmail } from "@/app/common/utils/common";

const EditUser = () => {
  const transuser = useTranslations(LOCALIZATION.TRANSITION.USER);
  const router = useRouter();
  const { userId } = useParams();

  const [formData, setFormData] = useState<IUserField | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const fetchUser = async () => {
    try {
      const response = await getUserById(userId as string);
      setFormData(response);
    } catch (err) {
      setSnackbar({
        open: true,
        message: transuser("fetcherror"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData?.first_name) newErrors.first_name = transuser("firstname");
    if (!formData?.last_name) newErrors.last_name = transuser("lastname");
    if (!formData?.name) newErrors.name = transuser("username");
    if (!formData?.roleId) newErrors.roleId = transuser("userrole");
    if (!formData?.user_id) newErrors.user_id = transuser("useremail");
    else if (!validateEmail(formData.user_id)) newErrors.user_id = transuser("validmail");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof IUserField, value: string | string[] | boolean) => {
    if (!formData) return;
    setFormData((prev) => ({ ...prev!, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData || !validateForm()) return;

    try {
      await updateUser(userId as string, formData);
      setSnackbar({
        open: true,
        message: transuser("updatesuccess"),
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
      setTimeout(() => {
        router.push("/user");
      }, 1500);
    } catch {
      setSnackbar({
        open: true,
        message: transuser("updateerror"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  if (!formData) {
    return (
      <Box p={4}>
        <Typography>{transuser("loading")}</Typography>
      </Box>
    );
  }

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
          isEdit={true}
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
