import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { reportCitizen } from "../services/api";

interface ReportCitizenDialogProps {
  open: boolean;
  onClose: () => void;
  reporterId: number;
  prefilledTargetId?: number;
  prefilledTargetName?: string;
}

const ReportCitizenDialog = ({
  open,
  onClose,
  reporterId,
  prefilledTargetId,
  prefilledTargetName,
}: ReportCitizenDialogProps) => {
  const [targetId, setTargetId] = useState(prefilledTargetId?.toString() || "");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Update targetId when prefilledTargetId changes
  useState(() => {
    if (prefilledTargetId) {
      setTargetId(prefilledTargetId.toString());
    }
  });

  const handleClose = () => {
    onClose();
    // Reset state after closing animation
    setTimeout(() => {
      setTargetId(prefilledTargetId?.toString() || "");
      setReason("");
      setError(null);
      setSuccess(false);
    }, 200);
  };

  const handleSubmitReport = async () => {
    if (!targetId || !reason) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await reportCitizen(reporterId, {
        targetId: parseInt(targetId),
        reason: reason,
      });
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err) {
      console.error("Report failed:", err);
      setError("Failed to submit report. The system may be down.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ color: "error.main", fontWeight: "bold" }}>
        REPORT SUSPICIOUS ACTIVITY
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Identify the citizen and describe their infraction. False reports will
          be punished.
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
            <Typography variant="caption">Your vigilance is noted.</Typography>
          </Box>
        ) : (
          <>
            <TextField
              autoFocus={!prefilledTargetId}
              margin="dense"
              label={
                prefilledTargetName
                  ? `Target Citizen: ${prefilledTargetName}`
                  : "Target Citizen ID"
              }
              type="number"
              fullWidth
              variant="outlined"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              disabled={!!prefilledTargetId}
              sx={{ mb: 2 }}
            />
            <TextField
              autoFocus={!!prefilledTargetId}
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
            <Button onClick={handleClose}>Cancel</Button>
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
  );
};

export default ReportCitizenDialog;
