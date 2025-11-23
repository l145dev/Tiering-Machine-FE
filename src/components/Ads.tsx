import { Box, Paper } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import ads from "../data/ads";

const Ads = () => {
  const randomAds = useMemo(() => {
    // Shuffle array and pick first 3
    return [...ads].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, []);

  // State to track the current hue rotation value
  const [filterStyle, setFilterStyle] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      // Generate a random hue rotation to shift RGB values
      const randomHue = Math.floor(Math.random() * 360);
      // Apply hue-rotate and slightly boost contrast/saturation for effect
      setFilterStyle(`hue-rotate(${randomHue}deg) contrast(1.2) saturate(1.5)`);
    }, 200); // Updates every 0.5 seconds

    return () => clearInterval(interval);
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
            position: "relative", // For potential overlays
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
              filter: filterStyle, // Apply the dynamic filter
              transition: "filter 0.01s steps(1)", // Slight transition for glitch effect, or remove for instant
            }}
          />

          {/* Optional: Add a color overlay for more intense RGB tinting */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bgcolor: "rgba(0,0,0,0.1)",
              mixBlendMode: "overlay",
              pointerEvents: "none",
            }}
          />
        </Paper>
      ))}
    </Box>
  );
};

export default Ads;