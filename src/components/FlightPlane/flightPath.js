// flightPath.js
// Defines the master path for the paper airplane to follow across the website.
// Coordinates are in viewport percentage for responsiveness.

export const flightPath = [
  // Hero: Enter from top-left
  { x: -15, y: -10 },
  { x: 5, y: 12 },
  { x: 20, y: 18 },

  // Gallery: Loop around "Memories"
  { x: 35, y: 22 },
  { x: 48, y: 18 }, // loop top
  { x: 55, y: 28 }, // loop right
  { x: 48, y: 38 }, // loop bottom
  { x: 42, y: 30 }, // loop exit

  // Letter: Smooth curve
  { x: 45, y: 40 },
  { x: 50, y: 48 },
  { x: 55, y: 52 },

  // Timeline: Horizontal flight
  { x: 60, y: 55 },
  { x: 70, y: 56 },
  { x: 82, y: 54 },

  // Wish: Final destination
  { x: 88, y: 50 },
  { x: 92, y: 45 },
  { x: 95, y: 42 },
];

/**
 * Converts path array to a string of SVG commands (M, C, S).
 * Uses Catmull-Rom spline via cubic bezier approximation for smooth curves.
 */
export function buildSvgPath(points) {
  if (!points || points.length < 2) return '';
  const first = points[0];
  let d = `M ${first.x} ${first.y}`;

  // Use simple cubic beziers for smoothness
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
