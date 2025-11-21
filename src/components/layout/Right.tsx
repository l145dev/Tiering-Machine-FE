import { Box, Typography } from "@mui/material";

const Right = () => {
  return (
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
  );
};

export default Right;
