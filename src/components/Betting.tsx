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
              {/* Option A - Positive (Green) */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  p: 1,
                  bgcolor: "#E8F5E9", // Light Green
                  color: "#1B5E20", // Dark Green Text
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    bgcolor: "#C8E6C9", // Darker Green Hover
                  },
                }}
              >
                <Typography variant="caption" align="center" lineHeight={1.2}>
                  <strong>+{bet.optionA.points} pts</strong>
                  <br />({bet.optionA.percentage}%)
                </Typography>
              </Box>

              {/* Option B - Negative (Red) */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 1,
                  bgcolor: "#FFEBEE", // Light Red
                  color: "#B71C1C", // Dark Red Text
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    bgcolor: "#FFCDD2", // Darker Red Hover
                  },
                }}
              >
                <Typography variant="caption" align="center" lineHeight={1.2}>
                  <strong>{bet.optionB.points} pts</strong>
                  <br />({bet.optionB.percentage}%)
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
