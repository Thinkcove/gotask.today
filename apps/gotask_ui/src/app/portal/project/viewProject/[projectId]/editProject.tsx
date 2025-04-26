import { IProjectField, Project, PROJECT_STATUS } from "../../interfaces/projectInterface";
import { useState } from "react";
import { Box } from "@mui/material";
import CommonDialog from "@/app/component/dialog/commonDialog";
import ProjectInput from "../../components/projectInputs";
import { updateProject } from "../../services/projectAction";
import { KeyedMutator } from "swr";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";

interface EditTaskProps {
  data: IProjectField;
  open: boolean;
  onClose: () => void;
  projectID: string;
  mutate: KeyedMutator<Project>;
}

const EditProject: React.FC<EditTaskProps> = ({ data, open, onClose, projectID, mutate }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });
  const [formData, setFormData] = useState<IProjectField>(() => ({
    name: data?.name || "",
    description: data?.description || "",
    status: data?.status || PROJECT_STATUS.TO_DO,
    organization_id: data?.organization_id || ""
  }));

  const handleChange = (name: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updateProject(projectID, formData);
      await mutate();
      setSnackbar({
        open: true,
        message: "Project updated successfully!",
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
      onClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error while updating project",
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

      <CommonDialog open={open} onClose={onClose} onSubmit={handleSubmit} title="Edit Project">
        <ProjectInput formData={formData} handleChange={handleChange} />
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
