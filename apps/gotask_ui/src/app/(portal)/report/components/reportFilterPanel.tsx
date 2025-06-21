"use client";
import React from "react";
import {
  TextField,
  FormControlLabel,
  Box,
  Stack,
  Typography,
  Paper,
  Checkbox
} from "@mui/material";
import { User } from "../../user/interfaces/userInterface";
import { Project } from "../../project/interfaces/projectInterface";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import MultiSelectFilter from "@/app/component/multiSelect/multiSelectFilter";

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
  projectsList: Project[];
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

        <MultiSelectFilter
          label={transreport("labelUser")}
          placeholder={transreport("placeholderUser")}
          selectedIds={userIds}
          items={usersList}
          onChange={setUserIds}
          listBoxProps={{
            style: {
              maxHeight: 5 * 48,
              overflowY: "auto"
            }
          }}
        />

        <MultiSelectFilter
          label={transreport("labelProject")}
          placeholder={transreport("placeholderProject")}
          selectedIds={projectIds}
          items={projectsList}
          onChange={setProjectIds}
          listBoxProps={{
            style: {
              maxHeight: 5 * 48,
              overflowY: "auto"
            }
          }}
        />

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
