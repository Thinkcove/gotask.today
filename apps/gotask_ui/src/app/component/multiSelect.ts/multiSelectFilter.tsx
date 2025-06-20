"use client";
import React from "react";
import { Autocomplete, TextField, Checkbox, Chip } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

interface Item {
  id: string;
  name: string | null | undefined;
}

type ReportTranslationKeys =
  | "userlist"
  | "projectlist"
  | "nousers"
  | "noprojects"
  | "all"
  | "filtertitle"
  | "from"
  | "to"
  | "showtasks";

interface MultiSelectFilterProps<T extends Item> {
  label: string;
  selectedIds: string[];
  items: T[];
  onChange: (ids: string[]) => void;
  noItemsKey: ReportTranslationKeys;
  searchTerm?: string;
  placeholder: string;
}

const MultiSelectFilter = <T extends Item>({
  selectedIds,
  items,
  onChange,
  noItemsKey,
  label,
  placeholder
}: MultiSelectFilterProps<T>) => {
  const transreport = useTranslations(LOCALIZATION.TRANSITION.REPORT);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const SELECT_ALL_ID = "__all__";
  const selectAllItem = { id: SELECT_ALL_ID, name: transreport("all") } as T;
  const options = [selectAllItem, ...items];

  const selectedItems = (items || []).filter((item) => selectedIds.includes(item.id));

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
      sx={{
        width: "360px", // Set your fixed width here
        "& .MuiInputBase-root": {
          padding: "14px",
          minHeight: "48px",
          borderRadius: "8px"
        },
        "& .MuiInputBase-input": {
          padding: 0
        }
      }}
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
        <TextField {...params} label={label} placeholder={placeholder || label} fullWidth />
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip label={option.name || option.id} {...getTagProps({ index })} key={option.id} />
        ))
      }
      noOptionsText={transreport(noItemsKey)}
    />
  );
};

export default MultiSelectFilter;
