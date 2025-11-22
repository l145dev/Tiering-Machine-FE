import { Box, Paper, Typography } from "@mui/material";
import { eventsData } from "../mock_data/eventsData";

const Events = () => {
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
        {eventsData.map((event) => (
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
                Hosted by {event.creator}
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
                  {event.date}
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
                  bgcolor: "#E3F2FD", // Light Blue for cost
                  color: "#1565C0", // Dark Blue Text
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    bgcolor: "#BBDEFB", // Darker Blue Hover
                  },
                }}
              >
                <Typography variant="caption" align="center" fontWeight="bold">
                  {event.reward} pts
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
