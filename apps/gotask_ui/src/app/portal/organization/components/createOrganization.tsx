"use client";
import React, { useState } from "react";
import CommonDialog from "@/app/component/dialog/commonDialog";
import OrganizationInput from "./organizationInputs";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import { IOrganizationField, Organization } from "../interfaces/organizatioinInterface";
import { KeyedMutator } from "swr";
import { createOrganization } from "../services/organizationAction";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

interface CreateOrgProps {
  open: boolean;
  onClose: () => void;
  mutate: KeyedMutator<Organization>;
}

const initialFormState: IOrganizationField = {
  name: "",
  address: "",
  mail_id: "",
  projects: [],
  users: []
};
const CreateOrganization = ({ open, onClose, mutate }: CreateOrgProps) => {
  const transorganization = useTranslations(LOCALIZATION.TRANSITION.ORGANIZATION);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const [formData, setFormData] = useState<IOrganizationField>(initialFormState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // Validate required fields
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name =  transorganization("errorName");
    if (!formData.mail_id) newErrors.mail_id = transorganization("errorMail");
    if (!formData.address) newErrors.address = transorganization("errorAddress");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (field: keyof IOrganizationField, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      await createOrganization(formData);
      await mutate();
      setSnackbar({
        open: true,
        message: transorganization("successCreate"),
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
      onClose();
    } catch { 
      setSnackbar({
        open: true,
        message: transorganization("errorCreate"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };
  return (
    <>
      <CommonDialog
        open={open}
        onClose={onClose}
        onSubmit={handleSubmit}
        title={transorganization("createTitle")}
      >
        <OrganizationInput formData={formData} handleChange={handleChange} errors={errors} />
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

export default CreateOrganization;
