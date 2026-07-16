// PlaneTrail.jsx
// Renders a subtle particle trail that follows the airplane.

import React, { useRef, useEffect } from 'react';

const TrailParticle = ({ x, y, opacity = 0.6, size = 3 }) => (
  <circle
    cx={x}
    cy={y}
    r={size}
    fill="#b0c4de"
    opacity={opacity}
    style={{ mixBlendMode: 'soft-light' }}
  />
);

const PlaneTrail = React.memo(({ pathPoints = [], maxParticles = 12 }) => {
  const trailRef = useRef(null);

  // Only show trail if we have enough path points
  const visiblePoints = pathPoints.slice(-maxParticles);

  return (
    <g ref={trailRef} className="plane-trail">
      {visiblePoints.map((p, idx) => {
        const progress = idx / visiblePoints.length;
        const opacity = 0.5 - progress * 0.45;
        const size = 4 - progress * 3.5;
        return (
          <TrailParticle
            key={idx}
            x={p.x}
            y={p.y}
            opacity={Math.max(0.05, opacity)}
            size={Math.max(0.5, size)}
          />
        );
      })}
    </g>
  );
});

PlaneTrail.displayName = 'PlaneTrail';

export default PlaneTrail;
