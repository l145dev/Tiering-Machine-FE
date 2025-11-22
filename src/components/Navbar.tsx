import { AppBar, Avatar, Box, Toolbar, Typography } from "@mui/material";
import { useUser } from "../context/UserContext";

const Navbar = () => {
  const { user } = useUser();

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
        <Typography variant="h5" component="div" fontWeight={600}>
          Tiering Machine
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 1.5,
            py: 0.5,
            borderRadius: 0.7,
            cursor: "pointer",
            transition: "background-color 0.2s",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <Box sx={{ textAlign: "right", mr: 1 }}>
            <Typography variant="body1" fontWeight={500} lineHeight={1.2}>
              {user.username}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textTransform: "uppercase" }}
            >
              {user.tier}
            </Typography>
          </Box>

          <Avatar
            alt={user.username}
            src={`https://i.pravatar.cc/150?u=${user.id}`}
            sx={{ width: 36, height: 36 }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
