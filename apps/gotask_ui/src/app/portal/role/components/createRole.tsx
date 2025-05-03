"use client";
import { KeyedMutator } from "swr";
import { IRole, Role } from "../interfaces/roleInterface";
import { useState } from "react";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CommonDialog from "@/app/component/dialog/commonDialog";
import RoleInput from "./roleInputs";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { createRole } from "../services/roleAction";

interface CreateRoleProps {
  open: boolean;
  onClose: () => void;
  mutate: KeyedMutator<Role>;
}

const initialFormState: IRole = {
  name: "",
  accessIds: []
};
const CreateRole = ({ open, onClose, mutate }: CreateRoleProps) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const [formData, setFormData] = useState<IRole>(initialFormState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // Validate required fields
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Role Name is required";
    if (!formData.accessIds || formData.accessIds.length === 0) {
      newErrors.accessIds = "Select at least one Access";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (field: keyof IRole, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      await createRole(formData);
      await mutate();
      setSnackbar({
        open: true,
        message: "Role created successfully!",
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
      onClose();
    } catch {
      setSnackbar({
        open: true,
        message: "Error while creating Role",
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };
  return (
    <>
      <CommonDialog open={open} onClose={onClose} onSubmit={handleSubmit} title="Create New Role">
        <RoleInput formData={formData} handleChange={handleChange} errors={errors} />
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

export default CreateRole;
