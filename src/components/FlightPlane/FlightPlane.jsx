// FlightPlane.jsx
// Orchestrates the paper airplane animation across the entire document.

import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import PlaneSVG from './PlaneSVG';
import PlaneTrail from './PlaneTrail';
import { flightPath, buildSvgPath, scalePathToViewport } from './flightPath';
import { animatePlane, fadeGlow, floatForever, cleanupAnimations } from './planeAnimation';
import './plane.css';

const FlightPlane = React.memo(() => {
  const containerRef = useRef(null);
  const planeRef = useRef(null);
  const pathRef = useRef(null);
  const glowRef = useRef(null);

  const [trailPoints, setTrailPoints] = useState([]);
  const [pathData, setPathData] = useState('');
  const [scaledPath, setScaledPath] = useState('');

  // Build and scale the path on mount and resize
  useEffect(() => {
    const updatePath = () => {
      const data = buildSvgPath(flightPath);
      setPathData(data);
      
      // Scale path to viewport
      const vw = window.innerWidth;
      const vh = document.documentElement.scrollHeight || window.innerHeight;
      const scaled = scalePathToViewport(data, vw, vh);
      setScaledPath(scaled);
    };

    updatePath();

    const handleResize = () => {
      updatePath();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    if (!scaledPath || !planeRef.current) return;

    // Update the SVG path for drawing
    const pathEl = pathRef.current;
    if (pathEl) {
      try {
        pathEl.setAttribute('d', scaledPath);
        const length = pathEl.getTotalLength();
        pathEl.style.strokeDasharray = length;
        pathEl.style.strokeDashoffset = length;

        gsap.to(pathEl, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
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
      pathData: scaledPath,
      planeRef,
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
  }, [scaledPath, handlePlaneUpdate]);

  return (
    <div
      ref={containerRef}
      className="flight-plane-overlay fixed inset-0 pointer-events-none z-50"
    >
      {/* SVG path that spans the entire page */}
      <svg
        className="absolute inset-0 w-full"
        style={{ 
          pointerEvents: 'none',
          height: '100vh',
        }}
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
