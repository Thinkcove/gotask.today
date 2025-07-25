"use client";
import { KeyedMutator } from "swr";
import { IRole, Role } from "../interfaces/roleInterface";
import { useState } from "react";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CommonDialog from "@/app/component/dialog/commonDialog";
import RoleInput from "./roleInputs";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { createRole } from "../services/roleAction";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

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
  const transrole = useTranslations(LOCALIZATION.TRANSITION.ROLE);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const [formData, setFormData] = useState<IRole>(initialFormState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = transrole("rolename");
    if (!formData.accessIds || formData.accessIds.length === 0) {
      newErrors.accessIds = transrole("selectaccess");
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
        message: transrole("successmessage"),
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
      handleClose();
    } catch {
      setSnackbar({
        open: true,
        message: transrole("errormessage"),
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
        title={transrole("createnewrole")}
        submitLabel={transrole("create")}
        cancelLabel={transrole("cancel")}
      >
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
