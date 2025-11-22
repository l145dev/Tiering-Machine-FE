import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

interface NumberCell {
  id: number;
  value: number;
  isTarget: boolean;
  x: number;
  y: number;
}

interface Bin {
  id: number;
  name: string;
  count: number;
  goal: number;
  color: string;
}

const GRID_ROWS = 10;
const GRID_COLS = 15;
const TOTAL_CELLS = GRID_ROWS * GRID_COLS;

const MacrodataRefinement = () => {
  const { user, updateUser } = useUser();
  const [cells, setCells] = useState<NumberCell[]>([]);
  const [bins, setBins] = useState<Bin[]>([
    { id: 0, name: "WO", count: 0, goal: 100, color: "#05C3A8" },
    { id: 1, name: "FC", count: 0, goal: 100, color: "#1EEFFF" },
    { id: 2, name: "DR", count: 0, goal: 100, color: "#DF81D5" },
    { id: 3, name: "MA", count: 0, goal: 100, color: "#F9ECBB" },
  ]);
  const [selection, setSelection] = useState<{ start: number | null; end: number | null }>({ start: null, end: null });
  const [isDragging, setIsDragging] = useState(false);
  const [feedback, setFeedback] = useState<"success" | "nope" | null>(null);

  useEffect(() => {
    const newCells: NumberCell[] = [];
    for (let i = 0; i < TOTAL_CELLS; i++) {
      newCells.push({
        id: i,
        value: Math.floor(Math.random() * 10),
        isTarget: Math.random() > 0.8,
        x: i % GRID_COLS,
        y: Math.floor(i / GRID_COLS),
      });
    }
    setCells(newCells);
  }, []);

  const handleMouseDown = (index: number) => {
    setIsDragging(true);
    setSelection({ start: index, end: index });
  };

  const handleMouseEnter = (index: number) => {
    if (isDragging) {
      setSelection((prev) => ({ ...prev, end: index }));
    }
  };

  const handleMouseUp = () => {
    if (!isDragging || selection.start === null || selection.end === null) return;
    setIsDragging(false);
    processSelection();
    setSelection({ start: null, end: null });
  };

  const processSelection = () => {
    if (selection.start === null || selection.end === null) return;

    const startX = selection.start % GRID_COLS;
    const startY = Math.floor(selection.start / GRID_COLS);
    const endX = selection.end % GRID_COLS;
    const endY = Math.floor(selection.end / GRID_COLS);

    const minX = Math.min(startX, endX);
    const maxX = Math.max(startX, endX);
    const minY = Math.min(startY, endY);
    const maxY = Math.max(startY, endY);

    const selectedCells = cells.filter(cell =>
      cell.x >= minX && cell.x <= maxX && cell.y >= minY && cell.y <= maxY
    );

    const targetCount = selectedCells.filter(c => c.isTarget).length;
    const totalCount = selectedCells.length;

    if (totalCount > 0 && targetCount / totalCount > 0.5) {
      setFeedback("success");
      setTimeout(() => setFeedback(null), 500);

      setBins(prev => {
        const newBins = [...prev];
        const incompleteBins = newBins.filter(b => b.count < b.goal);
        if (incompleteBins.length > 0) {
          const randomBin = incompleteBins[Math.floor(Math.random() * incompleteBins.length)];
          randomBin.count = Math.min(randomBin.count + targetCount * 2, randomBin.goal);
          if (user) {
            updateUser({ total_points: user.total_points + 10 });
          }
        }
        return newBins;
      });

      setCells(prev => prev.map(cell => {
        if (cell.x >= minX && cell.x <= maxX && cell.y >= minY && cell.y <= maxY) {
          return {
            ...cell,
            value: Math.floor(Math.random() * 10),
            isTarget: Math.random() > 0.8
          };
        }
        return cell;
      }));
    } else {
      setFeedback("nope");
      setTimeout(() => setFeedback(null), 500);
    }
  };

  const isSelected = (index: number) => {
    if (selection.start === null || selection.end === null) return false;

    const startX = selection.start % GRID_COLS;
    const startY = Math.floor(selection.start / GRID_COLS);
    const endX = selection.end % GRID_COLS;
    const endY = Math.floor(selection.end / GRID_COLS);

    const minX = Math.min(startX, endX);
    const maxX = Math.max(startX, endX);
    const minY = Math.min(startY, endY);
    const maxY = Math.max(startY, endY);

    const curX = index % GRID_COLS;
    const curY = Math.floor(index / GRID_COLS);

    return curX >= minX && curX <= maxX && curY >= minY && curY <= maxY;
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "#010A13",
        color: "#ABFFE9",
        display: "flex",
        flexDirection: "column",
        p: 2,
        userSelect: "none"
      }}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
          gap: 0.5,
          mb: 2,
          position: "relative"
        }}
      >
        {cells.map((cell, index) => (
          <Box
            key={cell.id}
            onMouseDown={() => handleMouseDown(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: cell.isTarget ? "1.2rem" : "1rem",
              fontWeight: cell.isTarget ? "bold" : "normal",
              cursor: "crosshair",
              bgcolor: isSelected(index) ? "rgba(171, 255, 233, 0.2)" : "transparent",
              color: cell.isTarget ? "#fff" : "inherit",
              transition: "all 0.1s",
              "&:hover": {
                bgcolor: "rgba(171, 255, 233, 0.1)"
              }
            }}
          >
            {cell.value}
          </Box>
        ))}

        {feedback && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "rgba(0,0,0,0.8)",
              color: feedback === "success" ? "#1EEFFF" : "#FF5252",
              px: 4,
              py: 2,
              borderRadius: 2,
              border: "1px solid currentColor",
              zIndex: 10,
              pointerEvents: "none"
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              {feedback === "success" ? "REFINED" : "NOPE"}
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 2, height: "60px" }}>
        {bins.map(bin => (
          <Box
            key={bin.id}
            sx={{
              flex: 1,
              border: "1px solid #333",
              position: "relative",
              bgcolor: "rgba(0,0,0,0.3)"
            }}
          >
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: `${(bin.count / bin.goal) * 100}%`,
                bgcolor: bin.color,
                transition: "height 0.5s ease"
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1
              }}
            >
              <Typography variant="caption" fontWeight="bold" sx={{ color: "#fff", textShadow: "0 1px 2px black" }}>
                {bin.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "#fff", textShadow: "0 1px 2px black" }}>
                {Math.floor((bin.count / bin.goal) * 100)}%
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MacrodataRefinement;
