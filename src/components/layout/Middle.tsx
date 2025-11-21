import { Box, Typography } from "@mui/material";
import Leaderboard from "../Leaderboard";

const Middle = () => {
  return (
    <Box
      component="main"
      sx={{
        width: "60%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        pt: 2,
      }}
    >
      <Typography variant="h4" gutterBottom pl={2}>
        Leaderboard
      </Typography>
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <Leaderboard />
      </Box>
    </Box>
  );
};

export default Middle;
