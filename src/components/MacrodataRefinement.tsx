import { Box, Typography } from "@mui/material";
import { useState, useMemo } from "react";
import { useUser } from "../context/UserContext";

const GRID_ROWS = 10;
const GRID_COLS = 15;

// Helper to get coordinates from a single index
const getCoords = (index: number) => ({
  x: index % GRID_COLS,
  y: Math.floor(index / GRID_COLS),
});

// Sound file paths (User must place these files in the correct location, e.g., src/assets/)
// NOTE: You need to place your actual sound files in the src/assets/ folder.
const SUCCESS_SOUND_PATH = new URL("../assets/sound_success.mp3", import.meta.url).href;
const NOPE_SOUND_PATH = new URL("../assets/sound_nope.mp3", import.meta.url).href;

const MacrodataRefinement = () => {
  const { user, updateUser } = useUser();

  // --- Sound Initialization ---
  const playSuccessSound = useMemo(() => {
    const audio = new Audio(SUCCESS_SOUND_PATH);
    return () => {
      audio.currentTime = 0;
      audio.play().catch(e => console.warn("Could not play success sound (user needs to provide file):", e));
    };
  }, []);

  const playNopeSound = useMemo(() => {
    const audio = new Audio(NOPE_SOUND_PATH);
    return () => {
      audio.currentTime = 0;
      audio.play().catch(e => console.warn("Could not play nope sound (user needs to provide file):", e));
    };
  }, []);
  // ----------------------------

  // State: Grid Data
  const [cells, setCells] = useState(() =>
    Array.from({ length: GRID_ROWS * GRID_COLS }, (_, id) => ({
      id,
      value: Math.floor(Math.random() * 10),
      isTarget: Math.random() > 0.8,
    }))
  );

  // State: Game Progress
  const [bins, setBins] = useState([
    { id: 0, name: "WO", count: 0, goal: 100, color: "#9f1313ff" },
    { id: 1, name: "FC", count: 0, goal: 100, color: "#5b8d10ff" },
    { id: 2, name: "DR", count: 0, goal: 100, color: "#113a79ff" },
    { id: 3, name: "MA", count: 0, goal: 100, color: "#262521ff" },
  ]);

  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"success" | "nope" | null>(null);

  const selectionBox = useMemo(() => {
    if (dragStart === null || dragEnd === null) return null;
    const start = getCoords(dragStart);
    const end = getCoords(dragEnd);
    return {
      minX: Math.min(start.x, end.x), maxX: Math.max(start.x, end.x),
      minY: Math.min(start.y, end.y), maxY: Math.max(start.y, end.y),
    };
  }, [dragStart, dragEnd]);

  const handleMouseUp = () => {
    if (!selectionBox) return;

    // 1. Identify selected cells
    const selectedIndices = cells.filter((_, i) => {
      const { x, y } = getCoords(i);
      return (
        x >= selectionBox.minX && x <= selectionBox.maxX &&
        y >= selectionBox.minY && y <= selectionBox.maxY
      );
    });

    // 2. Validate Selection (Logic: > 50% are targets)
    const targetCount = selectedIndices.filter(c => c.isTarget).length;
    const success = selectedIndices.length > 0 && (targetCount / selectedIndices.length) > 0.5;

    // 3. Handle Outcome
    setFeedback(success ? "success" : "nope");
    setTimeout(() => setFeedback(null), 500);

    if (success) {
      playSuccessSound(); // Play success sound

      // Update Bins
      setBins(prev => {
        const next = [...prev];
        const incomplete = next.filter(b => b.count < b.goal);
        if (incomplete.length) {
          const bin = incomplete[Math.floor(Math.random() * incomplete.length)];
          bin.count = Math.min(bin.count + targetCount * 2, bin.goal);
          // Update User Score
          if (user) updateUser({ total_points: user.total_points + 10 });
        }
        return next;
      });

      // Regenerate Selected Cells
      setCells(prev => prev.map((cell, i) => {
        const { x, y } = getCoords(i);
        const inBox = x >= selectionBox.minX && x <= selectionBox.maxX &&
          y >= selectionBox.minY && y <= selectionBox.maxY;
        if (!inBox) return cell;

        return {
          ...cell,
          value: Math.floor(Math.random() * 10),
          isTarget: Math.random() > 0.8,
        };
      }));
    } else {
      playNopeSound(); // Play nope sound
    }

    setDragStart(null);
    setDragEnd(null);
  };

  const isSelected = (index: number) => {
    if (selectionBox) {
      const { x, y } = getCoords(index);
      return x >= selectionBox.minX && x <= selectionBox.maxX &&
        y >= selectionBox.minY && y <= selectionBox.maxY;
    }
    return false;
  };

  return (
    <Box
      onMouseUp={handleMouseUp}
      onMouseLeave={() => { setDragStart(null); setDragEnd(null); }}
      sx={{
        width: "100%", height: "100%", p: 2,
        bgcolor: "background.default", color: "text.primary",
        display: "flex", flexDirection: "column", userSelect: "none",
      }}
    >
      {/* Grid Area */}
      <Box
        sx={{
          flexGrow: 1, mb: 2, position: "relative",
          display: "grid", gap: 0.5,
          gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
        }}
      >
        {cells.map((cell, index) => (
          <Box
            key={cell.id}
            onMouseDown={() => { setDragStart(index); setDragEnd(index); }}
            onMouseEnter={() => { if (dragStart !== null) setDragEnd(index); }}
            sx={{
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: cell.isTarget ? "1.2rem" : "1rem",
              fontWeight: cell.isTarget ? "bold" : "normal",
              cursor: "crosshair",
              transition: "all 0.1s",
              bgcolor: isSelected(index) ? "primary.main" : "transparent",
              color: isSelected(index) ? "primary.contrastText" : "inherit",
              opacity: isSelected(index) ? 0.5 : 1,
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            {cell.value}
          </Box>
        ))}

        {/* Feedback Overlay */}
        {feedback && (
          <Box sx={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            bgcolor: "background.paper", px: 4, py: 2, borderRadius: 2, border: "1px solid currentColor",
            color: feedback === "success" ? "success.main" : "error.main",
            pointerEvents: "none", zIndex: 10,
          }}>
            <Typography variant="h4" fontWeight="bold">
              {feedback === "success" ? "REFINED" : "NOPE"}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Progress Bins */}
      <Box sx={{ display: "flex", gap: 2, height: "60px" }}>
        {bins.map((bin) => (
          <Box key={bin.id} sx={{ flex: 1, border: "1px solid", borderColor: "divider", position: "relative", bgcolor: "action.hover" }}>
            <Box sx={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              height: `${(bin.count / bin.goal) * 100}%`,
              bgcolor: bin.color, transition: "height 0.5s ease",
            }} />
            <Box sx={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
              <Typography variant="caption" fontWeight="bold" sx={{ textShadow: "0 1px 2px black", color: "text.primary" }}>{bin.name}</Typography>
              <Typography variant="caption" sx={{ textShadow: "0 1px 2px black", color: "text.primary" }}>{Math.floor((bin.count / bin.goal) * 100)}%</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MacrodataRefinement;