"use client";

import {  useState } from "react";
import { Box, Typography, TextField, Grid, Stack, IconButton, Paper, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import StarIcon from "@mui/icons-material/Star";
import useSWR from "swr";
import Autocomplete from "@mui/material/Autocomplete";
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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);

  const [tempSkill, setTempSkill] = useState<ISkill>({
    name: "",
    proficiency: 0,
    experience: undefined
  });

  const skillUrl = `${env.API_BASE_URL}/getAllSkills`;
  const { data: options = [], mutate } = useSWR(skillUrl, fetchSkills, {
    revalidateOnFocus: false
  });

  const openAddDialog = () => {
    setTempSkill({ name: "", proficiency: 0 });
    setCurrentEditIndex(null);
    setDialogOpen(true);
  };

  const openEditDialog = (index: number) => {
    setTempSkill({ ...skills[index] });
    setCurrentEditIndex(index);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const trimmed = tempSkill.name.trim();
    if (!trimmed || !tempSkill.proficiency) return;

    const updated = [...skills];
    const skillData: ISkill = {
      name: trimmed,
      proficiency: tempSkill.proficiency,
      experience: tempSkill.proficiency >= 3 ? tempSkill.experience : undefined
    };

    try {
      if (currentEditIndex !== null) {
        const existing = updated[currentEditIndex];
        Object.assign(existing, skillData);
        if (existing.skill_id) await updateUserSkill(userId, existing.skill_id, existing);
      } else {
        await createSkill(trimmed);
        await mutate();
        const added = await addUserSkills(userId, [skillData]);
        if (added?.length) {
          updated.unshift({ ...skillData, skill_id: added[0].skill_id });
        }
      }

      onChange(updated);
      setDialogOpen(false);
      setTempSkill({ name: "", proficiency: 0 });
      setCurrentEditIndex(null);
    } catch (err) {
      console.error("Save skill failed:", err);
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

  return (
     <Box mt={3}>
 
      {/* Add Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography fontSize={16} fontWeight={600} zIndex={10}>
          {trans("userskill")}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAddDialog}
          sx={{ textTransform: "none" }}
        >
          {trans("addskill")}
        </Button>
      </Box>
   <Box
        sx={{
          maxHeight: 400,
          overflow: "auto",
          border: "1px solid #ddd",
          borderRadius: 2,
          px: 2,
          py: 2,
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": {
            width: "6px", 
            height: "6px"
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1"
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#bbb",
            borderRadius: 8
          }
        }}
      >
      {/* Skill List */}
      {skills.length === 0 ? (
        <Paper elevation={1} sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
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
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 1,
                      backgroundColor: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24
                    }}
                  >
                    🛠️
                  </Box>
                  <Box>
                    <Typography fontSize={14} fontWeight={600}>
                      {skill.name}
                    </Typography>
                    <Typography fontSize={12} color="text.secondary">
                      {trans("proficiency")}: {PROFICIENCY_DESCRIPTIONS[skill.proficiency]}
                    </Typography>
                    {skill.experience && skill.proficiency >= 3 && (
                      <Typography fontSize={12} color="text.secondary">
                        {trans("experience")}: {skill.experience} {trans("months")}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box>
                  <IconButton onClick={() => openEditDialog(index)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
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
      {/* Dialogs (Add/Edit & Delete) */}
      <CommonDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setTempSkill({ name: "", proficiency: 0 });
          setCurrentEditIndex(null);
        }}
        onSubmit={handleSave}
        title={currentEditIndex !== null ? trans("editskill") : trans("addskill")}
        submitLabel={trans("save")}
        cancelLabel={trans("cancel")}
      >
        <Typography color="text.secondary" fontSize={14} mb={2}>
          {trans("skilldescription")}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography fontWeight={600} fontSize={14} mb={0.5}>
              {trans("skills")} <span style={{ color: "red" }}>*</span>
            </Typography>
            <Autocomplete
              freeSolo
              filterOptions={(opts, state) => {
                const input = state.inputValue.trim().toLowerCase();
                const filtered = opts.filter((opt) => opt.toLowerCase().includes(input));
                const isExisting = opts.some((opt) => opt.toLowerCase() === input);
                if (input !== "" && !isExisting) {
                  filtered.push(`+ ${trans("add")} "${state.inputValue}"`);
                }
                return filtered;
              }}
              options={options}
              value={tempSkill.name}
              onChange={(_, newValue) => {
                if (typeof newValue === "string") {
                  const match = newValue.match(/^\+ .*"(.*)"$/);
                  setTempSkill({ ...tempSkill, name: match ? match[1] : newValue });
                } else {
                  setTempSkill({ ...tempSkill, name: newValue || "" });
                }
              }}
              onInputChange={(_, newInput) => {
                setTempSkill({ ...tempSkill, name: newInput });
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder={trans("selectskill")} fullWidth />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography fontWeight={600} fontSize={14} mb={0.5}>
              {trans("proficiency")}
            </Typography>
            <Stack direction="column" spacing={1}>
              {[1, 2, 3, 4].map((level) => {
                const selected = tempSkill.proficiency === level;
                return (
                  <Box
                    key={level}
                    display="flex"
                    alignItems="center"
                    onClick={() => setTempSkill({ ...tempSkill, proficiency: level })}
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
          </Grid>

          {tempSkill.proficiency >= 3 && (
            <Grid item xs={12}>
              <Typography fontWeight={600} fontSize={14} mb={0.5}>
                {trans("experience")} <span style={{ color: "red" }}>*</span>
              </Typography>
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
      >
        <Typography>{transInc("deleteincrement")}</Typography>
      </CommonDialog>
    </Box>
  );
};

export default SkillInput;
