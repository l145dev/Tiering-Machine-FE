import {
  AppBar,
  Avatar,
  Box,
  Button,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import ReportCitizenDialog from "./ReportCitizenDialog";

const Navbar = () => {
  const { user, logout } = useUser();
  const [reportOpen, setReportOpen] = useState(false);

  if (!user) return null;

  const handleReportOpen = () => {
    setReportOpen(true);
  };

  const handleReportClose = () => {
    setReportOpen(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Typography variant="h5" component="div" fontWeight={600}>
              Tiering Machine
            </Typography>

            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={handleReportOpen}
              sx={{
                fontWeight: "bold",
                letterSpacing: 1,
                "&:hover": {
                  color: user?.tier === "elite" ? "#D4AF37" : "inherit",
                },
              }}
            >
              Report Citizen
            </Button>
            <Button
              variant="outlined"
              color="warning"
              size="small"
              onClick={() => window.dispatchEvent(new CustomEvent("http-403"))}
              sx={{ ml: 2 }}
            >
              Test 403
            </Button>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* User Profile Section */}
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

            {/* Logout Button */}
            <Button
              onClick={logout}
              variant="outlined"
              size="small"
              sx={{
                borderColor: "primary.main",
                color: "primary.main",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontSize: "0.75rem",
                fontWeight: 700,
                "&:hover": {
                  borderColor: "primary.light",
                  bgcolor: "rgba(211, 47, 47, 0.1)",
                },
              }}
            >
              Log Out
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Report Dialog */}
      <ReportCitizenDialog
        open={reportOpen}
        onClose={handleReportClose}
        reporterId={user.id}
      />
    </>
  );
};

export default Navbar;
