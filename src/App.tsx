import { Box, CssBaseline } from "@mui/material";
import Left from "./components/layout/Left";
import Middle from "./components/layout/Middle";
import Right from "./components/layout/Right";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import { useUser } from "./context/UserContext";

function App() {
  const { isAuthenticated, user } = useUser();

  // Show login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <>
        <CssBaseline />
        <Login />
      </>
    );
  }

  // Show main app if authenticated
  return (
    <>
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
    </>
  );
}

export default App;
