// FlightPlane.jsx
// Orchestrates the paper airplane animation, path rendering, and trail.

import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import PlaneSVG from './PlaneSVG';
import PlaneTrail from './PlaneTrail';
import { flightPath, buildSvgPath } from './flightPath';
import { animatePlane, fadeGlow, floatForever, cleanupAnimations } from './planeAnimation';
import './plane.css';

const FlightPlane = React.memo(() => {
  const containerRef = useRef(null);
  const planeRef = useRef(null);
  const pathRef = useRef(null);
  const trailRef = useRef(null);
  const glowRef = useRef(null);

  const [trailPoints, setTrailPoints] = useState([]);
  const [pathData, setPathData] = useState('');

  // Build the path on mount
  useEffect(() => {
    const data = buildSvgPath(flightPath);
    setPathData(data);
  }, []);

  // Update trail points as the plane moves
  const handlePlaneUpdate = useCallback(({ x, y }) => {
    setTrailPoints((prev) => {
      const newPoints = [...prev, { x, y }];
      if (newPoints.length > 18) newPoints.shift();
      return newPoints;
    });
  }, []);

  // Setup GSAP animations
  useEffect(() => {
    if (!pathData || !planeRef.current) return;

    // Draw the path line
    const pathEl = pathRef.current;
    if (pathEl) {
      try {
        // Set the path data
        pathEl.setAttribute('d', pathData);
        const length = pathEl.getTotalLength();
        pathEl.style.strokeDasharray = length;
        pathEl.style.strokeDashoffset = length;

        gsap.to(pathEl, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.flight-container',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        });
      } catch (e) {
        console.warn('Path drawing error:', e);
      }
    }

    // Animate the plane
    const ctx = animatePlane({
      pathData,
      planeRef,
      trailRef,
      onUpdate: handlePlaneUpdate,
    });

    // Fade glow at the end
    const glowCtx = fadeGlow(glowRef);

    // Float forever at the end
    const floatCtx = floatForever(planeRef);

    return () => {
      cleanupAnimations(ctx);
      if (glowCtx) glowCtx.kill();
      if (floatCtx) floatCtx.kill();
    };
  }, [pathData, handlePlaneUpdate]);

  return (
    <div
      ref={containerRef}
      className="flight-container fixed inset-0 pointer-events-none z-50"
      style={{ width: '100vw', height: '100vh' }}
    >
      {/* Hidden SVG path for drawing and motion path */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={pathRef}
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="1.5"
          opacity="0.3"
          className="flight-path"
        />
      </svg>

      {/* The airplane container - positioned absolutely via GSAP */}
      <div
        ref={planeRef}
        className="plane-container absolute"
        style={{
          width: '80px',
          height: '48px',
          top: 0,
          left: 0,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <PlaneSVG />
        {/* Glow reference for fading */}
        <div ref={glowRef} className="absolute inset-0 pointer-events-none" />
      </div>

      {/* Trail overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <PlaneTrail pathPoints={trailPoints} maxParticles={16} />
      </svg>
    </div>
  );
});

FlightPlane.displayName = 'FlightPlane';

export default FlightPlane;
