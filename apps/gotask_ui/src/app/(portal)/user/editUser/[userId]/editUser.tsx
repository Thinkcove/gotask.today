import { useState } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { KeyedMutator } from "swr";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { IUserField, User, ISkill } from "../../interfaces/userInterface";
import UserInput from "../../components/userInputs";
import SkillInput from "../../components/skillInput"; 
import { updateUser } from "../../services/userAction";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { validateEmail } from "@/app/common/utils/common";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";


interface EditUserProps {
  data: IUserField;
  userID: string;
  mutate: KeyedMutator<User>;
}

const EditUser: React.FC<EditUserProps> = ({ data, userID, mutate }) => {
  const router = useRouter();
  const transuser = useTranslations(LOCALIZATION.TRANSITION.USER);
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
    organization: data?.organization || [],
    roleId: data?.roleId || "",
    user_id: data?.user_id || "",
    mobile_no: data?.mobile_no || "",
    joined_date: data?.joined_date || new Date(),
    emp_id: data?.emp_id || "",
    skills: data?.skills || [] 
    
  }));

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.first_name) newErrors.first_name = transuser("firstname");
    if (!formData.last_name) newErrors.last_name = transuser("lastname");
    if (!formData.name) newErrors.name = transuser("username");
    if (!formData.roleId) newErrors.roleId = transuser("userrole");

    if (formData.status === undefined || formData.status === null)
      newErrors.status = transuser("userstatus");

    if (!formData.user_id) {
      newErrors.user_id = transuser("useremail");
    } else if (!validateEmail(formData.user_id)) {
      newErrors.user_id = transuser("validmail");
    }

    formData.skills?.forEach((skill, idx) => {
      const requiresExp = skill.proficiency >= 3;

      if (requiresExp && (!skill.experience || skill.experience <= 0)) {
        newErrors[`skill_${idx}`] =
          `Experience required for "${skill.name}" when proficiency is 3 or 4 in work exposure or training`;
      } else if (skill.experience !== undefined && skill.experience <= 0) {
        newErrors[`skill_${idx}`] = `Experience must be a positive number for "${skill.name}"`;
      }
    });
    if (formData.skills?.length === 0) {
      newErrors.skills = transuser("userskill");
    }
    const names = formData.skills?.map((s) => s.name.toLowerCase());
    const hasDuplicates = names?.some((name, idx) => names.indexOf(name) !== idx);
    if (hasDuplicates) newErrors["skills"] = "Duplicate skills are not allowed.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof IUserField, value: string | string[] | boolean) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSkillsChange = (updatedSkills: ISkill[]) => {
    setFormData((prevData) => ({ ...prevData, skills: updatedSkills }));
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
      setTimeout(() => router.back(), 2000);
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
    maxWidth: "1450px",
    margin: "0 auto",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    overflowY: "auto",
    paddingBottom: 4
  }}
>

      
      <Box sx={{ position: "sticky", top: 0, pt: 2, zIndex: 1000 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton color="primary" onClick={() => router.back()}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#741B92" }}>
              {transuser("edituser")}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              sx={{ borderRadius: "30px", color: "black", border: "2px solid #741B92", px: 2 }}
              onClick={() => router.back()}
            >
              {transuser("cancel")}
            </Button>
            <Button
              variant="contained"
              sx={{ borderRadius: "30px", backgroundColor: "#741B92", px: 2, fontWeight: "bold" }}
              onClick={handleSubmit}
            >
              {transuser("save")}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* User Basic Inputs */}
      <UserInput
        formData={formData}
        handleChange={handleChange}
        readOnlyFields={["name"]}
        errors={errors}
      />

      <Box mt={4}>
        <SkillInput userId={userID} skills={formData.skills || []} onChange={handleSkillsChange} />
        {errors.skills && (
          <Typography color="error" mt={1}>
            {errors.skills}
          </Typography>
        )}
        {Object.keys(errors)
          .filter((k) => k.startsWith("skill_"))
          .map((key) => (
            <Typography key={key} color="error" mt={1}>
              {errors[key]}
            </Typography>
          ))}
      </Box>

      {/*  Snackbar */}
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
