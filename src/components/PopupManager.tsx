import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../context/UserContext";
import ads from "../data/ads";
import insults from "../data/insults";

// Helper to get random item from array
const getRandomItem = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

// Helper to get random position
const getRandomPosition = () => ({
  top: `${Math.floor(Math.random() * 70) + 10}%`, // 10-80% (Wider range)
  left: `${Math.floor(Math.random() * 70) + 10}%`, // 10-80%
});

const PopupManager = () => {
  const { user } = useUser();
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState<{
    type: "ad" | "insult";
    data: string;
  } | null>(null);
  const [position, setPosition] = useState({ top: "50%", left: "50%" });

  // Annoyance tracking
  const [teleportCount, setTeleportCount] = useState(0);
  const hoverRef = useRef<number>(0);

  useEffect(() => {
    if (user?.tier !== "dreg") {
      setIsVisible(false);
      return;
    }

    // Spawn a new popup every 15 seconds (increased frequency for annoyance)
    const spawnInterval = setInterval(() => {
      // 50/50 chance for Ad or Insult
      const isAd = Math.random() > 0.5;
      const type = isAd ? "ad" : "insult";
      const data = isAd ? getRandomItem(ads) : getRandomItem(insults);

      setContent({ type, data });
      setPosition(getRandomPosition());
      setTeleportCount(0); // Reset the chase counter
      setIsVisible(true);
    }, 15000);

    return () => clearInterval(spawnInterval);
  }, [user?.tier]);

  // Auto-wander effect: Moves the popup every 2 seconds while visible
  useEffect(() => {
    if (!isVisible) return;

    const wanderInterval = setInterval(() => {
      // 30% chance to move on its own tick
      if (Math.random() > 0.7) {
        setPosition(getRandomPosition());
      }
    }, 2000);

    return () => clearInterval(wanderInterval);
  }, [isVisible]);

  const handleRunAway = () => {
    // It runs away 5 times before letting you close it
    if (teleportCount < 5) {
      setPosition(getRandomPosition());
      setTeleportCount((prev) => prev + 1);
    }
  };

  if (!isVisible || !content) return null;

  return (
    <Paper
      elevation={24}
      sx={{
        position: "fixed",
        top: position.top,
        left: position.left,
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
        width: 300,
        maxWidth: "90vw",
        border: "2px solid",
        borderColor: "primary.main",
        bgcolor: "background.paper",
        boxShadow: "0 0 20px rgba(211, 47, 47, 0.5)",
        transition: "top 0.2s ease-out, left 0.2s ease-out", // Smooth glide when moving
        animation: "shake 0.5s cubic-bezier(.36,.07,.19,.97) both",
        "@keyframes shake": {
          "10%, 90%": { transform: "translate(-51%, -50%)" },
          "20%, 80%": { transform: "translate(-49%, -50%)" },
          "30%, 50%, 70%": { transform: "translate(-54%, -50%)" },
          "40%, 60%": { transform: "translate(-46%, -50%)" },
        },
      }}
    >
      {/* Header / Close Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between", // Changed to space-between for fake label
          alignItems: "center",
          bgcolor: "primary.main",
          p: 0.5,
          cursor: "move", // Suggests draggable, but it isn't (extra annoying)
        }}
      >
        <Typography variant="caption" sx={{ color: "black", fontWeight: "bold", ml: 1 }}>
          IMPORTANT ALERT
        </Typography>

        <IconButton
          size="small"
          onClick={() => setIsVisible(false)}
          onMouseEnter={handleRunAway} // Triggers the evasion
          sx={{
            color: "white",
            bgcolor: "black",
            width: 24,
            height: 24,
            "&:hover": { bgcolor: "#333" },
            // Visual glitch effect on the button
            animation: teleportCount < 5 ? "pulse 0.5s infinite" : "none",
            "@keyframes pulse": {
              "0%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.1)" },
              "100%": { transform: "scale(1)" },
            }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2, textAlign: "center" }}>
        {content.type === "ad" ? (
          <Box
            component="img"
            src={new URL(`../assets/${content.data}`, import.meta.url).href}
            alt="Ad"
            sx={{ width: "100%", height: "auto", display: "block" }}
          />
        ) : (
          <Typography
            variant="h6"
            color="primary"
            sx={{
              fontFamily: "'Special Elite', cursive",
              textTransform: "uppercase",
              fontWeight: "bold",
              textShadow: "2px 2px 0px #000",
            }}
          >
            {content.data}
          </Typography>
        )}
      </Box>

      {/* Fake footer message */}
      <Typography
        variant="caption"
        display="block"
        align="center"
        sx={{ pb: 1, color: "text.secondary", fontSize: "0.6rem" }}
      >
        {teleportCount > 0 && teleportCount < 5
          ? `VERIFICATION REQUIRED... ${5 - teleportCount}`
          : "COMPLIANCE MANDATORY"}
      </Typography>
    </Paper>
  );
};

export default PopupManager;