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
import { currentUser, leaderboardData } from "../mock_data/leaderboardData";

const Leaderboard = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Scrollable List */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <List disablePadding>
          {leaderboardData.map((user) => (
            <ListItem
              key={user.id}
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
                {user.rank}
              </Typography>
              <ListItemAvatar>
                <Avatar alt={user.name} src={user.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={user.name}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
              <Typography variant="body1" fontWeight="bold">
                {user.points.toLocaleString()} pts
              </Typography>
            </ListItem>
          ))}
        </List>
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
          zIndex: 1,
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
              {currentUser.rank}
            </Typography>
            <ListItemAvatar>
              <Avatar alt={currentUser.name} src={currentUser.avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={currentUser.name}
              slotProps={{ primary: { fontWeight: 900 } }}
            />
            <Typography variant="body1" fontWeight="bold">
              {currentUser.points.toLocaleString()} pts
            </Typography>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default Leaderboard;
