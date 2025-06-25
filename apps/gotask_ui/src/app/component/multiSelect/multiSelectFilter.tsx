"use client";
import React from "react";
import { Autocomplete, TextField, Checkbox, Chip, Tooltip } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { getMultiSelectStyles } from "./multiSelect";

interface Item {
  id: string;
  name: string | null | undefined;
}

interface MultiSelectFilterProps<T extends Item> {
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
}

const MultiSelectFilter = <T extends Item>({
  selectedIds,
  items,
  onChange,
  placeholder,
  sxRoot = {},
  sxInputBase = {},
  sxInput = {},
  sxChip = {},
  listBoxProps = {}
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
      sx={getMultiSelectStyles(sxRoot, sxInputBase, sxInput, sxChip)}
      renderOption={(props, option, { selected }) => {
        const isSelectAllOption = option.id === SELECT_ALL_ID;
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
        <TextField
          {...params}
          placeholder={placeholder}
          fullWidth
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            ...params.InputProps,
            style: { alignItems: "center" }
          }}
        />
      )}
      renderTags={(tagValue, getTagProps) => {
        const visibleTags = tagValue.slice(0, 3);
        const hiddenTags = tagValue.slice(3);

        return [
          ...visibleTags.map((option, index) => (
            <Chip label={option.name || option.id} {...getTagProps({ index })} key={option.id} />
          )),
          hiddenTags.length > 0 && (
            <Tooltip
              key="more"
              title={hiddenTags.map((option) => option.name || option.id).join(", ")}
            >
              <Chip label={`+${hiddenTags.length}`} />
            </Tooltip>
          )
        ];
      }}
    />
  );
};

export default MultiSelectFilter;
