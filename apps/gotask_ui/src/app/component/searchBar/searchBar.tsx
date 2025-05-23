import React, { useRef } from "react";
import { InputBase, IconButton, Paper, alpha, SxProps, Theme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  sx?: SxProps<Theme>;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder, sx }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const clear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <Paper
      elevation={0}
      sx={{
        backdropFilter: "blur(10px)",
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.4),
        borderRadius: "30px",
        px: 1,
        py: 0.5,
        width: "100%",
        mx: "auto",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 4px 30px rgba(0,0,0,0.02)",
        border: "2px solid rgb(195, 144, 212)",
        ...sx
      }}
    >
      <SearchIcon sx={{ color: "#741B92", mr: 1 }} />
      <InputBase
        inputRef={inputRef}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          flex: 1,
          color: "#333",
          fontSize: 16
        }}
      />
      <IconButton onClick={clear} size="small" sx={{ visibility: value ? "visible" : "hidden" }}>
        <CloseIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
