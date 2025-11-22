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
    if (typeof creator === 'string') return creator;
    return creator?.username || 'Unknown';
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
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
                width: "70%",
                p: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <Typography variant="body2" fontWeight="500" sx={{ mb: 2 }}>
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
                  {new Date(bet.resolutionDate).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>

            {/* Right Side - Options */}
            <Box
              sx={{
                width: "30%",
                display: "flex",
                flexDirection: "column",
                borderLeft: "1px solid",
                borderColor: "divider",
              }}
            >
              {/* Bet Action */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 1,
                  bgcolor: "rgba(27, 94, 32, 0.3)", // Dark Green background
                  color: "#69F0AE", // Neon Green Text
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    bgcolor: "rgba(27, 94, 32, 0.5)", // Darker Green Hover
                  },
                }}
              >
                <Typography variant="caption" align="center" lineHeight={1.2}>
                  <span style={{ color: "#ff8a80", fontSize: "0.9em" }}>
                    WAGER {bet.wagerPoints}
                  </span>
                  <br />
                  <strong style={{ fontSize: "1.1em" }}>
                    WIN {bet.payoutPoints}
                  </strong>
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default Betting;
