"use client";

import { useState } from "react";
import { Box, Typography, TextField, IconButton, Grid, Divider, Stack } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import StarIcon from "@mui/icons-material/Star";
import DeleteIcon from "@mui/icons-material/Delete";
import { ISkill } from "../interfaces/userInterface";
import useSWR from "swr";
import { withAuth } from "@/app/common/utils/authToken";
import { getData } from "@/app/common/utils/apiData";
import env from "@/app/common/env";
import { createSkill, updateUserSkill, deleteUserSkill } from "../services/userAction";
import AddIcon from "@mui/icons-material/Add";
import { PROFICIENCY_DESCRIPTIONS } from "@/app/common/constants/skills";
import { useTranslations } from "next-intl";

interface SkillInputProps {
  userId: string;
  skills: ISkill[];
  onChange: (skills: ISkill[]) => void;
}

// SWR fetcher for skills
const fetchSkills = async (url: string): Promise<string[]> => {
  return await withAuth(async (token) => {
    const response = await getData(url, token);

    if (!Array.isArray(response.data)) {
      console.error("Invalid response from /getAllSkills:", response.data);
      return [];
    }

    return response.data.map((s: { name: string }) => s.name);
  });
};

const SkillInput: React.FC<SkillInputProps> = ({ userId, skills, onChange }) => {
  const [inputValue, setInputValue] = useState("");
  const skillUrl = `${env.API_BASE_URL}/getAllSkills`;
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
        skill_id: "",
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

  const removeSkill = async (index: number) => {
    const [removed] = skills.splice(index, 1);
    onChange([...skills]);
    if (removed.skill_id) await deleteUserSkill(userId, removed.skill_id);
  };
  const transuser = useTranslations("User"); 

  return (
    <Box>
      <Typography variant="h6">Skills</Typography>

      <Autocomplete
        freeSolo
        filterOptions={(options) => {
          const filtered = options
            .filter((opt) => opt.toLowerCase().includes(inputValue.toLowerCase()))
            .sort((a, b) => a.localeCompare(b)); // sort alphabetically

          const addOption =
            inputValue && !options.some((opt) => opt.toLowerCase() === inputValue.toLowerCase())
              ? [`__add__${inputValue}`]
              : [];

          return [...addOption, ...filtered];
        }}
        options={options}
        inputValue={inputValue}
        onInputChange={(_, val) => setInputValue(val)}
        onChange={(_, val) => {
          if (!val) return;
          const isAddOption = typeof val === "string" && val.startsWith("__add__");
          const skillName = isAddOption ? val.replace("__add__", "") : val;
          onAdd(skillName);
          setInputValue("");
        }}
        loading={isLoading}
        getOptionLabel={(option) => {
          if (typeof option === "string" && option.startsWith("__add__")) {
            return option.replace("__add__", "");
          }
          return option;
        }}
        renderInput={(params) => <TextField {...params} label="Add Skill" fullWidth />}
        renderOption={(props, option) => {
          const isAddOption = typeof option === "string" && option.startsWith("__add__");
          const skillName = isAddOption ? option.replace("__add__", "") : option;

          return (
            <li {...props}>
              {isAddOption ? (
                <Box display="flex" alignItems="center">
                  <AddIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {transuser("add")} "{skillName}"
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2">{skillName}</Typography>
              )}
            </li>
          );
        }}
      />

      <Box
        mt={2}
        sx={{
          maxHeight: "450px",
          overflowY: "auto",
          pr: 1,
          pb: 2,
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#999", borderRadius: "4px" }
        }}
      >
        {skills.map((s, idx) => {
          const requiresExperience = s.proficiency >= 3;

          return (
            <Box key={idx} sx={{ p: 2, mb: 2, border: "1px solid #ccc", borderRadius: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={11}>
                  <Typography variant="subtitle1">{s.name}</Typography>
                </Grid>
                <Grid item xs={1}>
                  <IconButton color="error" onClick={() => removeSkill(idx)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>

              <Divider sx={{ my: 1 }} />

              <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Proficiency
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                    {Object.entries(PROFICIENCY_DESCRIPTIONS).map(([value, label]) => {
                      const level = Number(value);
                      return (
                        <Box
                          key={level}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            cursor: "pointer",
                            px: 1,
                            py: 0.5,
                            borderRadius: 1
                          }}
                          onClick={() => {
                            const updatedSkill = {
                              ...s,
                              proficiency: level,
                              experience: s.experience
                            };
                            updateSkill(idx, updatedSkill);
                          }}
                        >
                          <StarIcon color={s.proficiency >= level ? "primary" : "disabled"} />
                          <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
                            {label}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                </Grid>
              </Grid>

              {requiresExperience && (
                <TextField
                  type="number"
                  label="Experience (months)"
                  value={s.experience || ""}
                  onChange={(e) => {
                    const value = Math.max(1, parseInt(e.target.value || "0", 10) || 0);
                    updateSkill(idx, { ...s, experience: value });
                  }}
                  inputProps={{ min: 1 }}
                  sx={{ width: "25%", mt: 2 }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default SkillInput;
