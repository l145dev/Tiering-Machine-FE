import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { type ApiEvent, fetchEvents } from "../services/api";

const Events = () => {
  const { user } = useUser();
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ApiEvent | null>(null);
  const [open, setOpen] = useState(false);

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
        setError(
          "Failed to load events. The Ministry of Truth is experiencing technical difficulties."
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleEventClick = (event: ApiEvent) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSelectedEvent(null), 200); // Clear after animation
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
            onClick={() => handleEventClick(event)}
            sx={{
              display: "flex",
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
              flexShrink: 0,
              cursor: "pointer",
              "&:hover": {
                borderColor: "primary.main",
              },
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
                variant="body1"
                fontWeight="bold"
                sx={{
                  mb: 1,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
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
                  fontSize: "0.85rem",
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
                width: "35%",
                display: "flex",
                flexDirection: "column",
                borderLeft: "1px solid",
                borderColor: "divider",
                bgcolor: "rgba(0, 0, 0, 0.05)",
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
                }}
              >
                <Typography
                  variant="caption"
                  align="center"
                  fontWeight="bold"
                  sx={{
                    color: "text.primary",
                    letterSpacing: "1px",
                  }}
                >
                  {new Date(event.eventDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
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
                }}
              >
                <Typography
                  variant="body2"
                  align="center"
                  fontWeight="bold"
                  sx={{
                    color: event.reward >= 0 ? "success.light" : "error.light",
                    textShadow:
                      event.reward >= 0
                        ? "0 0 10px rgba(105, 240, 174, 0.3)"
                        : "0 0 10px rgba(255, 82, 82, 0.3)",
                  }}
                >
                  {event.reward > 0 ? "+" : ""}
                  {event.reward} pts
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Event Details Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "background.paper",
            backgroundImage: "none",
            border: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        {selectedEvent && (
          <>
            <DialogTitle
              sx={{ borderBottom: "1px solid", borderColor: "divider" }}
            >
              {selectedEvent.title}
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    {new Date(selectedEvent.eventDate).toLocaleDateString(
                      undefined,
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                  {selectedEvent.description}
                </Typography>

                <Box
                  sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Hosted by: {selectedEvent.creator.username}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions
              sx={{
                p: 2,
                borderTop: "1px solid",
                borderColor: "divider",
                justifyContent: "space-between",
              }}
            >
              <Button onClick={handleClose} color="primary">
                Close
              </Button>
              <Button
                variant="contained"
                color={selectedEvent.reward >= 0 ? "success" : "error"}
                disableElevation
                sx={{
                  fontWeight: "bold",
                  "&:hover": {
                    color: user?.tier === "elite" ? "#D4AF37" : "inherit",
                  },
                }}
              >
                {selectedEvent.reward > 0 ? "+" : ""}
                {selectedEvent.reward} pts
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Events;
