import RefreshIcon from "@mui/icons-material/Refresh";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

interface CaptchaDialogProps {
    open: boolean;
    requiredCount: number;
    onComplete: () => void;
    onCancel: () => void;
}

const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const CaptchaDialog = ({
    open,
    requiredCount,
    onComplete,
    onCancel,
}: CaptchaDialogProps) => {
    const [captchaString, setCaptchaString] = useState("");
    const [input, setInput] = useState("");
    const [solvedCount, setSolvedCount] = useState(0);
    const [error, setError] = useState(false);

    // Initialize first captcha when dialog opens
    useEffect(() => {
        if (open) {
            setCaptchaString(generateCaptcha());
            setSolvedCount(0);
            setInput("");
            setError(false);
        }
    }, [open]);

    const handleRefresh = () => {
        setCaptchaString(generateCaptcha());
        setInput("");
        setError(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.toUpperCase() === captchaString) {
            // Correct
            const newSolved = solvedCount + 1;
            if (newSolved >= requiredCount) {
                onComplete();
            } else {
                setSolvedCount(newSolved);
                setCaptchaString(generateCaptcha());
                setInput("");
                setError(false);
            }
        } else {
            // Incorrect
            setError(true);
            setCaptchaString(generateCaptcha());
            setInput("");
        }
    };

    return (
        <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
            <DialogTitle
                sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "error.main",
                    textTransform: "uppercase",
                    letterSpacing: 2,
                }}
            >
                Compliance Verification
            </DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: "flex", flexDirection: "column", gap: 3, py: 2 }}
                >
                    <Typography variant="body2" align="center">
                        Verify humanity. {requiredCount - solvedCount} remaining.
                    </Typography>

                    {/* Captcha Display Area */}
                    <Box
                        sx={{
                            bgcolor: "#000",
                            p: 3,
                            position: "relative",
                            overflow: "hidden",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "1px solid #333",
                        }}
                    >
                        {/* Noise lines */}
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundImage:
                                    "linear-gradient(45deg, transparent 45%, #333 50%, transparent 55%)",
                                backgroundSize: "10px 10px",
                                opacity: 0.3,
                                zIndex: 1,
                            }}
                        />

                        <Typography
                            variant="h4"
                            sx={{
                                color: "#fff",
                                fontFamily: "'Courier New', monospace",
                                fontWeight: "bold",
                                letterSpacing: 8,
                                position: "relative",
                                zIndex: 2,
                                filter: "blur(0.5px)",
                                userSelect: "none",
                                textDecoration: "line-through", // Strikethrough for difficulty
                            }}
                        >
                            {captchaString.split("").map((char, i) => (
                                <span
                                    key={i}
                                    style={{
                                        display: "inline-block",
                                        transform: `rotate(${Math.random() * 20 - 10}deg) translateY(${Math.random() * 10 - 5}px)`,
                                    }}
                                >
                                    {char}
                                </span>
                            ))}
                        </Typography>

                        <IconButton
                            onClick={handleRefresh}
                            size="small"
                            sx={{
                                position: "absolute",
                                right: 5,
                                bottom: 5,
                                color: "rgba(255,255,255,0.5)",
                                zIndex: 3,
                            }}
                        >
                            <RefreshIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    <TextField
                        autoFocus
                        fullWidth
                        label="Enter Characters"
                        variant="outlined"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        error={error}
                        helperText={error ? "Verification failed. Try again." : ""}
                        inputProps={{
                            style: { textTransform: "uppercase", letterSpacing: 2 },
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        sx={{ borderRadius: 0 }}
                    >
                        Verify
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default CaptchaDialog;