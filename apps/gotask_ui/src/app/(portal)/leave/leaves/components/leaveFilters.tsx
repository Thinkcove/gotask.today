import React from "react";
import { 
  Box, 
  Link, 
  Chip, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  OutlinedInput,
  TextField 
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

interface Props {
  userIdFilter: string[];
  leaveTypeFilter: string[];
  fromDate: string;
  toDate: string;
  allUserIds: string[];
  allUserNames: string[];
  allLeaveTypes: string[];
  onUserIdChange: (val: string[]) => void;
  onLeaveTypeChange: (val: string[]) => void;
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  onClearFilters: () => void;
  trans: (key: string) => string;
}

const LeaveFilters: React.FC<Props> = ({
  userIdFilter,
  leaveTypeFilter,
  fromDate,
  toDate,
  allUserIds,
  allUserNames,
  allLeaveTypes,
  onUserIdChange,
  onLeaveTypeChange,
  onFromDateChange,
  onToDateChange,
  onClearFilters,
  trans
}) => {
  const appliedFilterCount =
    (userIdFilter.length > 0 ? 1 : 0) +
    (leaveTypeFilter.length > 0 ? 1 : 0) +
    (fromDate ? 1 : 0) +
    (toDate ? 1 : 0);

  const handleUserIdChange = (event: SelectChangeEvent<string[]>) => {
    const selectedUserNames = event.target.value as string[];
    const userIdMap = allUserIds.reduce((map, id, index) => {
      map[allUserNames[index]] = id;
      return map;
    }, {} as Record<string, string>);
    const selectedUserIds = selectedUserNames.map(name => userIdMap[name] || name);
    onUserIdChange(selectedUserIds);
  };

  const handleLeaveTypeChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onLeaveTypeChange(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "nowrap",
          overflowX: "auto",
          px: 2,
          py: 1,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" }
        }}
      >
        {/* User Name Filter (displaying usernames, filtering by user_id) */}
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>User Name</InputLabel>
          <Select
            multiple
            value={userIdFilter.map(id => {
              const index = allUserIds.indexOf(id);
              return index !== -1 ? allUserNames[index] : id;
            })}
            onChange={handleUserIdChange}
            input={<OutlinedInput label="User Name" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                  width: 250,
                },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#e0e0e0",
                },
                "&:hover fieldset": {
                  borderColor: "#741B92",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#741B92",
                  borderWidth: "2px",
                },
              },
            }}
          >
            {allUserNames.map((name, index) => (
              <MenuItem key={name} value={name}>
                <input
                  type="checkbox"
                  checked={userIdFilter.includes(allUserIds[index])}
                  onChange={() => {}}
                  style={{ marginRight: 8 }}
                />
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Leave Type Filter */}
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Leave Type</InputLabel>
          <Select
            multiple
            value={leaveTypeFilter}
            onChange={handleLeaveTypeChange}
            input={<OutlinedInput label="Leave Type" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#e0e0e0",
                },
                "&:hover fieldset": {
                  borderColor: "#741B92",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#741B92",
                  borderWidth: "2px",
                },
              },
            }}
          >
            {allLeaveTypes.map((type) => (
              <MenuItem key={type} value={type}>
                <input
                  type="checkbox"
                  checked={leaveTypeFilter.includes(type)}
                  onChange={() => {}}
                  style={{ marginRight: 8 }}
                />
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* From Date Filter */}
        <TextField
          label={trans("from") || "From Date"}
          type="date"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
          InputLabelProps={{
            shrink: true,
            sx: {
              fontSize: "1rem"
            }
          }}
          InputProps={{
            sx: {
              height: 40
            }
          }}
        />

        {/* To Date Filter */}
        <TextField
          label={trans("to") || "To Date"}
          type="date"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
          InputLabelProps={{
            shrink: true,
            sx: {
              fontSize: "1rem"
            }
          }}
          InputProps={{
            sx: {
              height: 40
            }
          }}
        />
      </Box>

      {/* Clear Filters Link */}
      {appliedFilterCount > 0 && (
        <Box sx={{ pl: 2, pb: 1 }}>
          <Link
            component="button"
            onClick={onClearFilters}
            underline="always"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 300,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            {`Clear All Filters (${appliedFilterCount})`}
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default LeaveFilters;