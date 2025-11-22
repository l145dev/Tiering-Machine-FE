import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { type ApiEvent, fetchEvents } from "../services/api";

const Events = () => {
  const { user } = useUser();
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const data = await fetchEvents();
        setEvents(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load events:", err);
        setError("Failed to load events. The Ministry of Truth is experiencing technical difficulties.");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

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
      <Typography variant="h6">Events</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflowY: "auto",
          flexGrow: 1,
          pr: 1,
        }}
      >
        {events.map((event) => (
          <Paper
            key={event.id}
            variant="outlined"
            sx={{
              display: "flex",
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
              flexShrink: 0,
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
              <Typography variant="body1" fontWeight="500" sx={{ mb: 1 }}>
                {event.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {event.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Hosted by {event.creator.username}
              </Typography>
            </Box>

            {/* Right Side - Details */}
            <Box
              sx={{
                width: "30%",
                display: "flex",
                flexDirection: "column",
                borderLeft: "1px solid",
                borderColor: "divider",
              }}
            >
              {/* Date */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  p: 1,
                  bgcolor: "background.default",
                }}
              >
                <Typography
                  variant="caption"
                  align="center"
                  fontWeight="bold"
                  lineHeight={1.2}
                >
                  {new Date(event.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </Typography>
              </Box>

              {/* Reward/Cost */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 1,
                  bgcolor: event.reward >= 0 ? "#E8F5E9" : "#FFEBEE", // Green for positive, Red for negative
                  color: event.reward >= 0 ? "#2E7D32" : "#C62828",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    bgcolor: event.reward >= 0 ? "#C8E6C9" : "#FFCDD2",
                  },
                }}
              >
                <Typography variant="caption" align="center" fontWeight="bold">
                  {event.reward > 0 ? "+" : ""}{event.reward} pts
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default Events;
