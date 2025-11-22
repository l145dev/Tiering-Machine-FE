import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import ads from "../data/ads";
import insults from "../data/insults";

// Helper to get random item from array
const getRandomItem = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

// Helper to get random position
const getRandomPosition = () => ({
  top: `${Math.floor(Math.random() * 60) + 20}%`, // 20-80%
  left: `${Math.floor(Math.random() * 60) + 20}%`, // 20-80%
});

const PopupManager = () => {
  const { user } = useUser();
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState<{
    type: "ad" | "insult";
    data: string;
  } | null>(null);
  const [position, setPosition] = useState({ top: "50%", left: "50%" });

  useEffect(() => {
    if (user.tier !== "dreg") {
      setIsVisible(false);
      return;
    }

    const interval = setInterval(() => {
      // 50/50 chance for Ad or Insult
      const isAd = Math.random() > 0.5;
      const type = isAd ? "ad" : "insult";
      const data = isAd ? getRandomItem(ads) : getRandomItem(insults);

      setContent({ type, data });
      setPosition(getRandomPosition());
      setIsVisible(true);
    }, 5000); // 30 seconds

    return () => clearInterval(interval);
  }, [user.tier]);

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
        boxShadow: "0 0 20px rgba(211, 47, 47, 0.5)", // Red glow
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
          justifyContent: "flex-end",
          bgcolor: "primary.main",
          p: 0.5,
        }}
      >
        <IconButton
          size="small"
          onClick={() => setIsVisible(false)}
          sx={{
            color: "white",
            bgcolor: "black",
            width: 24,
            height: 24,
            "&:hover": { bgcolor: "#333" },
          }}
        >
          <CloseIcon />
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
              fontFamily: "'Special Elite', cursive", // Or another chaotic font if available
              textTransform: "uppercase",
              fontWeight: "bold",
              textShadow: "2px 2px 0px #000",
            }}
          >
            {content.data}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default PopupManager;
