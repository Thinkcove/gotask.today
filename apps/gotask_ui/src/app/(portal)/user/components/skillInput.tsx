"use client";

import { useState } from "react";
import { Box, Typography, TextField, Grid, Stack, Paper } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import { ISkill } from "../interfaces/userInterface";
import useSWR from "swr";
import env from "@/app/common/env";
import { createSkill, updateUserSkill, deleteUserSkill, fetchSkills } from "../services/userAction";
import { PROFICIENCY_DESCRIPTIONS } from "@/app/common/constants/skills";
import { useTranslations } from "next-intl";
import { Delete } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import CommonDialog from "@/app/component/dialog/commonDialog";

interface SkillInputProps {
  userId: string;
  skills: ISkill[];
  onChange: (skills: ISkill[]) => void;
}

const SkillInput: React.FC<SkillInputProps> = ({ userId, skills, onChange }) => {
  const [inputValue, setInputValue] = useState("");
  const skillUrl = `${env.API_BASE_URL}/getAllSkills`;
  const transuser = useTranslations("User");
  const transInc = useTranslations("User.Increment");

  const {
    data: options = [],
    isLoading,
    mutate
  } = useSWR(skillUrl, fetchSkills, {
    revalidateOnFocus: false
  });

  const onAdd = async (name: string) => {
    if (!name.trim() || skills.find((s) => s.name.toLowerCase() === name.toLowerCase())) return;

    try {
      await createSkill(name);
      await mutate();

      const newSkill: ISkill = {
        name,
        proficiency: 0
      };

      onChange([...skills, newSkill]);
    } catch (error) {
      console.error("Create skill failed", error);
    }
  };

  const updateSkill = async (index: number, updated: ISkill) => {
    const newSkills = [...skills];
    newSkills[index] = updated;
    onChange(newSkills);

    if (updated.skill_id) {
      await updateUserSkill(userId, updated.skill_id, {
        skill_id: updated.skill_id,
        name: updated.name,
        proficiency: updated.proficiency,
        experience: updated.experience
      });
    }
  };

  const confirmDeleteSkill = (index: number) => {
    setDeleteIndex(index);
    setConfirmOpen(true);
  };

  const removeSkill = async (index: number) => {
    const [removed] = skills.splice(index, 1);
    onChange([...skills]);
    if (removed.skill_id) await deleteUserSkill(userId, removed.skill_id);
  };
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  return (
    <Box sx={{ pt: 1 }}>
      {/* Add Skill */}
      <Grid item xs={12} md={3} pt={2}>
        <Autocomplete
          freeSolo
          options={options}
          loading={isLoading}
          inputValue={inputValue}
          onInputChange={(_, val) => setInputValue(val)}
          onChange={(_, val) => {
            if (!val) return;
            const isAdd = typeof val === "string" && val.startsWith("__add__");
            const name = isAdd ? val.replace("__add__", "") : val;
            onAdd(name);
            setInputValue("");
          }}
          filterOptions={(options) => {
            const filtered = options
              .filter((opt) => opt.toLowerCase().includes(inputValue.toLowerCase()))
              .sort((a, b) => a.localeCompare(b));

            const isNew =
              inputValue && !options.some((opt) => opt.toLowerCase() === inputValue.toLowerCase());
            return isNew ? [`__add__${inputValue}`, ...filtered] : filtered;
          }}
          getOptionLabel={(option) =>
            typeof option === "string" && option.startsWith("__add__")
              ? option.replace("__add__", "")
              : option
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={transuser("addskill")}
              fullWidth
              InputProps={{
                ...params.InputProps,
                sx: {
                  alignItems: "center",
                  height: 50
                }
              }}
            />
          )}
          renderOption={(props, option) => {
            const isAdd = typeof option === "string" && option.startsWith("__add__");
            const skillName = isAdd ? option.replace("__add__", "") : option;

            const { key, ...rest } = props;

            return (
              <li key={key} {...rest}>
                {isAdd ? (
                  <Box display="flex" alignItems="center">
                    {isAdd && <AddIcon fontSize="small" sx={{ mr: 1 }} />}
                    <Typography variant="body2">
                      {isAdd ? `${transuser("add")} "${skillName}"` : skillName}
                    </Typography>
                  </Box>
                ) : (
                  skillName
                )}
              </li>
            );
          }}
        />
      </Grid>

      {/* Skill List */}
      <Grid item xs={12} md={8} pt={2}>
        <Box
          sx={{
            maxHeight: 450,
            overflowY: "auto",
            pr: 1,
            pb: 2,
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#aaa",
              borderRadius: "4px"
            }
          }}
        >
          {skills.length === 0 ? (
            <Paper elevation={1} sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
              {transuser("noskills")}
            </Paper>
          ) : (
            skills.map((s, idx) => {
              return (
                <Box
                  key={idx}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                    backgroundColor: "#fff",
                    width: "100%"
                  }}
                >
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={11}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {s.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <IconButton size="small" onClick={() => confirmDeleteSkill(idx)}>
                        <Delete fontSize="small" color="error" />
                      </IconButton>
                    </Grid>
                  </Grid>

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
                            onClick={() => {
                              updateSkill(idx, {
                                ...s,
                                proficiency: level,
                                experience: s.experience
                              });
                            }}
                            sx={{
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              "&:hover": {
                                backgroundColor: "action.hover"
                              }
                            }}
                          >
                            <StarIcon
                              color={s.proficiency >= level ? "primary" : "disabled"}
                              fontSize="small"
                            />
                            <Typography variant="caption">{label}</Typography>
                          </Box>
                        );
                      })}

                      <TextField
                        type="number"
                        label={transuser("experience")}
                        value={s.experience || ""}
                        onChange={(e) => {
                          const val = Math.max(1, parseInt(e.target.value || "0", 10) || 0);
                          updateSkill(idx, { ...s, experience: val });
                        }}
                        inputProps={{ min: 1 }}
                        disabled={s.proficiency < 3}
                        size="small"
                        sx={{
                          width: 100,
                          mx: 1,
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
              );
            })
          )}
        </Box>
      </Grid>

      <CommonDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onSubmit={async () => {
          if (deleteIndex !== null) {
            await removeSkill(deleteIndex);
          }
          setConfirmOpen(false);
          setDeleteIndex(null);
        }}
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
