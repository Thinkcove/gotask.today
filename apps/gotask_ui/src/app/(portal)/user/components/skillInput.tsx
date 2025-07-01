"use client";

import { useState } from "react";
import { Box, Typography, TextField, Grid, Stack, Button, IconButton, Paper } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import useSWR from "swr";
import { ISkill } from "../interfaces/userInterface";
import { useTranslations } from "next-intl";
import {
  createSkill,
  deleteUserSkill,
  fetchSkills,
  updateUserSkill,
  addUserSkills
} from "../services/userAction";
import CommonDialog from "@/app/component/dialog/commonDialog";
import { PROFICIENCY_DESCRIPTIONS } from "@/app/common/constants/skills";
import env from "@/app/common/env";

interface SkillInputProps {
  userId: string;
  skills: ISkill[];
  onChange: (skills: ISkill[]) => void;
}

const SkillInput: React.FC<SkillInputProps> = ({ userId, skills, onChange }) => {
  const trans = useTranslations("User");
  const transInc = useTranslations("User.Increment");

  const [editMode, setEditMode] = useState(false);
  const [localSkills, setLocalSkills] = useState<ISkill[]>([...skills]);
  const [inputValue, setInputValue] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const skillUrl = `${env.API_BASE_URL}/getAllSkills`;
  const { data: options = [], mutate } = useSWR(skillUrl, fetchSkills, {
    revalidateOnFocus: false
  });

  const handleAddSkill = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || localSkills.find((s) => s.name.toLowerCase() === trimmed.toLowerCase())) return;

    try {
      await createSkill(trimmed);
      await mutate();
      setLocalSkills([...localSkills, { name: trimmed, proficiency: 0 }]);
    } catch (err) {
      console.error("Failed to create skill:", err);
    }

    setInputValue("");
  };

  const handleProficiency = (index: number, level: number) => {
    const newList = [...localSkills];
    newList[index].proficiency = level;
    setLocalSkills(newList);
  };

  const handleExperience = (index: number, value: number) => {
    const newList = [...localSkills];
    newList[index].experience = value;
    setLocalSkills(newList);
  };

  const handleDeleteSkill = () => {
    if (deleteIndex === null) return;
    const updated = [...localSkills];
    updated.splice(deleteIndex, 1);
    setLocalSkills(updated);
    setDeleteIndex(null);
    setConfirmOpen(false);
  };

  const saveSkills = async () => {
    const addedSkills: ISkill[] = [];
    const updatedSkills: { skill: ISkill; skill_id: string }[] = [];

    for (const skill of localSkills) {
      const existing = skills.find((s) => s.name === skill.name);
      if (existing && existing.skill_id) {
        updatedSkills.push({ skill, skill_id: existing.skill_id });
      } else {
        addedSkills.push(skill);
      }
    }

    if (addedSkills.length > 0) {
      await addUserSkills(userId, addedSkills);
    }

    for (const { skill, skill_id } of updatedSkills) {
      await updateUserSkill(userId, skill_id, skill);
    }

    for (const oldSkill of skills) {
      if (!localSkills.find((s) => s.name === oldSkill.name) && oldSkill.skill_id) {
        await deleteUserSkill(userId, oldSkill.skill_id);
      }
    }

    onChange(localSkills);
    setEditMode(false);
  };

  const getFilteredOptions = () => {
    const filtered = options
      .filter((opt) => opt.toLowerCase().includes(inputValue.toLowerCase()))
      .sort((a, b) => a.localeCompare(b));

    const isNew =
      inputValue && !options.some((opt) => opt.toLowerCase() === inputValue.toLowerCase());
    return isNew ? [`__add__${inputValue}`, ...filtered] : filtered;
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography fontWeight={600}>{trans("userskill")}</Typography>
        {!editMode ? (
          <IconButton onClick={() => setEditMode(true)} size="small">
            <EditIcon fontSize="small" />
          </IconButton>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" size="small" onClick={() => setEditMode(false)}>
              {transInc("cancel")}
            </Button>
            <Button variant="contained" size="small" onClick={saveSkills}>
              {transInc("save")}
            </Button>
          </Stack>
        )}
      </Box>

      {/* View Mode */}
      {!editMode ? (
        skills.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: "center" }}>{trans("noskills")}</Paper>
        ) : (
          <Grid container spacing={2}>
            {skills.map((skill, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
                  <Typography fontWeight={600}>{skill.name}</Typography>
                  <Typography variant="body2">
                    {trans("proficiency")}: {PROFICIENCY_DESCRIPTIONS[skill.proficiency]}
                  </Typography>
                  {skill.proficiency >= 3 && skill.experience && (
                    <Typography variant="body2">
                      {trans("experience")}: {skill.experience} {trans("months")}
                    </Typography>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        )
      ) : (
        <>
          <Autocomplete
            freeSolo
            options={getFilteredOptions()}
            inputValue={inputValue}
            onInputChange={(_, val) => setInputValue(val)}
            onChange={(_, val) => {
              if (!val) return;
              const name =
                typeof val === "string" && val.startsWith("__add__")
                  ? val.replace("__add__", "")
                  : val;
              handleAddSkill(name);
            }}
            renderInput={(params) => <TextField {...params} label={trans("addskill")} fullWidth />}
            renderOption={(props, option) => {
              const isAdd = typeof option === "string" && option.startsWith("__add__");
              const skillName = isAdd ? option.replace("__add__", "") : option;

              const { key, ...rest } = props;
              return (
                <li key={key} {...rest}>
                  {isAdd ? (
                    <Box display="flex" alignItems="center">
                      <AddIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">{`${trans("add")} "${skillName}"`}</Typography>
                    </Box>
                  ) : (
                    skillName
                  )}
                </li>
              );
            }}
          />

          <Box mt={2} sx={{ maxHeight: 350, overflowY: "auto", pr: 1 }}>
            {localSkills.map((skill, index) => (
              <Box key={index} sx={{ border: "1px solid #ccc", p: 2, borderRadius: 2, mb: 2 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography fontWeight={600}>{skill.name}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setDeleteIndex(index);
                      setConfirmOpen(true);
                    }}
                  >
                    <DeleteIcon color="error" fontSize="small" />
                  </IconButton>
                </Stack>

                <Box sx={{ pt: 1 }}>
                  <Stack
                    direction="row"
                    flexWrap="wrap"
                    alignItems="center"
                    display="flex"
                    justifyContent="space-between"
                  >
                    {Object.entries(PROFICIENCY_DESCRIPTIONS).map(([value, label]) => {
                      const level = Number(value);
                      return (
                        <Box
                          key={level}
                          onClick={() => handleProficiency(index, level)}
                          sx={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            mr: 2,
                            mb: 1,
                            px: 1.5,
                            py: 1,
                            borderRadius: 1,
                            "&:hover": {
                              backgroundColor: "#f5f5f5"
                            }
                          }}
                        >
                          <StarIcon
                            fontSize="small"
                            color={skill.proficiency >= level ? "primary" : "disabled"}
                          />
                          <Typography variant="caption">{label}</Typography>
                        </Box>
                      );
                    })}

                    <TextField
                      type="number"
                      label={trans("experience")}
                      value={skill.experience || ""}
                      onChange={(e) => {
                        const val = Math.max(1, parseInt(e.target.value || "0", 10) || 0);
                        handleExperience(index, val);
                      }}
                      inputProps={{ min: 1 }}
                      disabled={skill.proficiency < 3}
                      size="small"
                      sx={{
                        minWidth: 120,
                        mt: 1,
                        "& .MuiInputBase-root": {
                          height: 36,
                          fontSize: 12
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: 12
                        }
                      }}
                    />
                  </Stack>
                </Box>
              </Box>
            ))}
          </Box>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <CommonDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onSubmit={handleDeleteSkill}
        title={transInc("confirmdelete")}
        submitLabel={transInc("delete")}
        cancelLabel={transInc("cancel")}
      >
        <Typography>{transInc("deleteincrement")}</Typography>
      </CommonDialog>
    </Box>
  );
};

export default SkillInput;
