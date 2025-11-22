import {
  AppBar,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import { reportCitizen } from "../services/api";

const Navbar = () => {
  const { user, logout } = useUser();
  const [reportOpen, setReportOpen] = useState(false);
  const [targetId, setTargetId] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!user) return null;

  const handleReportOpen = () => {
    setReportOpen(true);
    setTargetId("");
    setReason("");
    setError(null);
    setSuccess(false);
  };

  const handleReportClose = () => {
    setReportOpen(false);
  };

  const handleSubmitReport = async () => {
    if (!targetId || !reason) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await reportCitizen(user.id, {
        targetId: parseInt(targetId),
        reason: reason,
      });
      setSuccess(true);
      setTimeout(() => {
        handleReportClose();
      }, 3000);
    } catch (err) {
      console.error("Report failed:", err);
      setError("Failed to submit report. The system may be down.");
    } finally {
      setLoading(false);
    }
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
              sx={{ fontWeight: "bold", letterSpacing: 1 }}
            >
              Report Citizen
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
      <Dialog open={reportOpen} onClose={handleReportClose}>
        <DialogTitle sx={{ color: "error.main", fontWeight: "bold" }}>
          REPORT SUSPICIOUS ACTIVITY
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Identify the citizen and describe their infraction. False reports
            will be punished.
          </DialogContentText>

          {success ? (
            <Box
              sx={{
                p: 2,
                bgcolor: "success.light",
                color: "success.contrastText",
                borderRadius: 1,
                textAlign: "center",
              }}
            >
              <Typography fontWeight="bold">
                Report Submitted Successfully.
              </Typography>
              <Typography variant="caption">
                Your vigilance is noted.
              </Typography>
            </Box>
          ) : (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Target Citizen ID"
                type="number"
                fullWidth
                variant="outlined"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Reason for Report"
                type="text"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              {error && (
                <Typography
                  color="error"
                  variant="caption"
                  sx={{ mt: 1, display: "block" }}
                >
                  {error}
                </Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          {!success && (
            <>
              <Button onClick={handleReportClose}>Cancel</Button>
              <Button
                onClick={handleSubmitReport}
                color="error"
                variant="contained"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Report"}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
