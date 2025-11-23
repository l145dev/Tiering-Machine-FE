import { Box, Button, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

const MandatoryEntertainment = () => {
    const { user } = useUser();
    const [isVisible, setIsVisible] = useState(false);
    const [timeLeft, setTimeLeft] = useState(5);
    const [canClose, setCanClose] = useState(false);

    useEffect(() => {
        // Only run for non-elite users
        if (!user || user.tier === "elite") return;

        // 10% chance to spawn
        const roll = Math.random();
        if (roll < 0.7) {
            setIsVisible(true);
        }
    }, [user]);

    useEffect(() => {
        if (!isVisible) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setCanClose(true);
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isVisible]);

    if (!isVisible) return null;

    // The 'autoplay=1' parameter ensures the video starts playing immediately.
    const videoSrc = `https://www.youtube.com/embed/9sJUDx7iEJw?autoplay=1&controls=0&disablekb=1&modestbranding=1&rel=0&start=57&origin=${window.location.origin}`;

    return (
        <Box
            sx={{
                position: "fixed",
                inset: 0,
                zIndex: 99999, // Higher than everything
                bgcolor: "rgba(0, 0, 0, 0.95)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 4,
            }}
        >
            <Paper
                elevation={24}
                sx={{
                    width: "100%",
                    maxWidth: "800px",
                    bgcolor: "background.paper",
                    border: "2px solid",
                    borderColor: "primary.main",
                    p: 0,
                    overflow: "hidden",
                    animation: "dropIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    "@keyframes dropIn": {
                        "0%": { transform: "scale(0) rotate(-10deg)" },
                        "100%": { transform: "scale(1) rotate(0deg)" },
                    },
                }}
            >
                {/* Header */}
                <Box sx={{ bgcolor: "primary.main", p: 2, textAlign: "center" }}>
                    <Typography
                        variant="h4"
                        sx={{
                            color: "black",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            fontFamily: "'Courier New', monospace",
                        }}
                    >
                        mandatory entertainment moment
                    </Typography>
                </Box>

                {/* Video Content */}
                <Box sx={{ position: "relative", paddingTop: "56.25%" /* 16:9 Aspect Ratio */ }}>
                    <iframe
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            border: 0,
                        }}
                        src={videoSrc}
                        title="Mandatory Entertainment"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen={false}
                    />
                </Box>

                {/* Footer / Controls */}
                <Box sx={{ p: 3, display: "flex", justifyContent: "center", bgcolor: "#000" }}>
                    <Button
                        variant="contained"
                        color={canClose ? "success" : "secondary"}
                        disabled={!canClose}
                        onClick={() => setIsVisible(false)}
                        size="large"
                        sx={{
                            minWidth: 200,
                            py: 2,
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            borderRadius: 0,
                            "&.Mui-disabled": {
                                bgcolor: "rgba(255,255,255,0.1)",
                                color: "rgba(255,255,255,0.3)",
                            },
                        }}
                    >
                        {canClose ? "RESUME COMPLIANCE" : `PLEASE ENJOY (${timeLeft}s)`}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default MandatoryEntertainment;