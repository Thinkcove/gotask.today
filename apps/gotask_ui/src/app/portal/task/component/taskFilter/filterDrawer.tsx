import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Slider,
  TextField,
  Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { forwardRef, useImperativeHandle, useState } from "react";
import { fetchAllProjects, fetchAllUsers } from "../../service/taskAction";
import { TASK_SEVERITY, TASK_STATUS } from "@/app/common/constants/task";
import { SelectOption } from "@/app/component/formField";
import { FilterValues, TaskFilterType, TaskPayload } from "../../interface/taskInterface";
// import { useMediaQuery, useTheme } from "@mui/material";

export interface TaskFilterDrawerRef {
  resetFilters: () => void;
}

interface TaskFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApplyFilters?: (filters: TaskFilterType) => void;
}

const TaskFilterDrawer = forwardRef<TaskFilterDrawerRef, TaskFilterDrawerProps>(
  ({ open, onClose, onApplyFilters }, ref) => {
    const [selectedFilters, setSelectedFilters] = useState<FilterValues>({
      severity: [],
      status: [],
      dateFrom: "",
      dateTo: "",
      projects: [],
      users: [],
      variationType: "",
      variationDays: 0
    });

    // Expose reset method to parent via ref
    useImperativeHandle(ref, () => ({
      resetFilters: () => {
        setSelectedFilters({
          severity: [],
          status: [],
          dateFrom: "",
          dateTo: "",
          projects: [],
          users: [],
          variationType: "",
          variationDays: 0
        });
      }
    }));
    // const theme = useTheme();
    // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const toggleCheckbox = (group: keyof FilterValues, value: string) => {
      setSelectedFilters((prev) => {
        const groupValue = prev[group];
        if (Array.isArray(groupValue)) {
          const isChecked = groupValue.includes(value);
          return {
            ...prev,
            [group]: isChecked ? groupValue.filter((v) => v !== value) : [...groupValue, value]
          };
        }
        return prev;
      });
    };

    const renderCheckboxList = (group: keyof FilterValues, options: string[]) => (
      <FormGroup>
        {options.map((option) => {
          const groupValue = selectedFilters[group];
          const isChecked = Array.isArray(groupValue) && groupValue.includes(option);

          return (
            <FormControlLabel
              key={option}
              control={
                <Checkbox checked={isChecked} onChange={() => toggleCheckbox(group, option)} />
              }
              label={option}
            />
          );
        })}
      </FormGroup>
    );

    const handleApply = () => {
      const search_vals: string[][] = [];
      const search_vars: string[][] = [];

      const fieldMapping: Record<string, string> = {
        projects: "project_name",
        users: "user_name",
        status: "status",
        severity: "severity"
      };

      Object.entries(selectedFilters).forEach(([key, values]) => {
        if (Array.isArray(values) && values.length > 0) {
          const searchVar = fieldMapping[key] || key;
          values.forEach((val) => {
            search_vals.push([val]);
            search_vars.push([searchVar]);
          });
        }
      });

      const payload: TaskPayload = {
        search_vals,
        search_vars
      };

      if (selectedFilters.dateFrom) {
        payload.min_date = selectedFilters.dateFrom;
        payload.date_var = "due_date";
      }

      if (selectedFilters.dateTo) {
        payload.max_date = selectedFilters.dateTo;
        payload.date_var = "due_date";
      }

      if (selectedFilters.variationType && selectedFilters.variationDays > 0) {
        const key = selectedFilters.variationType === "more" ? "more_variation" : "less_variation";
        payload[key] = `${selectedFilters.variationDays}d`;
      }

      onApplyFilters?.(payload);
      onClose();
    };

    const [expandedPanel, setExpandedPanel] = useState<string | false>(false);
    const handleAccordionChange =
      (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedPanel(isExpanded ? panel : false);
      };

    const { getAllProjects: allProjects } = fetchAllProjects();
    const { getAllUsers: allUsers } = fetchAllUsers();

    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: 340,
            display: "flex",
            flexDirection: "column"
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Filter</Typography>
        </Box>

        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {/* Project */}
          <Accordion
            disableGutters
            elevation={0}
            expanded={expandedPanel === "project_name"}
            onChange={handleAccordionChange("project_name")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                px: 2,
                backgroundColor: expandedPanel === "project_name" ? "#E1D7E0" : "transparent"
              }}
            >
              <Typography>Filter by Project</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ maxHeight: 150, overflowY: "auto", px: 2 }}>
              {renderCheckboxList(
                "projects",
                allProjects.map((p: SelectOption) => p.name)
              )}
            </AccordionDetails>
          </Accordion>

          {/* User */}
          <Accordion
            disableGutters
            elevation={0}
            expanded={expandedPanel === "user_name"}
            onChange={handleAccordionChange("user_name")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                px: 2,
                backgroundColor: expandedPanel === "user_name" ? "#E1D7E0" : "transparent"
              }}
            >
              <Typography>Filter by User</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ maxHeight: 150, overflowY: "auto", px: 2 }}>
              {renderCheckboxList(
                "users",
                allUsers.map((u: SelectOption) => u.name)
              )}
            </AccordionDetails>
          </Accordion>

          {/* Status */}
          <Accordion
            disableGutters
            elevation={0}
            expanded={expandedPanel === "status"}
            onChange={handleAccordionChange("status")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                px: 2,
                backgroundColor: expandedPanel === "status" ? "#E1D7E0" : "transparent"
              }}
            >
              <Typography>Filter by Status</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ maxHeight: 150, overflowY: "auto", px: 2 }}>
              {renderCheckboxList("status", Object.values(TASK_STATUS))}
            </AccordionDetails>
          </Accordion>

          {/* Severity */}
          <Accordion
            disableGutters
            elevation={0}
            expanded={expandedPanel === "severity"}
            onChange={handleAccordionChange("severity")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                px: 2,
                backgroundColor: expandedPanel === "severity" ? "#E1D7E0" : "transparent"
              }}
            >
              <Typography>Filter by Severity</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ maxHeight: 150, overflowY: "auto", px: 2 }}>
              {renderCheckboxList("severity", Object.values(TASK_SEVERITY))}
            </AccordionDetails>
          </Accordion>

          {/* Due Date */}
          <Accordion
            disableGutters
            elevation={0}
            expanded={expandedPanel === "bydate"}
            onChange={handleAccordionChange("bydate")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                px: 2,
                backgroundColor: expandedPanel === "bydate" ? "#E1D7E0" : "transparent"
              }}
            >
              <Typography>Filter by Due Date</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ gap: 2, px: 2 }}>
              <Box sx={{ py: 1, display: "flex", flexDirection: "row", gap: 2 }}>
                <TextField
                  label="From"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={selectedFilters.dateFrom}
                  onChange={(e) =>
                    setSelectedFilters((prev) => ({ ...prev, dateFrom: e.target.value }))
                  }
                />
                <TextField
                  label="To"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={selectedFilters.dateTo}
                  onChange={(e) =>
                    setSelectedFilters((prev) => ({ ...prev, dateTo: e.target.value }))
                  }
                />
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Variation */}
          <Accordion
            disableGutters
            elevation={0}
            expanded={expandedPanel === "variation"}
            onChange={handleAccordionChange("variation")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                px: 2,
                backgroundColor: expandedPanel === "variation" ? "#E1D7E0" : "transparent"
              }}
            >
              <Typography>Filter by Variation</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: 2, px: 2 }}>
              <FormControl component="fieldset">
                <RadioGroup
                  value={selectedFilters.variationType}
                  onChange={(e) =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      variationType: e.target.value as "more" | "less"
                    }))
                  }
                >
                  <FormControlLabel value="more" control={<Radio />} label="More Variation" />
                  <FormControlLabel value="less" control={<Radio />} label="Less Variation" />
                </RadioGroup>
              </FormControl>
              {selectedFilters.variationType && (
                <Box sx={{ px: 2 }}>
                  <Typography variant="body2">Days: {selectedFilters.variationDays}d</Typography>
                  <Slider
                    value={selectedFilters.variationDays}
                    onChange={(_, newValue) =>
                      setSelectedFilters((prev) => ({
                        ...prev,
                        variationDays: newValue as number
                      }))
                    }
                    min={1}
                    max={30}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* Buttons */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            gap: 1,
            justifyContent: "space-between"
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            onClick={() => {
              setSelectedFilters({
                severity: [],
                status: [],
                dateFrom: "",
                dateTo: "",
                projects: [],
                users: [],
                variationType: "",
                variationDays: 0
              });
              onClose();
            }}
            sx={{
              bgcolor: "white",
              textTransform: "none",
              borderColor: "#741B92",
              color: "#741B92"
            }}
          >
            Cancel
          </Button>

          <Button
            fullWidth
            variant="contained"
            onClick={handleApply}
            sx={{ bgcolor: "#741B92", textTransform: "none" }}
          >
            Apply Filter
          </Button>
        </Box>
      </Drawer>
    );
  }
);

export default TaskFilterDrawer;
