import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import Ads from "./Ads";

const Login = () => {
  const { login } = useUser();
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(identity, password);
      if (!success) {
        setError("Authentication failed");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        bgcolor: "background.default",
      }}
    >
      {/* Left Column - Ads */}
      <Box
        sx={{
          width: "20%",
          borderRight: "1px solid",
          borderColor: "divider",
          p: 2,
          overflow: "hidden",
        }}
      >
        <Ads />
      </Box>

      {/* Middle Column - Login Form */}
      <Box
        sx={{
          width: "60%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRight: "1px solid",
          borderColor: "divider",
          p: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            maxWidth: 500,
            width: "100%",
            p: 4,
            border: "2px solid",
            borderColor: "primary.main",
            bgcolor: "background.paper",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: "primary.main",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              mb: 4,
            }}
          >
            Access Terminal
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Identity"
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
              required
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
              InputLabelProps={{
                sx: { textTransform: "uppercase", letterSpacing: "1px" },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{
                mb: 4,
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
              InputLabelProps={{
                sx: { textTransform: "uppercase", letterSpacing: "1px" },
              }}
            />

            {error && (
              <Typography
                color="error"
                align="center"
                sx={{ mb: 2, textTransform: "uppercase" }}
              >
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              {loading ? "Authenticating..." : "Log In"}
            </Button>
          </form>

          <Typography
            variant="caption"
            align="center"
            display="block"
            sx={{
              mt: 4,
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            All access monitored • Compliance required
          </Typography>
        </Paper>
      </Box>

      {/* Right Column - Ads */}
      <Box
        sx={{
          width: "20%",
          p: 2,
          overflow: "hidden",
        }}
      >
        <Ads />
      </Box>
    </Box>
  );
};

export default Login;
