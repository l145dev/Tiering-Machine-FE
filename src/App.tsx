import { Box, CssBaseline, Typography } from "@mui/material";
import Navbar from "./components/Navbar";
import ComplianceMonitor from "./components/ComplianceMonitor";

function App() {
  return (
    <>
      <CssBaseline />
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Navbar />
        <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
          {/* Left Column */}
          <Box
            sx={{
              width: "20%",
              borderRight: "1px solid",
              borderColor: "divider",
              p: 2,
            }}
          >
            <Typography variant="h6">Left Sidebar</Typography>
            <Typography variant="body2" color="text.secondary">
              Navigation or filters go here.
            </Typography>
          </Box>

          {/* Middle Column */}
          <Box
            component="main"
            sx={{
              width: "60%",
              p: 3,
              overflowY: "auto",
            }}
          >
            <Typography variant="h4" gutterBottom>
              🔴 Surveillance System Active
            </Typography>
            <Typography gutterBottom>
              The ComplianceMonitor is now streaming your webcam to the backend for facial recognition analysis.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Look at the bottom-right corner to see the live feed and status.
            </Typography>
          </Box>

          {/* Right Column */}
          <Box
            sx={{
              width: "20%",
              borderLeft: "1px solid",
              borderColor: "divider",
              p: 2,
            }}
          >
            <Typography variant="h6">Right Sidebar</Typography>
            <Typography variant="body2" color="text.secondary">
              Details or extra info go here.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Surveillance Component */}
      <ComplianceMonitor citizenId="CITIZEN-001" />
    </>
  );
}

export default App;
