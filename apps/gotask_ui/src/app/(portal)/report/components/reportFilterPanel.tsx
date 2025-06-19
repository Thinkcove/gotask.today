"use client";
import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
  MenuItem,
  Checkbox,
  ListItemText,
  FormControlLabel,
  Box,
  Stack,
  Typography,
  Paper,
  SelectChangeEvent,
  IconButton
} from "@mui/material";
import { User } from "../interface/timeLog";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import CloseIcon from "@mui/icons-material/Close";

interface FiltersPanelProps {
  fromDate: string;
  toDate: string;
  userIds: string[];
  projectIds: string[];
  setFromDate: (date: string) => void;
  setToDate: (date: string) => void;
  setUserIds: (ids: string[]) => void;
  usersList: User[];
  setProjectIds: (ids: string[]) => void;
  projectsList: User[];
  showTasks: boolean;
  setShowTasks: (value: boolean) => void;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  fromDate,
  toDate,
  userIds,
  projectIds,
  setFromDate,
  setToDate,
  setUserIds,
  usersList,
  setProjectIds,
  projectsList,
  showTasks,
  setShowTasks
}) => {
  const transreport = useTranslations(LOCALIZATION.TRANSITION.REPORT);

  const handleUserChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    if (value.includes("all")) {
      const allIds = usersList.map((u) => u.id);
      setUserIds(allIds);
    } else {
      const newUserIds = typeof value === "string" ? value.split(",") : value;
      setUserIds(newUserIds);
    }
  };

  const handleProjectChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    if (value.includes("all")) {
      const allIds = projectsList.map((p) => p.id);
      setProjectIds(allIds);
    } else {
      const newProjectIds = typeof value === "string" ? value.split(",") : value;
      setProjectIds(newProjectIds);
    }
  };

  // Fixed: Only clear users, not projects
  const handleClearUsers = () => {
    setUserIds([]);
  };

  const handleClearProjects = () => {
    setProjectIds([]);
  };

  const userMenuProps = {
    PaperProps: {
      style: {
        maxHeight: 250,
        overflowY: "auto" as const
      }
    }
  };

  const projectMenuProps = {
    PaperProps: {
      style: {
        maxHeight: 250,
        overflowY: "auto" as const
      }
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: "#f9fafb",
        border: "1px solid #e0e0e0"
      }}
    >
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary" fontWeight={600} fontSize="1rem">
          {transreport("filtertitle")}
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label={transreport("from")}
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            fullWidth
            size="small"
            InputLabelProps={{
              shrink: true,
              sx: { fontSize: "1.3rem" }
            }}
            InputProps={{ sx: { height: 50 } }}
          />

          <TextField
            label={transreport("to")}
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            fullWidth
            size="small"
            InputLabelProps={{
              shrink: true,
              sx: { fontSize: "1.3rem" }
            }}
            InputProps={{ sx: { height: 50 } }}
          />
        </Box>

        {/* Users Selection */}
        <Box sx={{ position: "relative" }}>
          <FormControl fullWidth>
            <InputLabel id="user-id-label">{transreport("userlist")}</InputLabel>
            <Select
              labelId="user-id-label"
              id="user-ids"
              multiple
              value={userIds}
              onChange={handleUserChange}
              input={<OutlinedInput label={transreport("userlist")} />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((id) => {
                    const user = usersList.find((u) => u.id === id);
                    return (
                      <Chip
                        key={id}
                        label={user?.name || id}
                        onMouseDown={(e) => e.stopPropagation()}
                        onDelete={(e) => {
                          e.stopPropagation();
                          setUserIds(userIds.filter((uid) => uid !== id));
                        }}
                      />
                    );
                  })}
                </Box>
              )}
              MenuProps={userMenuProps}
            >
              <MenuItem value="all">
                <Checkbox checked={userIds.length === usersList.length} />
                <ListItemText primary={transreport("all")} />
              </MenuItem>
              {usersList.length > 0 ? (
                usersList.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    <Checkbox checked={userIds.includes(user.id)} />
                    <ListItemText primary={user.name} />
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>{transreport("nousers")}</MenuItem>
              )}
            </Select>
          </FormControl>
          {userIds.length > 0 && (
            <IconButton
              size="small"
              onClick={handleClearUsers}
              sx={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                mr: 2
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        {/* Projects Selection */}
        <Box sx={{ position: "relative" }}>
          <FormControl fullWidth>
            <InputLabel id="project-id-label">{transreport("projectlist")}</InputLabel>
            <Select
              labelId="project-id-label"
              id="project-ids"
              multiple
              value={projectIds}
              onChange={handleProjectChange}
              input={<OutlinedInput label={transreport("projectlist")} />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((id) => {
                    const project = projectsList.find((p) => p.id === id);
                    return (
                      <Chip
                        key={id}
                        label={project?.name || id}
                        onMouseDown={(e) => e.stopPropagation()}
                        onDelete={(e) => {
                          e.stopPropagation();
                          setProjectIds(projectIds.filter((pid) => pid !== id));
                        }}
                      />
                    );
                  })}
                </Box>
              )}
              MenuProps={projectMenuProps}
            >
              <MenuItem value="all">
                <Checkbox checked={projectIds.length === projectsList.length} />
                <ListItemText primary={transreport("all")} />
              </MenuItem>
              {projectsList.length > 0 ? (
                projectsList.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    <Checkbox checked={projectIds.includes(project.id)} />
                    <ListItemText primary={project.name} />
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>{transreport("noprojects")}</MenuItem>
              )}
            </Select>
          </FormControl>
          {projectIds.length > 0 && (
            <IconButton
              size="small"
              onClick={handleClearProjects}
              sx={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                mr: 2
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        <Stack direction="row" spacing={2}>
          <FormControlLabel
            control={
              <Checkbox checked={showTasks} onChange={(e) => setShowTasks(e.target.checked)} />
            }
            label={transreport("showtasks")}
          />
        </Stack>
      </Stack>
    </Paper>
  );
};

export default FiltersPanel;
