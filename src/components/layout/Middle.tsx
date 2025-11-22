import { Box, Typography } from "@mui/material";
import Leaderboard from "../Leaderboard";
import Marquee from "../Marquee";
import MacrodataRefinement from "../MacrodataRefinement";

const Middle = () => {
  return (
    <Box
      component="main"
      sx={{
        width: "60%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRight: "1px solid",
        borderColor: "divider",
        bgcolor: "#010A13",
      }}
    >
      <Marquee />

      {/* Macrodata Refinement Game Area */}
      <Box sx={{ flexGrow: 1, position: "relative", minHeight: 0, overflow: "hidden" }}>
        <MacrodataRefinement />

        {/* Overlay Title */}
        <Box sx={{ position: 'absolute', top: 10, left: 20, pointerEvents: 'none' }}>
          <Typography variant="h6" sx={{ opacity: 0.7, color: '#ABFFE9' }}>Macrodata Refinement</Typography>
        </Box>
      </Box>

      <Box sx={{ height: "30%", minHeight: "200px", borderTop: "1px solid", borderColor: "divider" }}>
        <Box sx={{ p: 1 }}>
          <Typography variant="subtitle2">Leaderboard</Typography>
        </Box>
        <Leaderboard />
      </Box>
    </Box>
  );
};

export default Middle;
