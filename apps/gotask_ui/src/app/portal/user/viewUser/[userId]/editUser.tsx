import { useState } from "react";
import { Box } from "@mui/material";
import CommonDialog from "@/app/component/dialog/commonDialog";
import { KeyedMutator } from "swr";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { IUserField, User } from "../../interfaces/userInterface";
import UserInput from "../../components/userInputs";
import { updateUser } from "../../services/userAction";

interface EditUserProps {
  data: IUserField;
  open: boolean;
  onClose: () => void;
  userID: string;
  mutate: KeyedMutator<User>;
}

const EditUser: React.FC<EditUserProps> = ({ data, open, onClose, userID, mutate }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const [formData, setFormData] = useState<IUserField>(() => ({
    name: data?.name || "",
    status: data?.status || true,
    organization: data?.organization || "",
    roleId: data?.roleId || "",
    user_id: data?.user_id || ""
  }));
  const handleChange = (field: keyof IUserField, value: string | string[]) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updateUser(userID, formData);
      await mutate();
      setSnackbar({
        open: true,
        message: "User updated successfully!",
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
      onClose();
    } catch {
      setSnackbar({
        open: true,
        message: "Error while updating user",
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

      <CommonDialog open={open} onClose={onClose} onSubmit={handleSubmit} title="Edit User">
        <UserInput
          formData={formData}
          handleChange={handleChange}
          readOnlyFields={["name"]}
          errors={{}}
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
