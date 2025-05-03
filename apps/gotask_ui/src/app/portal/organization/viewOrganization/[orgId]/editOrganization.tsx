import { KeyedMutator } from "swr";
import { IOrganizationField, Organization } from "../../interfaces/organizatioinInterface";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import { useState } from "react";
import { Box } from "@mui/material";
import CommonDialog from "@/app/component/dialog/commonDialog";
import OrganizationInput from "../../components/organizationInputs";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { updateOrganization } from "../../services/organizationAction";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

interface EditOrganizationProps {
  data: IOrganizationField;
  open: boolean;
  onClose: () => void;
  OrganizationID: string;
  mutate: KeyedMutator<Organization>;  
}

const EditOrganization: React.FC<EditOrganizationProps> = ({
  data,
  open,
  onClose,
  OrganizationID,
  mutate
}) => {
  const transorganization = useTranslations(LOCALIZATION.TRANSITION.ORGANIZATION);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });
  const [formData, setFormData] = useState<IOrganizationField>(() => ({
    name: data?.name || "",
    address: data?.address || "",
    mail_id: data?.mail_id || "",
    projects: data?.projects || [],
    users: data?.users || []
  }));

  const handleChange = (name: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
     await updateOrganization(OrganizationID, formData);
      await mutate();
      setSnackbar({
        open: true,
        message: transorganization("successupdate"),
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
      onClose();
    } catch {
      setSnackbar({
        open: true,
         message: transorganization("errorupdate"),
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
      <Box
        sx={{
          position: "sticky",
          top: 0,
          px: 2,
          pt: 2,
          zIndex: 1000,
          flexDirection: "column",
          gap: 2
        }}
      ></Box>

      <CommonDialog open={open} onClose={onClose} onSubmit={handleSubmit} title={transorganization("edittitle")}>
        <OrganizationInput
          formData={formData}
          handleChange={handleChange}
          readOnlyFields={["name"]}
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

export default EditOrganization;
