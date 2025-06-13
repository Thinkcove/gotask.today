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
import { validateEmail, validatePhone } from "@/app/common/utils/common";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { APPLICATIONS, ACTIONS } from "@/app/common/utils/authCheck";
import { ORGANIZATION_FORM_FIELDS } from "@/app/common/constants/organizationFields";


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
  const { isFieldRestricted } = useUserPermission();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const [formData, setFormData] = useState<IOrganizationField>(() => ({
    name: data?.name || "",
    address: data?.address || "",
    mail_id: data?.mail_id || "",
    mobile_no: data?.mobile_no || "",
    projects: data?.projects || [],
    users: data?.users || []
  }));

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 🔐 Dynamically compute restricted fields
  const readOnlyFields = ORGANIZATION_FORM_FIELDS.filter((field) =>
    isFieldRestricted(APPLICATIONS.ORGANIZATION, ACTIONS.UPDATE, field)
  );

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = transorganization("errorname");
    if (!formData.address) newErrors.address = transorganization("erroraddress");

    if (!formData.mail_id) {
      newErrors.mail_id = transorganization("errormail");
    } else if (!validateEmail(formData.mail_id)) {
      newErrors.mail_id = transorganization("errormailvalid");
    }

    if (!formData.mobile_no) {
      newErrors.mobile_no = transorganization("errorphone");
    } else if (!validatePhone(formData.mobile_no)) {
      newErrors.mobile_no = transorganization("errorphonevalid");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name: string, value: string) => {
    if (!isFieldRestricted(APPLICATIONS.ORGANIZATION, ACTIONS.UPDATE, name)) {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

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
      <CommonDialog
        open={open}
        onClose={onClose}
        onSubmit={handleSubmit}
        title={transorganization("edittitle")}
      >
        <OrganizationInput
          formData={formData}
          handleChange={handleChange}
          readOnlyFields={readOnlyFields} // 👈 Now dynamically passed
          errors={errors}
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
