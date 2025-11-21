import { Box, Typography } from "@mui/material";

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
      <Typography variant="h6">Ads/Events</Typography>
      <Typography variant="body2" color="text.secondary">
        Ads/Events go here.
      </Typography>
    </Box>
  );
};

export default Left;
