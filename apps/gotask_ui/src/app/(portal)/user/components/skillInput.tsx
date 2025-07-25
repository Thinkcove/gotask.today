"use client";

import { useState } from "react";
import { Box, Typography, TextField, Grid, Stack, IconButton, Paper, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import useSWR from "swr";
import Autocomplete from "@mui/material/Autocomplete";
import { ISkill } from "../interfaces/userInterface";
import { useTranslations } from "next-intl";
import { createSkill, deleteUserSkill, fetchSkills, addUserSkills } from "../services/userAction";
import CommonDialog from "@/app/component/dialog/commonDialog";
import { PROFICIENCY_DESCRIPTIONS } from "@/app/common/constants/skills";
import env from "@/app/common/env";
import {
  DEFAULT_PROFICIENCY,
  MINIMUM_EXPERIENCE_REQUIRED,
  PROFICIENCY_MAXIMUM
} from "@/app/common/constants/user";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";

interface SkillInputProps {
  userId: string;
  skills: ISkill[];
  onChange: (skills: ISkill[]) => void;
}
const SkillInput: React.FC<SkillInputProps> = ({ userId, skills, onChange }) => {
  const trans = useTranslations("User");
  const transInc = useTranslations("User.Increment");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const [tempSkill, setTempSkill] = useState<ISkill>({
    name: "",
    proficiency: DEFAULT_PROFICIENCY,
    experience: undefined
  });

  const skillUrl = `${env.API_BASE_URL}/getAllSkills`;
  const { data: options = [], mutate } = useSWR(skillUrl, fetchSkills, {
    revalidateOnFocus: false
  });

  const availableOptions = options.filter(
    (option) =>
      !skills.some((skill) => skill.name.trim().toLowerCase() === option.trim().toLowerCase())
  );

  const openAddDialog = () => {
    setTempSkill({ name: "", proficiency: DEFAULT_PROFICIENCY });
    setDialogOpen(true);
  };

  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState("");
  const [skillErrors, setSkillErrors] = useState<{ [key: string]: string }>({});

  const validateSkillForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!tempSkill.name.trim()) {
      newErrors.name = trans("pleaseselectskillfirst");
    }

    if (!tempSkill.proficiency) {
      newErrors.proficiency = trans("pleasechooseproficiency");
    }

    if (
      tempSkill.proficiency >= PROFICIENCY_MAXIMUM &&
      (!tempSkill.experience || tempSkill.experience < MINIMUM_EXPERIENCE_REQUIRED)
    ) {
      newErrors.experience = trans("pleaseenterexperience");
    }

    setSkillErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSave = async () => {
    if (!validateSkillForm()) return;

    const trimmed = tempSkill.name.trim();
    if (!trimmed || !tempSkill.proficiency) return;

    const isDuplicate = skills.some(
      (skill) => skill.name.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      setErrorDialogMessage(trans("duplicateskills"));
      setErrorDialogOpen(true);
      return;
    }

    const skillData: ISkill = {
      name: trimmed,
      proficiency: tempSkill.proficiency,
      experience: tempSkill.proficiency >= PROFICIENCY_MAXIMUM ? tempSkill.experience : undefined
    };

    try {
      const isNewToMaster = !options.some(
        (opt) => opt.trim().toLowerCase() === trimmed.toLowerCase()
      );

      if (isNewToMaster) {
        await createSkill(trimmed);
        await mutate();
      }

      const added = await addUserSkills(userId, [skillData]);

      if (added?.success) {
        const skillId = added?.data?.[0]?.skill_id;
        const updated = [{ ...skillData, skill_id: skillId }, ...skills];

        onChange(updated);
        setDialogOpen(false);
        setTempSkill({ name: "", proficiency: DEFAULT_PROFICIENCY });

        setSnackbar({
          open: true,
          message: trans("successfullyAdded"),
          severity: SNACKBAR_SEVERITY.SUCCESS
        });
      } else {
        setSnackbar({
          open: true,
          message: added?.message || trans("saveskill"),
          severity: SNACKBAR_SEVERITY.ERROR
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: (error as Error)?.message || trans("commonerror"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  const confirmDelete = async () => {
    if (deleteIndex === null) return;
    const skill = skills[deleteIndex];
    if (skill.skill_id) await deleteUserSkill(userId, skill.skill_id);
    const updated = skills.filter((_, i) => i !== deleteIndex);
    onChange(updated);
    setConfirmOpen(false);
    setDeleteIndex(null);
  };

  const resetDialogState = () => {
    setDialogOpen(false);
    setTempSkill({ name: "", proficiency: DEFAULT_PROFICIENCY });
    setSkillErrors({});
  };

  return (
    <Box mt={3}>
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAddDialog}
          sx={{ textTransform: "none" }}
        >
          {trans("addskill")}
        </Button>
      </Box>

      <Box>
        {skills.length === 0 ? (
          <Paper elevation={1} sx={{ color: "text.secondary", p: 2 }}>
            {trans("noskills")}
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {skills.map((skill, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #e0e0e0"
                  }}
                >
                  <Box display="flex" gap={2}>
                    <Box>
                      <Box
                        sx={{
                          display: {
                            xs: "block",
                            sm: "none"
                          }
                        }}
                      >
                        <Typography
                          fontSize={14}
                          fontWeight={600}
                          sx={{
                            whiteSpace: "normal",
                            wordBreak: "break-word"
                          }}
                        >
                          {skill.name}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: {
                            xs: "none",
                            sm: "block"
                          }
                        }}
                      >
                        <Typography
                          fontSize={14}
                          fontWeight={600}
                          sx={{
                            wordBreak: "break-word"
                          }}
                        >
                          {skill.name}
                        </Typography>
                      </Box>

                      <Typography fontSize={12} color="text.secondary">
                        {trans("proficiency")}: {PROFICIENCY_DESCRIPTIONS[skill.proficiency]}
                      </Typography>
                      {skill.experience && skill.proficiency >= PROFICIENCY_MAXIMUM && (
                        <Typography fontSize={12} color="text.secondary">
                          {trans("experienceview")}: {skill.experience} {trans("months")}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Box>
                    <IconButton
                      onClick={() => {
                        setDeleteIndex(index);
                        setConfirmOpen(true);
                      }}
                    >
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <CommonDialog
        open={dialogOpen}
        onClose={resetDialogState}
        onSubmit={handleSave}
        title={trans("addskill")}
        submitLabel={trans("save")}
        cancelLabel={trans("cancel")}
      >
        <Typography color="text.secondary" fontSize={14} mb={2}>
          {trans("skilldescription")}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Typography fontWeight={600} fontSize={14} mb={0.5}>
                {trans("skills")}
              </Typography>
              <StarIcon
                fontSize="inherit"
                sx={{
                  color: "red",
                  position: "absolute",
                  top: -0.5,
                  right: -12,
                  fontSize: 8
                }}
              />
            </Box>

            <Autocomplete
              freeSolo
              filterOptions={(opts, state) => {
                const input = state.inputValue.trim().toLowerCase();
                const filtered = opts.filter((opt) => opt.toLowerCase().includes(input));
                const isExisting = opts.some((opt) => opt.toLowerCase() === input);
                if (input !== "" && !isExisting) filtered.push(`__add__${state.inputValue}`);
                return filtered;
              }}
              options={availableOptions}
              inputValue={tempSkill.name}
              onInputChange={(_, newInput) => {
                const cleaned = newInput.startsWith("__add__")
                  ? newInput.replace("__add__", "")
                  : newInput;
                setTempSkill({ ...tempSkill, name: cleaned });
                setSkillErrors((prev) => ({ ...prev, name: "" }));
              }}
              onChange={(_, newValue) => {
                const name =
                  typeof newValue === "string" && newValue.startsWith("__add__")
                    ? newValue.replace("__add__", "")
                    : newValue;

                if (!name) return;

                const trimmed = name.trim().toLowerCase();

                const alreadyAdded = skills.some(
                  (skill) => skill.name.trim().toLowerCase() === trimmed
                );

                if (alreadyAdded) {
                  setErrorDialogMessage(trans("duplicateskills"));
                  setErrorDialogOpen(true);
                  return;
                }

                const isAddOption = typeof newValue === "string" && newValue.startsWith("__add__");

                if (isAddOption) {
                  setTempSkill({ name: name.trim(), proficiency: DEFAULT_PROFICIENCY });
                  setDialogOpen(true);
                } else {
                  setTempSkill({ ...tempSkill, name: name.trim() });
                }

                setSkillErrors((prev) => ({ ...prev, name: "" }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={trans("selectskill")}
                  fullWidth
                  error={!!skillErrors.name}
                  helperText={skillErrors.name}
                />
              )}
              renderOption={(props, option) => {
                const isAddOption = typeof option === "string" && option.startsWith("__add__");
                const skillName = isAddOption ? option.replace("__add__", "") : option;
                const { key, ...rest } = props;
                return (
                  <li key={key} {...rest}>
                    {isAddOption ? (
                      <Box display="flex" alignItems="center">
                        <AddIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">{`${trans("add")} "${skillName}"`}</Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2">{skillName}</Typography>
                    )}
                  </li>
                );
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Typography fontWeight={600} fontSize={14} mb={0.5}>
                {trans("proficiency")}
              </Typography>
              <StarIcon
                fontSize="inherit"
                sx={{
                  color: "red",
                  position: "absolute",
                  top: -0.5,
                  right: -12,
                  fontSize: 8
                }}
              />
            </Box>
            <Stack direction="column" spacing={1}>
              {[1, 2, 3, 4].map((level) => {
                const selected = tempSkill.proficiency === level;
                return (
                  <Box
                    key={level}
                    display="flex"
                    alignItems="center"
                    onClick={() => {
                      if (!tempSkill.name.trim()) {
                        setSkillErrors((prev) => ({
                          ...prev,
                          name: trans("pleaseselectskillfirst")
                        }));
                        return;
                      }
                      setTempSkill({ ...tempSkill, proficiency: level });
                      setSkillErrors((prev) => ({ ...prev, proficiency: "" }));
                    }}
                    sx={{
                      cursor: "pointer",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor: selected ? "#f0f0f0" : "transparent"
                    }}
                  >
                    <StarIcon color={selected ? "primary" : "disabled"} fontSize="small" />
                    <Typography ml={1} fontSize={14}>
                      {PROFICIENCY_DESCRIPTIONS[level]}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>
            {skillErrors.proficiency && (
              <Typography color="error" fontSize={12} mt={0.5}>
                {skillErrors.proficiency}
              </Typography>
            )}
          </Grid>

          {tempSkill.proficiency >= PROFICIENCY_MAXIMUM && (
            <Grid item xs={12}>
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Typography fontWeight={600} fontSize={14} mb={0.5}>
                  {trans("experience")}
                </Typography>
                <StarIcon
                  fontSize="inherit"
                  sx={{
                    color: "red",
                    position: "absolute",
                    top: -0.5,
                    right: -12,
                    fontSize: 8
                  }}
                />
              </Box>
              <TextField
                type="number"
                placeholder={trans("months")}
                value={tempSkill.experience || ""}
                onChange={(e) =>
                  setTempSkill({
                    ...tempSkill,
                    experience: Math.max(1, parseInt(e.target.value || "0", 10))
                  })
                }
                fullWidth
                inputProps={{ min: 1 }}
                error={!!skillErrors.experience}
                helperText={skillErrors.experience}
              />
            </Grid>
          )}
        </Grid>
      </CommonDialog>

      <CommonDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onSubmit={confirmDelete}
        title={transInc("confirmdelete")}
        submitLabel={transInc("delete")}
        cancelLabel={transInc("cancel")}
        submitColor="#b71c1c"
      >
        <Typography
          fontSize={14}
          sx={{
            whiteSpace: "normal",
            wordBreak: "break-word"
          }}
        >
          {trans("deleteskill", { skill: `"${skills[deleteIndex!]?.name || ""}"` })}
        </Typography>
      </CommonDialog>

      <CommonDialog
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        onSubmit={() => setErrorDialogOpen(false)}
        title={trans("Increment.errortitle")}
        submitLabel={trans("ok")}
      >
        <Typography>{errorDialogMessage}</Typography>
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

export default SkillInput;
