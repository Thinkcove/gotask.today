"use client";
import { createTheme } from "@mui/material/styles";

// Define your theme
export const theme = createTheme({
  palette: {
    primary: {
      main: "#741B92"
    },
    secondary: {
      main: "#D6C4E4"
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  }
});
