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

interface CreateUserProps {
  open: boolean;
  onClose: () => void;
  mutate: KeyedMutator<User>;
}

const initialFormState: IUserField = {
  name: "",
  status: true,
  organization: [],
  roleId: "",
  user_id: "",
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
    if (!formData.name) newErrors.name = transuser("username");
    if (!formData.roleId) newErrors.roleId = transuser("userrole");
    if (!formData.status) newErrors.status = transuser("userstatus");
    if (!formData.user_id) newErrors.user_id = transuser("useremail");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (field: keyof IUserField, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      await createUser(formData);
      await mutate();
      setSnackbar({
        open: true,
        message: transuser("successmessage"),
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
      onClose();
    } catch {
      setSnackbar({
        open: true,
        message: transuser("errormessage"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  return (
    <>
      <CommonDialog open={open} onClose={onClose} onSubmit={handleSubmit} title={transuser("createuser")}>
        <UserInput formData={formData} handleChange={handleChange} errors={errors} isEdit={true} />
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
