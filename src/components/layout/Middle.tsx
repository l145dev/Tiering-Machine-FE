import { Box, Typography } from "@mui/material";
import Leaderboard from "../Leaderboard";
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
      }}
    >
      <Marquee />
      <Box sx={{ pt: 2, pl: 2 }}>
        <Typography variant="h4">Leaderboard</Typography>
      </Box>
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <Leaderboard />
      </Box>
    </Box>
  );
};

export default Middle;
