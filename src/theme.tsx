import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#D32F2F", // Propaganda Red
    },
    secondary: {
      main: "#757575", // Industrial Gray
    },
    background: {
      default: "#0a0a0a", // Very Dark Gray
      paper: "#1a1a1a", // Dark Industrial Gray
    },
    text: {
      primary: "#e0e0e0", // Off-white / Terminal text
      secondary: "#b0b0b0",
    },
    divider: "#333333",
  },
  shape: {
    borderRadius: 0, // Square corners for industrial look
  },
  typography: {
    fontFamily: "'Share Tech Mono', monospace",
    h1: { textTransform: "uppercase", letterSpacing: "0.1em" },
    h2: { textTransform: "uppercase", letterSpacing: "0.1em" },
    h3: { textTransform: "uppercase", letterSpacing: "0.1em" },
    h4: { textTransform: "uppercase", letterSpacing: "0.1em" },
    h5: { textTransform: "uppercase", letterSpacing: "0.1em" },
    h6: { textTransform: "uppercase", letterSpacing: "0.1em" },
    button: {
      textTransform: "uppercase",
      fontWeight: 600,
      letterSpacing: "0.05em",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#0a0a0a",
          color: "#D32F2F",
          boxShadow: "none",
          borderBottom: "1px solid #D32F2F",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: "none",
          border: "1px solid transparent",
          "&:hover": {
            border: "1px solid #D32F2F",
            backgroundColor: "rgba(211, 47, 47, 0.1)",
          },
        },
        containedPrimary: {
          backgroundColor: "#D32F2F",
          color: "#000",
          "&:hover": {
            backgroundColor: "#B71C1C",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "none",
          border: "1px solid #333333",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        body: {
          backgroundColor: "#0a0a0a",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        "*": {
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      },
    },
  },
});

export default theme;
