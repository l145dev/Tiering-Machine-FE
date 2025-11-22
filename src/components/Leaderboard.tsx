import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useUser } from "../context/UserContext";
import { leaderboardData } from "../mock_data/leaderboardData";

const Leaderboard = () => {
  const { user } = useUser();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Scrollable List */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", position: "relative" }}>
        <List disablePadding>
          {leaderboardData.map((item) => (
            <ListItem
              key={item.id}
              sx={{
                "&:nth-of-type(odd)": {
                  bgcolor: "action.hover", // Light gray
                },
                "&:nth-of-type(even)": {
                  bgcolor: "background.default", // White/Lighter gray depending on theme
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
                <Avatar alt={item.name} src={item.avatar} />
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

        {/* Dreg Overlay - Blur top 10 */}
        {user?.tier === "dreg" && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "560px", // Approximate height of 10 items
              backdropFilter: "blur(8px)",
              bgcolor: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              borderBottom: "2px solid",
              borderColor: "primary.main",
            }}
          >
            <Typography
              variant="h5"
              color="primary"
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                textAlign: "center",
                textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                letterSpacing: "2px",
                px: 4,
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
