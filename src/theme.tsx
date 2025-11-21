import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#262626", // Dark Gray / Black
    },
    secondary: {
      main: "#757575", // Lighter Gray
    },
    background: {
      default: "#FFFFFF", // White background
      paper: "#FFFFFF", // White paper
    },
    text: {
      primary: "#172B4D", // Jira dark blue-gray
      secondary: "#6B778C",
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#172B4D",
          boxShadow: "none",
          borderBottom: "1px solid #E0E0E0",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedPrimary: {
          backgroundColor: "#262626",
          "&:hover": {
            backgroundColor: "#424242",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: "1px solid #E0E0E0",
        },
        elevation1: {
          boxShadow: "none",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#FFFFFF",
        },
      },
    },
  },
});

export default theme;
