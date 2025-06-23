import { useState, useEffect } from "react";
import { Box, Typography, TextField, IconButton, Grid, Divider, Stack } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import StarIcon from "@mui/icons-material/Star";
import DeleteIcon from "@mui/icons-material/Delete";
import { ISkill } from "../interfaces/userInterface";

import {
  getAllSkills,
  createSkill,
  updateUserSkill,
  deleteUserSkill
} from "../services/userAction";


interface SkillInputProps {
  userId: string;
  skills: ISkill[];
  onChange: (skills: ISkill[]) => void;
}

const proficiencyDescriptions: { [key: number]: string } = {
  1: "Knowledge",
  2: "Can Work",
  3: "Have Work Exposure",
  4: "Has exposure, can provide solution, and train others"
};

const SkillInput: React.FC<SkillInputProps> = ({ userId, skills, onChange }) => {
  const [options, setOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchOptions = async () => {
    setLoading(true);
    const data = await getAllSkills();
    setOptions((data as { name: string }[]).map((s) => s.name));
    setLoading(false);
  };  

  useEffect(() => {
    fetchOptions();
  }, []);

  const onAdd = async (name: string) => {
    if (!name.trim() || skills.find((s) => s.name.toLowerCase() === name.toLowerCase())) return;

    try {
      await createSkill(name);
      await fetchOptions();

      const newSkill: ISkill = {
        skill_id: "",
        name,
        proficiency: 0
      };

      const updated = [...skills, newSkill];
      onChange(updated);
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

  return (
    <Box>
      <Typography variant="h6">Skills</Typography>

      <Autocomplete
        freeSolo
        filterOptions={(opts) => opts}
        options={options.concat(
          inputValue && !options.includes(inputValue) ? [`➕ Add "${inputValue}"`] : []
        )}
        inputValue={inputValue}
        onInputChange={(_, val) => setInputValue(val)}
        onChange={(_, val) => {
          if (!val) return;
          const isAddOption = typeof val === "string" && val.startsWith("➕ Add ");
          const skillName = isAddOption ? val.replace(/^➕ Add "/, "").replace(/"$/, "") : val;
          onAdd(skillName);
          setInputValue("");
        }}
        onOpen={fetchOptions}
        loading={loading}
        renderInput={(params) => <TextField {...params} label="Add Skill" fullWidth />}
      />
      <Box
        mt={2}
        sx={{
          maxHeight: "600px", 
          overflowY: "auto",
          pr: 1,
          pb: 2, 
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "6px"
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#999",
            borderRadius: "4px"
          }
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
                    {[1, 2, 3, 4].map((star) => (
                      <Box
                        key={star}
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
                            proficiency: star,
                            experience: s.experience
                          };
                          updateSkill(idx, updatedSkill);
                        }}
                      >
                        <StarIcon color={s.proficiency >= star ? "primary" : "disabled"} />
                        <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
                          {proficiencyDescriptions[star]}
                        </Typography>
                      </Box>
                    ))}
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
