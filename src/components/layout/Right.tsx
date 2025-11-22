import { Box } from "@mui/material";
import Betting from "../Betting";

const Right = () => {
  return (
    <Box
      sx={{
        width: "20%",
        borderLeft: "1px solid",
        borderColor: "divider",
        p: 2,
        overflow: "hidden", // Ensure internal scrolling works if needed
      }}
    >
      <Betting />
    </Box>
  );
};

export default Right;
