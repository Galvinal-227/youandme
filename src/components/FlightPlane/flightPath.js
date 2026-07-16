// flightPath.js
// Defines the master path for the paper airplane across the entire document.
// Coordinates use viewport percentages (0-100) for full page coverage.

export const flightPath = [
  // Hero: Enter from top-left (0% scroll)
  { x: -10, y: 5 },
  { x: 5, y: 15 },
  { x: 20, y: 25 },

  // Gallery: Loop around "Memories" (~25% scroll)
  { x: 35, y: 30 },
  { x: 48, y: 25 }, // loop top
  { x: 55, y: 35 }, // loop right
  { x: 48, y: 45 }, // loop bottom
  { x: 42, y: 38 }, // loop exit

  // Story: Smooth curve (~50% scroll)
  { x: 45, y: 48 },
  { x: 50, y: 55 },
  { x: 55, y: 60 },

  // Love / Profile / Ultah: Horizontal flight (~70% scroll)
  { x: 60, y: 65 },
  { x: 70, y: 68 },
  { x: 82, y: 66 },

  // Love Message: Final destination (~90% scroll)
  { x: 88, y: 62 },
  { x: 92, y: 55 },
  { x: 95, y: 48 },
];

/**
 * Converts path array to a string of SVG commands (M, C).
 * Uses cubic bezier approximation for smooth curves.
 */
export function buildSvgPath(points) {
  if (!points || points.length < 2) return '';
  const first = points[0];
  let d = `M ${first.x} ${first.y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cp1x = p0.x + (p1.x - p0.x) / 3;
    const cp1y = p0.y + (p1.y - p0.y) / 3;
    const cp2x = p0.x + (2 * (p1.x - p0.x)) / 3;
    const cp2y = p0.y + (2 * (p1.y - p0.y)) / 3;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

/**
 * Scale path coordinates to fit the viewport.
 * Converts percentage-based coordinates to pixel values.
 */
export function scalePathToViewport(pathData, viewportWidth, viewportHeight) {
  if (!pathData) return '';
  
  // Parse the path and scale coordinates
  return pathData.replace(
    /([MC])\s*([\d.-]+)\s*([\d.-]+)/g,
    (match, command, x, y) => {
      const scaledX = (parseFloat(x) / 100) * viewportWidth;
      const scaledY = (parseFloat(y) / 100) * viewportHeight;
      return `${command} ${scaledX} ${scaledY}`;
    }
  );
}
