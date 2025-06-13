"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import CommonDialog from "@/app/component/dialog/commonDialog";
import ProjectInput from "../../components/projectInputs";
import { updateProject } from "../../services/projectAction";
import { KeyedMutator } from "swr";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { IProjectField, Project, PROJECT_STATUS } from "../../interfaces/projectInterface";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { APPLICATIONS, ACTIONS } from "@/app/common/utils/authCheck";
import { PROJECT_FORM_FIELDS } from "@/app/common/constants/projectFields";


interface EditProjectProps {
  data: IProjectField;
  open: boolean;
  onClose: () => void;
  projectID: string;
  mutate: KeyedMutator<Project>;
}

const EditProject: React.FC<EditProjectProps> = ({ data, open, onClose, projectID, mutate }) => {
  const transproject = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);
  const { isFieldRestricted } = useUserPermission();

  const [formData, setFormData] = useState<IProjectField>(() => ({
    name: data?.name || "",
    description: data?.description || "",
    status: data?.status || PROJECT_STATUS.TO_DO,
    organization_id: data?.organization_id || ""
  }));

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Build readOnlyFields dynamically
  const readOnlyFields = PROJECT_FORM_FIELDS.filter((field) =>
    isFieldRestricted(APPLICATIONS.PROJECT, ACTIONS.UPDATE, field)
  );

  // Handle change only if not restricted
  const handleChange = (name: string, value: string) => {
    if (!isFieldRestricted(APPLICATIONS.PROJECT, ACTIONS.UPDATE, name)) {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = transproject("Projecttitle");
    if (!formData.description) newErrors.description = transproject("description");
    if (!formData.status) newErrors.status = transproject("status");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const updatedFields: Partial<IProjectField> = {};

      const checkAndUpdate = (field: keyof IProjectField) => {
        if (
          !isFieldRestricted(APPLICATIONS.PROJECT, ACTIONS.UPDATE, field) &&
          formData[field] !== data[field]
        ) {
          updatedFields[field] = formData[field];
        }
      };

      checkAndUpdate("name");
      checkAndUpdate("description");
      checkAndUpdate("status");
      checkAndUpdate("organization_id");

      if (Object.keys(updatedFields).length > 0) {
        await updateProject(projectID, updatedFields);
        await mutate();

        setSnackbar({
          open: true,
          message: transproject("updatesuccess"),
          severity: SNACKBAR_SEVERITY.SUCCESS
        });

        onClose();
      } else {
        setSnackbar({
          open: true,
          message: transproject("noupdates"),
          severity: SNACKBAR_SEVERITY.INFO
        });
      }
    } catch {
      setSnackbar({
        open: true,
        message: transproject("updateerror"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "1400px",
        margin: "0 auto",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
      }}
    >
      <CommonDialog
        open={open}
        onClose={onClose}
        onSubmit={handleSubmit}
        title={transproject("edittitle")}
      >
        <ProjectInput
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          readOnlyFields={readOnlyFields}
        />
      </CommonDialog>

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default EditProject;
