import { useState } from "react";
import { Box } from "@mui/material";
import CommonDialog from "@/app/component/dialog/commonDialog";
import { KeyedMutator } from "swr";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { IUserField, User } from "../../interfaces/userInterface";
import UserInput from "../../components/userInputs";
import { updateUser } from "../../services/userAction";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { validateEmail } from "@/app/common/utils/common";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { APPLICATIONS, ACTIONS } from "@/app/common/utils/authCheck";

interface EditUserProps {
  data: IUserField;
  open: boolean;
  onClose: () => void;
  userID: string;
  mutate: KeyedMutator<User>;
}

const EditUser: React.FC<EditUserProps> = ({ data, open, onClose, userID, mutate }) => {
  const transuser = useTranslations(LOCALIZATION.TRANSITION.USER);
  const { isFieldRestricted } = useUserPermission();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const [formData, setFormData] = useState<IUserField>(() => ({
    first_name: data?.first_name || "",
    last_name: data?.last_name || "",
    name: data?.name || "",
    status: data?.status || true,
    organization: data?.organization || "",
    roleId: data?.roleId || "",
    user_id: data?.user_id || "",
    mobile_no: data?.mobile_no || "",
    joined_date: data?.joined_date || new Date(),
    emp_id: data?.emp_id || ""
  }));

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Dynamically calculate readOnlyFields based on user permission
  const readOnlyFields: (keyof IUserField)[] = Object.keys(formData).filter((field) =>
    isFieldRestricted(APPLICATIONS.USER, ACTIONS.UPDATE, field)
  ) as (keyof IUserField)[];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.first_name) newErrors.first_name = transuser("firstname");
    if (!formData.last_name) newErrors.last_name = transuser("lastname");
    if (!formData.name) newErrors.name = transuser("username");
    if (!formData.roleId) newErrors.roleId = transuser("userrole");
    if (formData.status === undefined || formData.status === null) {
      newErrors.status = transuser("userstatus");
    }
    if (!formData.user_id) {
      newErrors.user_id = transuser("useremail");
    } else if (!validateEmail(formData.user_id)) {
      newErrors.user_id = transuser("validmail");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof IUserField, value: string | string[] | boolean) => {
    if (readOnlyFields.includes(field)) return;
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      await updateUser(userID, formData);
      await mutate();
      setSnackbar({
        open: true,
        message: transuser("updatesuccess"),
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
      onClose();
    } catch {
      setSnackbar({
        open: true,
        message: transuser("updateerror"),
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
        title={transuser("edituser")}
      >
        <UserInput
          formData={formData}
          handleChange={handleChange}
          readOnlyFields={readOnlyFields}
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

export default EditUser;
