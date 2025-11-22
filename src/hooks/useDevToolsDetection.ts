import { useEffect, useRef, useState } from "react";
import { useToast } from "../context/ToastContext";
import { useUser } from "../context/UserContext";
import { setDebugScore } from "../services/api";

const useDevToolsDetection = () => {
  const { user } = useUser();
  const { showToast } = useToast();
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasPenalizedRef = useRef(false);

  useEffect(() => {
    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;

      if (widthThreshold || heightThreshold) {
        if (!isDevToolsOpen) {
          setIsDevToolsOpen(true);
        }
      } else {
        if (isDevToolsOpen) {
          setIsDevToolsOpen(false);
        }
      }
    };

    window.addEventListener("resize", checkDevTools);
    // Initial check
    checkDevTools();

    // Also check periodically in case of undocked devtools or other changes
    // Note: Undocked detection is harder and usually requires console tricks which we are avoiding for now
    // based on the "window size difference" plan approval.
    const interval = setInterval(checkDevTools, 1000);

    return () => {
      window.removeEventListener("resize", checkDevTools);
      clearInterval(interval);
    };
  }, [isDevToolsOpen]);

  useEffect(() => {
    if (isDevToolsOpen && user && !hasPenalizedRef.current) {
      // Debounce the penalty
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        try {
          console.log("DevTools detected. Penalizing user...");
          await setDebugScore(user.id, -100);
          showToast("You lost 100 points smh", "error");
          hasPenalizedRef.current = true; // Ensure we only penalize once per session/load
        } catch (error) {
          console.error("Failed to penalize for DevTools:", error);
        }
      }, 1000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isDevToolsOpen, user, showToast]);

  return isDevToolsOpen;
};

export default useDevToolsDetection;
