"use client";
import React from "react";
import { Autocomplete, TextField, Checkbox, Chip } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { getMultiSelectStyles } from "./multiSelect";

interface Item {
  id: string;
  name: string | null | undefined;
}

interface MultiSelectFilterProps<T extends Item> {
  label: string;
  placeholder: string;
  selectedIds: string[];
  items: T[];
  onChange: (ids: string[]) => void;
  searchTerm?: string;
  sxRoot?: object;
  sxInputBase?: object;
  sxInput?: object;
  sxChip?: object;
  listBoxProps?: Partial<React.HTMLAttributes<HTMLElement>>;
  customWidth?: string | number | object;
}

const MultiSelectFilter = <T extends Item>({
  selectedIds,
  items,
  onChange,
  label,
  placeholder,
  sxRoot = {},
  sxInputBase = {},
  sxInput = {},
  sxChip = {},
  listBoxProps = {},
  customWidth
}: MultiSelectFilterProps<T>) => {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const SELECT_ALL_ID = "__all__";
  const selectAllItem = { id: SELECT_ALL_ID, name: "All" } as T;
  const options = [selectAllItem, ...items];

  const selectedItems = items.filter((item) => selectedIds.includes(item.id));
  const allSelected = selectedItems.length === items.length;

  const handleChange = (_: React.SyntheticEvent, newValue: T[]) => {
    const isSelectAllClicked = newValue.some((item) => item.id === SELECT_ALL_ID);
    if (isSelectAllClicked) {
      if (allSelected) {
        onChange([]);
      } else {
        onChange(items.map((item) => item.id));
      }
    } else {
      onChange(newValue.map((item) => item.id));
    }
  };

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      options={options}
      value={selectedItems}
      onChange={handleChange}
      getOptionLabel={(option) => option.name || option.id}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      ListboxProps={listBoxProps}
      sx={getMultiSelectStyles(sxRoot, sxInputBase, sxInput, sxChip, customWidth)}
      renderOption={(props, option, { selected }) => {
        const isSelectAllOption = option.id === "__all__";
        return (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              checked={isSelectAllOption ? allSelected : selected}
              style={{ marginRight: 8 }}
            />
            {option.name || option.id}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} fullWidth />
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip label={option.name || option.id} {...getTagProps({ index })} key={option.id} />
        ))
      }
    />
  );
};

export default MultiSelectFilter;
