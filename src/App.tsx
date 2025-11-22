import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useEffect } from "react";
import Left from "./components/layout/Left";
import Middle from "./components/layout/Middle";
import Right from "./components/layout/Right";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
// import PopupManager from "./components/PopupManager";
import { useUser } from "./context/UserContext";
import { defaultTheme, eliteTheme } from "./theme";

function App() {
  const { isAuthenticated, user } = useUser();

  const currentTheme = user?.tier === "elite" ? eliteTheme : defaultTheme;

  useEffect(() => {
    if (user?.tier === "elite") {
      document.body.classList.add("elite-tier");
    } else {
      document.body.classList.remove("elite-tier");
    }
  }, [user?.tier]);

  // Show login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Login />
      </ThemeProvider>
    );
  }

  // Show main app if authenticated
  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      {/* <PopupManager /> */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <Navbar />
        <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
          {/* Left Column - Ads/Events */}
          <Left />

          {/* Middle Column - Main Content */}
          <Middle />

          {/* Right Column - Betting */}
          <Right />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
