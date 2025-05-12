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
  SelectChangeEvent
} from "@mui/material";
import { User } from "../interface/timeLog";

interface FiltersPanelProps {
  fromDate: string;
  toDate: string;
  userIds: string[];
  setFromDate: (date: string) => void;
  setToDate: (date: string) => void;
  setUserIds: (ids: string[]) => void;
  usersList: User[];
  showTasks: boolean;
  showProjects: boolean;
  setShowTasks: (value: boolean) => void;
  setShowProjects: (value: boolean) => void;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  fromDate,
  toDate,
  userIds,
  setFromDate,
  setToDate,
  setUserIds,
  usersList,
  showTasks,
  showProjects,
  setShowTasks,
  setShowProjects
}) => {
  const handleUserChange = (event: SelectChangeEvent<string[]>) => {
    setUserIds(event.target.value as string[]);
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
          Set a date range and users to view report
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="From Date"
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
            label="To Date"
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
        <FormControl fullWidth>
          <InputLabel id="user-id-label">Users</InputLabel>
          <Select
            labelId="user-id-label"
            id="user-ids"
            multiple
            value={userIds}
            onChange={handleUserChange}
            input={<OutlinedInput label="User IDs" />}
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
              <MenuItem disabled>No users available</MenuItem>
            )}
          </Select>
        </FormControl>

        <Stack direction="row" spacing={2}>
          <FormControlLabel
            control={
              <Checkbox checked={showTasks} onChange={(e) => setShowTasks(e.target.checked)} />
            }
            label="Tasks"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showProjects}
                onChange={(e) => setShowProjects(e.target.checked)}
              />
            }
            label="Projects"
          />
        </Stack>
      </Stack>
    </Paper>
  );
};

export default FiltersPanel;
