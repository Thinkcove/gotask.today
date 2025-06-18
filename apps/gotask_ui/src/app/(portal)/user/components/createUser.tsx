"use client";
import React, { useState } from "react";
import { KeyedMutator } from "swr";
import { IUserField, User } from "../interfaces/userInterface";
import CommonDialog from "@/app/component/dialog/commonDialog";
import UserInput from "./userInputs";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import { createUser } from "../services/userAction";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { ALPHANUMERIC_REGEX } from "../../../common/constants/regex";
import { validateEmail } from "@/app/common/utils/common";

interface CreateUserProps {
  open: boolean;
  onClose: () => void;
  mutate: KeyedMutator<User>;
}

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

const CreateUser = ({ open, onClose, mutate }: CreateUserProps) => {
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
    if (!formData.password) newErrors.password = transuser("userpwd");
    if (!formData.user_id) {
      newErrors.user_id = transuser("useremail");
    } else if (!validateEmail(formData.user_id)) {
      newErrors.user_id = transuser("validmail");
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
      const response = await createUser(formData); // <- now returns object with message

      if (response.success) {
        await mutate(); // refresh user list
        setSnackbar({
          open: true,
          message: transuser("successmessage"), //  i18n success message
          severity: SNACKBAR_SEVERITY.SUCCESS
        });
        onClose(); // close modal
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
    onClose();
  };

  return (
    <>
      <CommonDialog
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title={transuser("createuser")}
      >
        <UserInput
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          isEdit={true}
          readOnlyFields={["status"]}
        />
      </CommonDialog>
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default CreateUser;
