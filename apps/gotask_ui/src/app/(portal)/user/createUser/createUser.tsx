"use client";
import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import moment from "moment-timezone";
import UserInput from "../components/userInputs"; 
import { createUser } from "../services/userAction"; 
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { IUserField } from "../interfaces/userInterface";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { validateEmail } from "@/app/common/utils/common";
import { ALPHANUMERIC_REGEX } from "../../../common/constants/regex";

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
  joined_date: "",
  password: ""
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
      if (formData.emp_id && !ALPHANUMERIC_REGEX.test(formData.emp_id)) {
        newErrors.emp_id = transuser("empid");
      }
  
      console.log("newerrors",newErrors)
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    const handleChange = (field: keyof IUserField, value: string | string[] | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };
  
  const handleSubmit = async () => {
      console.log("User creation handlesubmit")
      if (!validateForm()) return;
  
      try {
        const response = await createUser(formData); // <- now returns object with message
  
        if (response.success) {
          
          setSnackbar({
            open: true,
            message: transuser("successmessage"), //  i18n success message
            severity: SNACKBAR_SEVERITY.SUCCESS
          });
          
        } else {
          setSnackbar({
            open: true,
            message: response.message || transuser("errormessage"), // Show specific backend error
            severity: SNACKBAR_SEVERITY.ERROR
          });
        }
      } catch (error) {
        console.error("Create user error:", error);
        setSnackbar({
          open: true,
          message: transuser("errormessage"), // fallback error
          severity: SNACKBAR_SEVERITY.ERROR
        });
      }
    };
  
    const handleClose = () => {
      setFormData(initialFormState);
      setErrors({});
      
    };
  const router = useRouter();
    
  return (
    <Box sx={{ maxWidth: "1400px", mx: "auto", display: "flex", flexDirection: "column" }}>
      {/* Sticky Header */}
      <Box sx={{ position: "sticky", top: 0, px: 2, py: 2, zIndex: 1000, backgroundColor: "#fff" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#741B92" }}>
            {transuser("createusernew")}
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              sx={{
                borderRadius: "30px",
                color: "black",
                border: "2px solid #741B92",
                px: 2,
                textTransform: "none",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" }
              }}
              onClick={() => router.back()}
            >
              {transuser("cancelUser")}
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
                "&:hover": {
                  backgroundColor: "rgb(202, 187, 201)"
                }
              }}
              onClick={handleSubmit}
            >
              {transuser("createUser")}
            </Button>
          </Box>
        </Box>
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
        <UserInput formData={formData} handleChange={handleChange} errors={errors} />
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
