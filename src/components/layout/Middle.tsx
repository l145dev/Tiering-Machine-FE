import { Box } from "@mui/material";
import Leaderboard from "../Leaderboard";
import MacrodataRefinement from "../MacrodataRefinement";
import Marquee from "../Marquee";

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
        bgcolor: "background.default",
      }}
    >
      <Marquee />

      {/* Macrodata Refinement Game Area */}
      <Box
        sx={{
          flex: "1 1 0",
          position: "relative",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <MacrodataRefinement />
      </Box>

      {/* Leaderboard Section */}
      <Box
        sx={{
          height: "35%",
          minHeight: "200px",
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <Leaderboard />
        </Box>
      </Box>
    </Box>
  );
};

export default Middle;
