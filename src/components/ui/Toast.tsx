import { Alert, Snackbar, useTheme } from "@mui/material";

interface ToastProps {
  open: boolean;
  message: string;
  severity?: "success" | "error" | "info" | "warning";
  onClose: () => void;
}

const Toast = ({ open, message, severity = "error", onClose }: ToastProps) => {
  const theme = useTheme();
  const isElite = theme.palette.mode === "light";

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: "100%",
          borderRadius: 0,
          ...(isElite
            ? {
                bgcolor: "background.paper",
                color: "primary.main",
                border: "1px solid",
                borderColor: "primary.main",
                "& .MuiAlert-icon": {
                  color: "primary.main",
                },
              }
            : {
                bgcolor: "background.paper",
                color: "text.primary",
                border: "1px solid",
                borderColor: "divider",
              }),
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
