import { Box, Paper } from "@mui/material";
import datingAd from "../assets/dating_ad.png";
import ramAd from "../assets/ram_ad.png";
import voteAd from "../assets/vote_ad.png";

const Ads = () => {
  const ads = [
    {
      id: 1,
      link: "https://www.google.com",
      image: voteAd,
    },
    {
      id: 2,
      link: "https://www.google.com",
      image: datingAd,
    },
    {
      id: 3,
      link: "https://www.google.com",
      image: ramAd,
    },
  ];

  return (
    <Box
      sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 2 }}
    >
      {ads.map((ad) => (
        <Paper
          key={ad.id}
          elevation={1}
          component="a"
          href={ad.link}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            flex: 1,
            display: "flex",
            bgcolor: "background.paper",
            overflow: "hidden",
            textDecoration: "none",
            p: 0, // Remove padding
          }}
        >
          <Box
            component="img"
            src={ad.image}
            alt="Advertisement"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Paper>
      ))}
    </Box>
  );
};

export default Ads;
