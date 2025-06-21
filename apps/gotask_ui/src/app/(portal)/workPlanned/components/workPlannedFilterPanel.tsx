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
  Box,
  Stack,
  Typography,
  Paper,
  SelectChangeEvent
} from "@mui/material";
import { User } from "../interface/workPlanned";
import { Project } from "../../task/interface/taskInterface";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

interface WorkPlannedFiltersPanelProps {
  fromDate: string;
  toDate: string;
  userIds: string[];
  projectIds: string[];
  setFromDate: (date: string) => void;
  setToDate: (date: string) => void;
  setUserIds: (ids: string[]) => void;
  usersList: User[];
  setProjectIds: (ids: string[]) => void;
  projectsList: Project[];
}

const WorkPlannedFiltersPanel: React.FC<WorkPlannedFiltersPanelProps> = ({
  fromDate,
  toDate,
  userIds,
  projectIds,
  setFromDate,
  setToDate,
  setUserIds,
  usersList,
  setProjectIds,
  projectsList
}) => {
  const transreport = useTranslations(LOCALIZATION.TRANSITION.REPORT);
  const transworkplanned = useTranslations(LOCALIZATION.TRANSITION.WORKPLANNED);

  const handleUserChange = (event: SelectChangeEvent<string[]>) => {
    setUserIds(event.target.value as string[]);
  };

  const ALL_PROJECTS_ID = "ALL";

  const handleProjectChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    const isAllSelected = value.includes(ALL_PROJECTS_ID);
    const allProjectIds = projectsList.map((p) => p.id);

    if (isAllSelected) {
      // If already all selected, deselect all
      const allSelected = allProjectIds.every((id) => value.includes(id));
      if (allSelected) {
        setProjectIds([]);
      } else {
        setProjectIds(allProjectIds);
      }
    } else {
      setProjectIds(value);
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
          {transworkplanned("filterHeader")}
        </Typography>

        {/* Date Range Filters */}
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
              sx: {
                fontSize: "1.3rem"
              }
            }}
            InputProps={{
              sx: {
                height: 50
              }
            }}
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
              sx: {
                fontSize: "1.3rem"
              }
            }}
            InputProps={{
              sx: {
                height: 50
              }
            }}
          />
        </Box>

        {/* User Filter */}
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
                  const user = usersList.find((user) => user.id === id);
                  return (
                    <Chip
                      key={id}
                      label={user?.name || id}
                      onMouseDown={(e) => e.stopPropagation()}
                      onDelete={(e) => {
                        e.stopPropagation();
                        const updatedUserIds = userIds.filter((uid) => uid !== id);
                        setUserIds(updatedUserIds);
                      }}
                    />
                  );
                })}
              </Box>
            )}
          >
            {usersList && usersList.length > 0 ? (
              usersList.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  <Checkbox checked={userIds.indexOf(user.id) > -1} />
                  <ListItemText primary={user.name} />
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>{transreport("nousers")}</MenuItem>
            )}
          </Select>
        </FormControl>

        {/* Project Filter */}
        <FormControl fullWidth>
          <InputLabel id="project-id-label">{transreport("projectlist")}</InputLabel>
          <Select
            labelId="project-id-label"
            id="project-ids"
            multiple
            value={projectIds}
            onChange={handleProjectChange}
            input={<OutlinedInput label={transreport("projectlist")} />}
            renderValue={(selected) => {
              if (selected.includes(ALL_PROJECTS_ID)) {
                return <Chip label={transreport("all")} />;
              }
              return (
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
                          const updated = projectIds.filter((pid) => pid !== id);
                          setProjectIds(updated);
                        }}
                      />
                    );
                  })}
                </Box>
              );
            }}
          >
            <MenuItem value={ALL_PROJECTS_ID}>
              <Checkbox
                checked={projectsList.length > 0 && projectIds.length === projectsList.length}
              />
              <ListItemText primary={transreport("all")} />
            </MenuItem>
            {projectsList.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                <Checkbox checked={projectIds.includes(project.id)} />
                <ListItemText primary={project.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Paper>
  );
};

export default WorkPlannedFiltersPanel;
