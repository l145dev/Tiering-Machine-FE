import { Box, CssBaseline, Typography } from "@mui/material";
import Navbar from "./components/Navbar";

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
              Main Content
            </Typography>
            <Typography>
              This is the main content area taking up 60% of the width.
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
    </>
  );
}

export default App;
