import { useState } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { KeyedMutator } from "swr";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { IUserField, User, ISkill } from "../../interfaces/userInterface";
import UserInput from "../../components/userInputs";
import SkillInput from "../../components/skillInput";
import { addUserSkills, updateUser } from "../../services/userAction";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { validateEmail } from "@/app/common/utils/common";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Toggle from "@/app/component/toggle/toggle";

interface EditUserProps {
  data: IUserField;
  userID: string;
  mutate: KeyedMutator<User>;
}

const EditUser: React.FC<EditUserProps> = ({ data, userID, mutate }) => {
  const router = useRouter();
  const transuser = useTranslations(LOCALIZATION.TRANSITION.USER);
  const [activeSection, setActiveSection] = useState<
    "General" | "Skills" | "Certificates" | "Increment"
  >("General");
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

    // Basic info validation
    if (!formData.first_name) newErrors.first_name = transuser("firstname");
    if (!formData.last_name) newErrors.last_name = transuser("lastname");
    if (!formData.name) newErrors.name = transuser("username");
    if (!formData.roleId) newErrors.roleId = transuser("userrole");
    if (!formData.mobile_no) newErrors.mobile_no = transuser("mobileno");

    if (!formData.user_id) {
      newErrors.user_id = transuser("useremail");
    } else if (!validateEmail(formData.user_id)) {
      newErrors.user_id = transuser("validmail");
    }

    if (formData.skills && formData.skills.length > 0) {
      const names = formData.skills.map((s) => s.name.toLowerCase());
      const hasDuplicates = names.some((name, idx) => names.indexOf(name) !== idx);
      if (hasDuplicates) {
        newErrors["skills"] = transuser("duplicateskills");
      }

      formData.skills.forEach((skill, idx) => {
        if (!skill.proficiency || skill.proficiency === 0) {
          newErrors[`skill_${idx}`] = transuser("proficiencyrequired", {
            skill: skill.name
          });
        } else if (skill.proficiency >= 3 && (!skill.experience || skill.experience <= 0)) {
          newErrors[`skill_${idx}`] = transuser("experiencerequired", {
            skill: skill.name
          });
        } else if (skill.experience !== undefined && skill.experience <= 0) {
          newErrors[`skill_${idx}`] = transuser("experiencepositive", {
            skill: skill.name
          });
        }
      });
    }

    setErrors(newErrors);

    // Show snackbar if there are any errors
    if (Object.keys(newErrors).length > 0) {
      const errorMessages = Object.values(newErrors).join("\n");
      setSnackbar({
        open: true,
        message: errorMessages,
        severity: SNACKBAR_SEVERITY.ERROR
      });
      return false;
    }

    return true;
  };

  const handleChange = <K extends keyof IUserField>(field: K, value: IUserField[K]) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSkillsChange = (updatedSkills: ISkill[]) => {
    setFormData((prevData) => ({ ...prevData, skills: updatedSkills }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await updateUser(userID, formData); // Save general user data

      // Only save skills if there are any
      if (formData.skills && formData.skills.length > 0) {
        await addUserSkills(userID, formData.skills);
      }

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

  const handleSectionChange = (value: string) => {
    if (
      value === "General" ||
      value === "Skills" ||
      value === "Certificates" ||
      value === "Increment"
    ) {
      setActiveSection(value);
    }
  };

  return (
    <Box sx={{ maxWidth: "1450px", mx: "auto", py: 2 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton color="primary" onClick={() => router.back()}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#741B92" }}>
            {transuser("edituser")}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" onClick={() => router.back()} sx={{ borderRadius: 30 }}>
            {transuser("cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ borderRadius: 30, backgroundColor: "#741B92", fontWeight: "bold" }}
          >
            {transuser("save")}
          </Button>
        </Box>
      </Box>

      {/* Tabs */}

      <Toggle
        options={["General", "Skills"]}
        selected={activeSection}
        onChange={handleSectionChange}
      />

      {/* Tab Content */}
      {activeSection === "General" && (
        <UserInput
          formData={formData}
          handleChange={handleChange}
          readOnlyFields={["name"]}
          errors={errors}
        />
      )}

      {activeSection === "Skills" && (
        <Box>
          <SkillInput
            userId={userID}
            skills={formData.skills || []}
            onChange={handleSkillsChange}
          />
        </Box>
      )}

      {activeSection === "Certificates" && (
        <Box>
          {/* TODO: Implement Certificate Section */}
          <Typography>{transuser("certificate_section_placeholder")}</Typography>
        </Box>
      )}

      {activeSection === "Increment" && (
        <Box>
          {/* TODO: Implement Increment Section */}
          <Typography>{transuser("increment_section_placeholder")}</Typography>
        </Box>
      )}

      {/* Snackbar */}
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
