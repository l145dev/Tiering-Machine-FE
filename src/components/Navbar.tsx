import { AppBar, Avatar, Box, Toolbar, Typography } from "@mui/material";

const Navbar = () => {
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
          <Typography variant="body1" fontWeight={500}>
            User 42
          </Typography>

          <Avatar
            alt="User 42"
            src="https://i.pravatar.cc/150?img=42"
            sx={{ width: 36, height: 36 }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
