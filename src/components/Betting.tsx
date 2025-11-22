import { Box, Paper, Typography } from "@mui/material";
import { bettingData } from "../mock_data/bettingData";

const Betting = () => {
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}
    >
      <Typography variant="h6">Betting</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflowY: "auto",
          flexGrow: 1,
          pr: 1, // Add padding for scrollbar space
        }}
      >
        {bettingData.map((bet) => (
          <Paper
            key={bet.id}
            variant="outlined"
            sx={{
              display: "flex",
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
              flexShrink: 0, // Prevent shrinking
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
              <Typography variant="body1" fontWeight="500" sx={{ mb: 2 }}>
                {bet.target} {bet.description}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Created by {bet.creator}
                </Typography>
                <Typography variant="caption" fontWeight="bold">
                  {bet.duration}
                </Typography>
              </Box>
            </Box>

            {/* Right Side - Options */}
            <Box
              sx={{
                width: "30%",
                display: "flex",
                flexDirection: "column",
                borderLeft: "1px solid",
                borderColor: "divider",
              }}
            >
              {/* Option A - Risky (Neon Green) */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  p: 1,
                  bgcolor: "rgba(27, 94, 32, 0.3)", // Dark Green background
                  color: "#69F0AE", // Neon Green Text
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    bgcolor: "rgba(27, 94, 32, 0.5)", // Darker Green Hover
                  },
                }}
              >
                <Typography variant="caption" align="center" lineHeight={1.2}>
                  <span style={{ color: "#ff8a80", fontSize: "0.9em" }}>
                    BET {bet.wager}
                  </span>
                  <br />
                  <strong style={{ fontSize: "1.1em" }}>
                    WIN {bet.optionA.payout}
                  </strong>
                  <br />
                  <span style={{ opacity: 0.8 }}>
                    ({bet.optionA.percentage}%)
                  </span>
                </Typography>
              </Box>

              {/* Option B - Safe (Sage Green) */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 1,
                  bgcolor: "rgba(46, 59, 50, 0.3)", // Dark Sage background
                  color: "#81C784", // Muted Green Text
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    bgcolor: "rgba(46, 59, 50, 0.5)", // Darker Sage Hover
                  },
                }}
              >
                <Typography variant="caption" align="center" lineHeight={1.2}>
                  <span style={{ color: "#ff8a80", fontSize: "0.9em" }}>
                    BET {bet.wager}
                  </span>
                  <br />
                  <strong style={{ fontSize: "1.1em" }}>
                    WIN {bet.optionB.payout}
                  </strong>
                  <br />
                  <span style={{ opacity: 0.8 }}>
                    ({bet.optionB.percentage}%)
                  </span>
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default Betting;
