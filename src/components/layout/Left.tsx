import { Box } from "@mui/material";
import Ads from "../Ads";

const Left = () => {
  return (
    <Box
      sx={{
        width: "20%",
        borderRight: "1px solid",
        borderColor: "divider",
        p: 2,
      }}
    >
      <Ads />
    </Box>
  );
};

export default Left;
