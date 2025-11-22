import { Box } from "@mui/material";
// import Ads from "../Ads";
import Events from "../Events";

const Left = () => {
  return (
    <Box
      sx={{
        width: "20%",
        borderRight: "1px solid",
        borderColor: "divider",
        p: 2,
        overflow: "hidden",
      }}
    >
      {/* <Ads /> */}
      <Events />
    </Box>
  );
};

export default Left;
