// src/app/theme/theme.ts
"use client";

import { createTheme } from "@mui/material/styles";

// Updated Brand Colors
const PRIMARY_PURPLE = "#741B92"; // From your base
const SECONDARY_LAVENDER = "#D6C4E4"; // From your base
const ACCENT_ORANGE = "#F59E0B";
const BACKGROUND = "#F8FAFC";
const CARD = "#FFFFFF";
const TEXT_PRIMARY = "#1F2937";
const TEXT_SECONDARY = "#6B7280";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: PRIMARY_PURPLE,
      contrastText: "#FFFFFF"
    },
    secondary: {
      main: SECONDARY_LAVENDER,
      contrastText: "#311B47"
    },
    background: {
      default: BACKGROUND,
      paper: CARD
    },
    text: {
      primary: TEXT_PRIMARY,
      secondary: TEXT_SECONDARY
    },
    warning: {
      main: ACCENT_ORANGE
    },
    success: {
      main: "#22C55E"
    },
    error: {
      main: "#EF4444"
    },
    info: {
      main: "#0EA5E9"
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
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 700,
      fontSize: "2rem",
      color: TEXT_PRIMARY
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.5rem",
      color: TEXT_PRIMARY
    },
    body1: {
      fontSize: "1rem",
      color: TEXT_PRIMARY
    },
    body2: {
      fontSize: "0.875rem",
      color: TEXT_SECONDARY
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)"
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
          fontWeight: 600
        }
      }
    }
  }
});
