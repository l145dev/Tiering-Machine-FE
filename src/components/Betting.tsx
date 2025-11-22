import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { type ApiBet, fetchBets } from "../services/api";

const Betting = () => {
  const { user } = useUser();
  const [bets, setBets] = useState<ApiBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBets = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const data = await fetchBets();
        setBets(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load bets:", err);
        setError("Failed to load bets. The odds are not in your favor.");
      } finally {
        setLoading(false);
      }
    };

    loadBets();
  }, []);

  const getCreatorName = (creator: any) => {
    if (typeof creator === "string") return creator;
    return creator?.username || "Unknown";
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, color: "error.main", textAlign: "center" }}>
        <Typography variant="body2">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}
    >
      <Typography variant="h6">Betting</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflowY: "auto",
          flexGrow: 1,
          pr: 1, // Add padding for scrollbar space
        }}
      >
        {bets.map((bet) => (
          <Paper
            key={bet.id}
            variant="outlined"
            sx={{
              display: "flex",
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
              flexShrink: 0, // Prevent shrinking
            }}
          >
            {/* Left Side - Info */}
            <Box
              sx={{
                width: "65%",
                p: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <Typography
                variant="body2"
                fontWeight="500"
                sx={{
                  mb: 2,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {bet.description}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Created by {getCreatorName(bet.creator)}
                </Typography>
                <Typography variant="caption" fontWeight="bold">
                  {bet.time}
                </Typography>
              </Box>
            </Box>

            {/* Right Side - Options */}
            <Box
              sx={{
                width: "35%",
                display: "flex",
                flexDirection: "column",
                borderLeft: "1px solid",
                borderColor: "divider",
                bgcolor: "rgba(0, 0, 0, 0.05)",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.05)",
                },
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 1,
                }}
              >
                <Box sx={{ textAlign: "center", mb: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "error.main",
                      fontWeight: "bold",
                      letterSpacing: "1px",
                      fontSize: "0.7rem",
                    }}
                  >
                    WAGER
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "error.light",
                      fontWeight: "bold",
                      lineHeight: 1,
                    }}
                  >
                    {bet.wagerPoints}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "40%",
                    height: "1px",
                    bgcolor: "divider",
                    my: 0.5,
                  }}
                />

                <Box sx={{ textAlign: "center", mt: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "success.main",
                      fontWeight: "bold",
                      letterSpacing: "1px",
                      fontSize: "0.7rem",
                    }}
                  >
                    PAYOUT
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "success.light",
                      fontWeight: "bold",
                      lineHeight: 1,
                      textShadow: "0 0 10px rgba(105, 240, 174, 0.3)",
                    }}
                  >
                    {bet.payoutPoints}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default Betting;
