import React from "react";
import {
  TextField,
  Box,
  Stack,
  Typography,
  Paper
} from "@mui/material";
import { User } from "../interface/workPlanned";
import { Project } from "../../task/interface/taskInterface";
import { useTranslations } from "next-intl";
import MultiSelectFilter from "@/app/component/multiSelect/multiSelectFilter";
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
          {transworkplanned("filterheader")}
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
        <MultiSelectFilter
          placeholder={transreport("userlist")}
          selectedIds={userIds}
          items={usersList}
          onChange={setUserIds}
          listBoxProps={{
            style: {
              maxHeight: 5 * 48,
              overflowY: "auto",
            },
          }}
        />

        {/* Project Filter */}
        <MultiSelectFilter
          placeholder={transreport("projectlist")}
          selectedIds={projectIds}
          items={projectsList}
          onChange={setProjectIds}
          listBoxProps={{
            style: {
              maxHeight: 5 * 48,
              overflowY: "auto",
            },
          }}
        />
      </Stack>
    </Paper>
  );
};

export default WorkPlannedFiltersPanel;
