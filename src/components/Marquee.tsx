import { Box, Typography, keyframes } from "@mui/material";
import { useUser } from "../context/UserContext";
import insults from "../data/insults";
import praises from "../data/praise";

// Keyframes for scrolling
const scrollLeft = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const scrollRight = keyframes`
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
`;

const MarqueeRow = ({
  items,
  direction = "left",
}: {
  items: string[];
  direction?: "left" | "right";
}) => {
  // Duplicate items to ensure seamless loop
  const content = [...items, ...items];

  return (
    <Box
      sx={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        display: "flex",
        py: 1,
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        position: "relative",
        "&::before, &::after": {
          content: '""',
          position: "absolute",
          top: 0,
          width: "50px",
          height: "100%",
          zIndex: 2,
        },
        "&::before": {
          left: 0,
          background:
            "linear-gradient(to right, rgba(26,26,26,1), transparent)",
        },
        "&::after": {
          right: 0,
          background: "linear-gradient(to left, rgba(26,26,26,1), transparent)",
        },
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          animation: `${
            direction === "left" ? scrollLeft : scrollRight
          } 200s linear infinite`,
          // Pause on hover for readability
          "&:hover": {
            animationPlayState: "paused",
          },
        }}
      >
        {content.map((text, index) => (
          <Typography
            key={index}
            variant="body2"
            component="span"
            sx={{
              mx: 4,
              color: "text.secondary", // Neutral gray/white as requested
              textTransform: "uppercase",
              letterSpacing: "1px",
              opacity: 0.8,
            }}
          >
            {text}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

const Marquee = () => {
  const { user } = useUser();

  // Determine content based on user tier
  let topItems: string[];
  let bottomItems: string[];

  switch (user?.tier) {
    case "dreg":
      topItems = insults;
      bottomItems = insults;
      break;
    case "citizen":
      topItems = insults;
      bottomItems = praises;
      break;
    case "elite":
      topItems = praises;
      bottomItems = praises;
      break;
    default:
      topItems = insults;
      bottomItems = praises;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <MarqueeRow items={topItems} direction="left" />
      <MarqueeRow items={bottomItems} direction="right" />
    </Box>
  );
};

export default Marquee;
