import { Autocomplete, TextField, Popper, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

interface FilterDropdownProps {
  label: string;
  options: string[];
  selected: string | string[];
  onChange: (newSelection: any) => void;
  singleSelect?: boolean;
}

// Popper with subtle shadow and rounded corners
const StyledPopper = styled(Popper)(({ theme }) => ({
  maxWidth: 220,
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.12)",
  backgroundColor: theme.palette.background.paper
}));

// Autocomplete with light border, subtle focus effect, and clean chips
const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  minWidth: 220,
  maxWidth: 220,
  ".MuiAutocomplete-inputRoot": {
    flexWrap: "nowrap !important",
    overflow: "hidden",
    height: 42,
    padding: theme.spacing(0.5, 1),
    borderRadius: 12,
    backgroundColor: theme.palette.common.white,
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:hover": {
      borderColor: theme.palette.grey[400]
    }
  },
  ".MuiAutocomplete-tag": {
    maxWidth: 110,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.primary,
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    marginRight: theme.spacing(0.5),
    height: 26,
    display: "flex",
    alignItems: "center"
  },
  ".MuiAutocomplete-input": {
    fontSize: 14,
    paddingLeft: 4
  }
}));

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  selected,
  onChange,
  singleSelect = false
}) => {
  return (
    <StyledAutocomplete
      multiple={!singleSelect}
      options={options}
      value={singleSelect ? selected[0] || "" : selected}
      onChange={(_, newValue) => {
        if (singleSelect) {
          onChange(newValue ? [newValue as string] : []);
        } else {
          onChange(newValue as string[]);
        }
      }}
      filterSelectedOptions
      getOptionLabel={(option) => option as string}
      renderTags={(value: unknown[], getTagProps) =>
        (value as string[]).map((option, index) => {
          const { key, ...chipProps } = getTagProps({ index });
          return <Chip key={key} label={option} variant="outlined" size="small" {...chipProps} />;
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={label}
          size="small"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            style: { alignItems: "center" }
          }}
        />
      )}
      PopperComponent={StyledPopper}
      ListboxProps={{ style: { maxHeight: 280, overflowY: "auto" } }}
    />
  );
};

export default FilterDropdown;
