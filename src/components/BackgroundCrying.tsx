import { useEffect, useMemo } from "react";

// Path to the provided asset
const BABY_CRYING_PATH = new URL(
    "../assets/baby-crying-loud-100441.mp3",
    import.meta.url
).href;

const BackgroundCrying = () => {
    // Use useMemo to initialize the Audio object once
    const audio = useMemo(() => {
        const cry = new Audio(BABY_CRYING_PATH);
        cry.volume = 0.40;
        return cry;
    }, []);

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval> | null = null;

        const startPeriodicCrying = () => {
            if (intervalId) {
                clearInterval(intervalId);
            }

            // Choose a random interval between 30 and 60 seconds (30000ms and 60000ms)
            const randomInterval = Math.floor(Math.random() * 10000) + 30000;

            const playCry = () => {
                // Reset time to ensure instant playback from the beginning
                audio.currentTime = 0;
                audio.play().catch(e => console.warn("Could not play baby crying sound (check file path):", e));

                // Stop playback after a short period (e.g., 5 seconds)
                const stopTimeout = setTimeout(() => {
                    audio.pause();
                    audio.currentTime = 0;
                }, 5000);

                return () => clearTimeout(stopTimeout);
            };

            // Set the interval to start the crying periodically
            intervalId = setInterval(playCry, randomInterval);
        };

        // Start the periodic crying cycle
        startPeriodicCrying();

        // Cleanup function: pause audio and clear interval when the component unmounts
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
            audio.pause();
            audio.currentTime = 0;
        };
    }, [audio]);

    // This component is for background effects and renders nothing visually
    return null;
};

export default BackgroundCrying;