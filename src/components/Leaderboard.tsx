import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { type ApiLeaderboardEntry, fetchLeaderboard } from "../services/api";

const Leaderboard = () => {
  const { user } = useUser();
  const [leaderboardData, setLeaderboardData] = useState<ApiLeaderboardEntry[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchLeaderboard();
      setLeaderboardData(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
      setError("Failed to load leaderboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  if (loading && leaderboardData.length === 0) {
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

  if (error && leaderboardData.length === 0) {
    return (
      <Box sx={{ p: 2, color: "error.main", textAlign: "center" }}>
        <Typography variant="body2">{error}</Typography>
        <IconButton onClick={loadLeaderboard} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          p: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
          flexShrink: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle2">Leaderboard</Typography>
        <IconButton onClick={loadLeaderboard} size="small">
          <RefreshIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Scrollable List */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", position: "relative" }}>
        <List disablePadding>
          {leaderboardData.map((item) => (
            <ListItem
              key={item.id}
              sx={{
                "&:nth-of-type(odd)": {
                  bgcolor: "action.hover",
                },
                "&:nth-of-type(even)": {
                  bgcolor: "background.paper",
                },
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  width: 40,
                  textAlign: "center",
                  fontWeight: "bold",
                  mr: 2,
                }}
              >
                {item.rank}
              </Typography>
              <ListItemAvatar>
                <Avatar
                  alt={item.name}
                  src={`https://i.pravatar.cc/150?u=${item.id}`}
                />
              </ListItemAvatar>
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
              <Typography variant="body1" fontWeight="bold">
                {item.points.toLocaleString()} pts
              </Typography>
            </ListItem>
          ))}
        </List>

        {/* Dreg Overlay - Blur top 3 */}
        {user?.tier === "dreg" && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "168px", // This height acts as the "track" for the sticky element
              backdropFilter: "blur(8px)",
              bgcolor: "rgba(0, 0, 0, 0.7)",
              zIndex: 10,
              borderBottom: "2px solid",
              borderColor: "primary.main",
              // We need block or flex-col for sticky to work well, avoid 'center' align here
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h5"
              color="primary"
              sx={{
                position: "sticky",
                top: "50%", // Sticks to the middle of the viewport
                transform: "translateY(-50%)", // Perfect vertical centering
                fontWeight: "bold",
                textTransform: "uppercase",
                textAlign: "center",
                textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                letterSpacing: "2px",
                px: 4,
                width: "100%",
                margin: 0,
                zIndex: 11,
              }}
            >
              Keep your eyes off of the elite, low life
            </Typography>
          </Box>
        )}
      </Box>

      {/* Fixed User Row */}
      <Paper
        elevation={0}
        sx={{
          position: "sticky",
          bottom: 0,
          border: "none", // Reset default border
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          zIndex: 20, // Above dreg overlay (z-index 10)
          borderRadius: 0, // Override theme border radius
        }}
      >
        <List disablePadding>
          <ListItem>
            {" "}
            {/* Light blue highlight for user */}
            <Typography
              variant="body1"
              sx={{ width: 40, textAlign: "center", fontWeight: "bold", mr: 2 }}
            >
              {user?.rank}
            </Typography>
            <ListItemAvatar>
              <Avatar
                alt={user?.username}
                src={`https://i.pravatar.cc/150?u=${user?.id}`}
              />
            </ListItemAvatar>
            <ListItemText
              primary={"You"}
              slotProps={{ primary: { fontWeight: 900 } }}
            />
            <Typography variant="body1" fontWeight="bold">
              {user?.total_points.toLocaleString()} pts
            </Typography>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default Leaderboard;
