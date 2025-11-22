import { Box, Typography } from "@mui/material";
import { useUser } from "../context/UserContext";
import Beams from "./ui/Beams";

const Greeting = () => {
  const { user } = useUser();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Beams */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <Beams
          beamWidth={2}
          beamHeight={25}
          beamNumber={14}
          lightColor="#D4AF37"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={30}
        />
      </Box>

      {/* Welcome Message Overlay */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          px: 4,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: "#fff",
            mb: 2,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Welcome, {user?.username}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 500,
            color: "#fff",
            opacity: 0.8,
            fontStyle: "italic",
            letterSpacing: "0.05em",
          }}
        >
          Smile for the camera. Do not resist.
        </Typography>
      </Box>
    </Box>
  );
};

export default Greeting;
