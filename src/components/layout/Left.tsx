import { Box } from "@mui/material";
import { useUser } from "../../context/UserContext";

import Events from "../Events";

const Left = () => {
  const { user } = useUser();

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
      {user?.tier === "elite" ? <Events /> : <Events />}
    </Box>
  );
};

export default Left;
