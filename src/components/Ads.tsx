import { Box, Paper } from "@mui/material";
import { useMemo } from "react";
import ads from "../data/ads";

const Ads = () => {
  const randomAds = useMemo(() => {
    // Shuffle array and pick first 3
    return [...ads].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, []);

  return (
    <Box
      sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 2 }}
    >
      {randomAds.map((ad, index) => (
        <Paper
          key={index}
          elevation={1}
          component="a"
          href="#"
          onClick={(e) => e.preventDefault()} // Prevent navigation for now
          sx={{
            flex: 1,
            display: "flex",
            bgcolor: "background.paper",
            overflow: "hidden",
            textDecoration: "none",
            p: 0, // Remove padding
          }}
        >
          <Box
            component="img"
            src={new URL(`../assets/${ad}`, import.meta.url).href}
            alt="Advertisement"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Paper>
      ))}
    </Box>
  );
};

export default Ads;
